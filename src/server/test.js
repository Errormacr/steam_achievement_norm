const {app} = require("electron");

async function getFriendList(apiKey, steamId) {
    try {
        const response = await fetch(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${apiKey}&steamid=${steamId}`);
        const data = await response.json();

        const friendIds = data
            .friendslist
            .friends
            .map(friend => friend.steamid);
        return friendIds;
    } catch (error) {
        console.error('Ошибка при получении списка друзей:', error);
        return [];
    }
}

async function getPersonData(key, ids) {
    try {
        const response = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${ids}`);
        const data = await response.json();

        const friendData = data
            .response
            .players
            .map(player => ({steamid: player.steamid, name: player.personaname, avatar: player.avatar}));

        return friendData;
    } catch (error) {
        console.error('Ошибка при получении данных друга:', error);
        return [];
    }
}
async function getFriendsGames(key, friends) {
    const links = friends.map(friend => {
        return [`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${friend['steamid']}&format=json`];
    });

    const fetchPromises = links.map(async(link, index) => {
        const response = await fetch(link);
        const data = await response.json();
        return {friend: friends[index], data};
    });

    try {
        const responses = await Promise.all(fetchPromises);
        return responses;
    } catch (error) {
        console.error(error);
    }
}
async function getAvgPercents(friend) {
    const averagePercentages = friend['game_data'].map(game => {
        const totalAchievements = game.Achievement.length;
        const totalAchieved = game
            .Achievement
            .reduce((sum, achievement) => sum + achievement.achieved, 0);
        const averagePercentage = (totalAchieved / totalAchievements) * 100 || 0;
        return {
            gamename: game.gameName,
            averagePercentage: averagePercentage.toFixed(2)
        };
    });
    return averagePercentages;
}

async function get_data(urls_a, ip, key) {
    const data_key = key;
    const data_st_id = ip;
    const responses = urls_a['games'].map(appid => {
        console.log(appid);
        const ach_url = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid['appid']}&key=${data_key}&steamid=${data_st_id}`;
        const perc_url = `http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${appid['appid']}&format=json`;
        const urls = [ach_url, perc_url];

        // Add CORS headers to the request
        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://localhost:4500');
        headers.append('timeout', '1000');

        return Promise.all([
            ...urls.map(url => fetch(url, {headers}).then(response => response.json())), {
                'appid': appid['appid']
            }
        ]);
    });

    try {
        const results = await Promise.all(responses);

        const ret_data = results.flatMap(data => {
            const gameName = data[0]
                ?.playerstats
                    ?.gameName;
            const achievements = data[1]
                ?.achievementpercentages
                    ?.achievements;
            const playerAchievements = data[0]
                ?.playerstats
                    ?.achievements;

            if (!gameName || !achievements || !playerAchievements) {
                return [];
            }

            const mergedArray = playerAchievements.map(curr => {
                const matchingObjInArr3 = achievements.find(obj => obj.name === curr.name) || {
                    name: curr.name,
                    percent: 0.01
                };

                return {
                    ...curr,
                    ...matchingObjInArr3
                };
            });

            return {gameName, Achievement: mergedArray};
        });

        return {steamID: ip, game_data: ret_data};
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while retrieving data from Steam Web API');
    }
}

async function getPolnAvgPercents(friendGameData) {
    let gameWithAch = 0
    const percent = friendGameData.reduce((sum, game) => {
        if (game.averagePercentage > 0) {
            gameWithAch++;
        }
        return sum + parseFloat(game.averagePercentage);
    }, 0);
    const avg = percent/gameWithAch;
        return avg.toFixed(2);
}

async function main() {
    const apiKey = '707619165ECF51261230240F6290B8F0';
    const steamId = '76561198126403886';

    try {
        const friendList = await getFriendList(apiKey, steamId);
        console.log('Friend IDs:', friendList);


        const friendData = await getPersonData(apiKey, friendList);
        //console.log('Friend Data:', friendData);

        const friendGame = await getFriendsGames(apiKey, friendData);
        //console.log('Friend Game:', friendGame);
        const friendGameData = await get_data(friendGame[2]['data']['response'], friendGame[2]["friend"]["steamid"], apiKey);
        //console.log('Friend Game Data:', friendGameData);

        const FriendAVG = await getAvgPercents(friendGameData);
        console.log('Friend Game AVG:', FriendAVG);

        const FriendPolnAVG = await getPolnAvgPercents(FriendAVG);
        console.log('Friend Game poln AVG:', FriendPolnAVG);

    } catch (error) {
        console.error('Ошибка при выполнении программы:', error);
    }
}

main();
