/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

export default class SteamDataFetcher {
  constructor () {
    this.app = express();
    this.app.use(cors({
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: '*'
    }));
    this.app.use(express.json());
    this.app.post('/data', this.handleDataRequest.bind(this));
    this.app.get('/recent', this.handleRecentRequest.bind(this));
    this.app.get('/player_sum', this.handlePlayerSumRequest.bind(this));
    this.app.get('/owned', this.handleOwnedGamesRequest.bind(this));
    this.app.listen(4500, () => {
      console.log('listening on 4500');
    });
  }

  async fetchData (url, maxRetries = 3) {
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${url}. Status: ${response.status}`);
        }

        return response.json();
      } catch (error) {
        attempts++;
        // console.error(`Attempt ${attempts} failed: ${error.message}`);

        // Пауза перед следующей попыткой (можно настроить по желанию)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw new Error(`Failed to fetch data from ${url} after ${maxRetries} attempts`);
  }

  async get_data (urls_a, ip, key, lang) {
    try {
      const q = {};
      const responses = await Promise.all(urls_a.map(async (appid) => {
        try {
          const ach_url = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid[0]}&key=${key}&steamid=${ip}&l=${lang}`;
          const perc_url = `https://api.steampowered.com/IPlayerService/GetGameAchievements/v1/?format=json&appid=${appid[0]}&language=${lang}`;
          const ico_url = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?appid=${appid[0]}&key=${key}&l=${lang}`;
          const urls = [ach_url, perc_url, ico_url];
          const data = await Promise.all([
            ...urls.map(url => this.fetchData(url)), {
              appid: appid[0]
            }, {
              last_launch_time: appid[1]
            }, {
              playtime: appid[2]
            }
          ]);

          return data;
        } catch (err) {
          q[appid[0]] = err;
          // console.log(q);
          // console.error(appid);
          return null; // or some default/error object
        }
      }));
      const results = responses.filter((data) => {
        return data && data[0].playerstats.gameName && data[1].response.achievements && data[0].playerstats.achievements && data[2].game;
      });
      const ret_data = results.map((data) => {
        try {
          const arr1 = data[1].response.achievements;
          const arr2 = data[0].playerstats.achievements;
          const arr3 = data[2].game.availableGameStats.achievements;
          const mergedArray = arr3.reduce((acc, curr) => {
            const matchingObjInArr2 = arr2.find(obj => obj.apiname === curr.name);
            delete matchingObjInArr2.apiname;
            let matchingObjInArr3 = arr1.find(obj => obj.internal_name === curr.name);
            if (!matchingObjInArr3) {
              matchingObjInArr3 = {
                name: curr.name,
                percent: 0.1
              };
            }
            if (matchingObjInArr2 && matchingObjInArr3) {
              matchingObjInArr3.description = matchingObjInArr3.localized_desc;
              delete matchingObjInArr3.localized_desc;
              matchingObjInArr3.displayName = matchingObjInArr3.localized_name;
              delete matchingObjInArr3.localized_name;
              matchingObjInArr3.percent = Number(matchingObjInArr3.player_percent_unlocked);
              delete matchingObjInArr3.player_percent_unlocked;
              delete matchingObjInArr3.icon;
              delete matchingObjInArr3.icon_gray;
              acc.push({
                ...curr,
                ...matchingObjInArr2,
                ...matchingObjInArr3
              });
            }
            return acc;
          }, []);
          return { appid: data[3].appid, last_launch_time: data[4].last_launch_time, playtime: data[5].playtime, gameName: data[0].playerstats.gameName, Achievement: mergedArray };
        } catch (error) {
          // console.log(error);
          return (error);
        }
      });

      return ret_data;
    } catch (error) {
      // console.error(error);
      throw new Error('An error occurred while retrieving data from Steam Web API');
    }
  }

  async getFriendList (apiKey, steamId) {
    try {
      const response = await fetch(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${apiKey}&steamid=${steamId}`);

      const friendIds = response
        .data
        .friendslist
        .friends
        .map(friend => friend.steamid);
      return friendIds;
    } catch (error) {
      console.error('Ошибка при получении списка друзей:', error);
      return [];
    }
  }

  async getPersonData (key, ids) {
    try {
      const response = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${ids}`);
      const friendDate = response
        .data
        .friendslist
        .friends
        .map(friend => friend.steamid);
    } catch (error) {
      console.error('Ошибка при получении данных друга:', error);
      return [];
    }
  }

  async handleDataRequest (req, res) {
    const array = req.body.appid;
    const { steam_id, key, lang } = req.query;
    if (isNaN(steam_id)) {
      res.send('steam_id must be a number');
    }
    try {
      const data = await this.get_data(JSON.parse(array), steam_id, key, lang);
      res.send(data);
    } catch (err) {
      res.send(err.message);
    }
  }

  async handleRecentRequest (req, res) {
    const key = req.query.key;
    const id = req.query.id;

    if (isNaN(id)) {
      res.send('steam_id must be a number');
      return; // Add return to stop execution if id is not a number
    }

    try {
      const response = await fetch(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${id}&format=json`);
      const data = await response.json(); // Await the JSON promise

      res.send(data);
    } catch (err) {
      res.send(err.message);
    }
  }

  async handlePlayerSumRequest (req, res) {
    const key = req.query.key;
    let id = req.query.id;

    if (!id) {
      res.status(400).send("Parameter 'id' is required");
      return;
    }

    // Убираем лишние символы "[" и "]" и разбиваем строку на массив
    id = id.replace(/\[|\]/g, '').split(',');

    // Проверяем, что все элементы массива являются числами
    if (id.some(item => !/^\d+$/.test(item))) {
      res.status(400).send('All elements in the array must be numbers');
      return;
    }

    const steamIdsString = id.join(',');

    try {
      const response = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamIdsString}&format=json`);
      const data = await response.json();
      res.send(data);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  }

  async handleOwnedGamesRequest (req, res) {
    const key = req.query.key;
    const id = req.query.id;
    if (isNaN(id)) {
      res.send('steam_id must be a number');
    }
    try {
      const response = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${id}&format=json&include_appinfo=true&include_played_free_games=true`);
      const data = await response.json();
      res.send(data);
    } catch (error) {
      res
        .status(500)
        .send('Internal Server Error');
    }
  }
}
