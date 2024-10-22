export interface UpdatedGame {
    updatet: Updated[];
    percent: Percent;
}

export interface Percent {
    oldPercent: number;
    newPercent: number;
    change: number;
}

export interface Updated {
    appid: number;
    gamename: string;
    lowerGamename: string;
}

export interface GameData {
    steamID: string;
    appid: number;
    gainedAch: number;
    lastLaunchTime: Date;
    percent: number;
    playtime: number;
}
