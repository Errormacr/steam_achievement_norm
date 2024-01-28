"use strict";const c=require("electron"),_=require("path"),S=require("express"),q=require("cors"),l=require("node-fetch");class b{constructor(){this.app=S(),this.app.use(q({origin:"*",methods:["GET","POST"],allowedHeaders:"*"})),this.app.use(S.json()),this.app.post("/data",this.handleDataRequest.bind(this)),this.app.get("/recent",this.handleRecentRequest.bind(this)),this.app.get("/player_sum",this.handlePlayerSumRequest.bind(this)),this.app.get("/owned",this.handleOwnedGamesRequest.bind(this)),this.app.listen(4500,()=>{console.log("listening on 4500")})}async fetchData(s,e=3){let r=0;for(;r<e;)try{const t=await l(s);if(!t.ok)throw new Error(`Failed to fetch data from ${s}. Status: ${t.status}`);return t.json()}catch(t){r++,console.error(`Attempt ${r} failed: ${t.message}`),await new Promise(n=>setTimeout(n,1e3))}throw new Error(`Failed to fetch data from ${s} after ${e} attempts`)}async get_data(s,e,r,t){try{let n={};return(await Promise.all(s.filter(a=>a[2]!="0.0").map(async a=>{try{const i=`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${a[0]}&key=${r}&steamid=${e}&l=${t}`,u=`http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${a[0]}&format=json`,v=`https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?appid=${a[0]}&key=${r}&l=${t}`,y=[i,u,v];return await Promise.all([...y.map(d=>this.fetchData(d)),{appid:a[0]},{last_launch_time:a[1]},{playtime:a[2]}])}catch(i){return n[a[0]]=i,console.log(n),console.error(a),null}}))).filter(a=>a&&a[0].playerstats.gameName&&a[1].achievementpercentages.achievements&&a[0].playerstats.achievements&&a[2].game).map(a=>{try{const i=a[1].achievementpercentages.achievements,u=a[0].playerstats.achievements,y=a[2].game.availableGameStats.achievements.reduce((w,d)=>{const f=u.find(g=>g.apiname===d.name);delete f.apiname;let p=i.find(g=>g.name===d.name);return p||(p={name:d.name,percent:.1}),f&&p&&w.push({...d,...f,...p}),w},[]);return{appid:a[3].appid,last_launch_time:a[4].last_launch_time,playtime:a[5].playtime,gameName:a[0].playerstats.gameName,Achievement:y}}catch(i){return console.log(i),i}})}catch(n){throw console.error(n),new Error("An error occurred while retrieving data from Steam Web API")}}async getFriendList(s,e){try{return(await l(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${s}&steamid=${e}`)).data.friendslist.friends.map(n=>n.steamid)}catch(r){return console.error("Ошибка при получении списка друзей:",r),[]}}async getPersonData(s,e){try{const t=(await l(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${s}&steamids=${e}`)).data.friendslist.friends.map(n=>n.steamid)}catch(r){return console.error("Ошибка при получении данных друга:",r),[]}}async handleDataRequest(s,e){const r=s.body.appid,{steam_id:t,key:n,lang:o}=s.query;isNaN(t)&&e.send("steam_id must be a number");try{const m=await this.get_data(JSON.parse(r),t,n,o);e.send(m)}catch(m){e.send(m.message)}}async handleRecentRequest(s,e){const r=s.query.key,t=s.query.id;if(isNaN(t)){e.send("steam_id must be a number");return}try{const o=await(await l(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${r}&steamid=${t}&format=json`)).json();e.send(o)}catch(n){e.send(n.message)}}async handlePlayerSumRequest(s,e){const r=s.query.key;let t=s.query.id;if(!t){e.status(400).send("Parameter 'id' is required");return}if(t=t.replace(/\[|\]/g,"").split(","),t.some(o=>!/^\d+$/.test(o))){e.status(400).send("All elements in the array must be numbers");return}const n=t.join(",");try{const m=await(await l(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${r}&steamids=${n}&format=json`)).json();e.send(m)}catch{e.status(500).send("Internal Server Error")}}async handleOwnedGamesRequest(s,e){const r=s.query.key,t=s.query.id;isNaN(t)&&e.send("steam_id must be a number");try{const o=await(await l(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${r}&steamid=${t}&format=json&include_appinfo=true&include_played_free_games=true`)).json();e.send(o)}catch{e.status(500).send("Internal Server Error")}}}require("electron-squirrel-startup")&&c.app.quit();const $=()=>{const h=new c.BrowserWindow({width:800,height:600,webPreferences:{preload:_.join(__dirname,"preload.js")}});h.loadURL("http://localhost:5173"),h.webContents.openDevTools()};c.app.on("ready",()=>{new b,$()});c.app.on("window-all-closed",()=>{process.platform!=="darwin"&&c.app.quit()});c.app.on("activate",()=>{c.BrowserWindow.getAllWindows().length===0&&$()});