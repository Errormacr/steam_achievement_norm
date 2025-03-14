import { AchievmentsFromView } from '.';

export interface UpdatedGame {
    updatet: Updated[];
    success?: boolean;
    percent: Percent;
}
export interface UpdateGameEvent {
    appid: number;
    gamename: string;
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

export interface GameDataRow extends Omit<GameData, 'gainedAch'>{
    allAchCount: number;
    unlockedCount: number;
    notUnlockedCount: number;
    lastLaunchTime: Date;
    percent: number;
    playtime: number;
    game?: Game;
}

export interface Game {
    appid: number;
    gamename: string;
    lowerGamename: string;
}

export interface gameDataWithAch {
    appid: number;
    gamename: string;
    lowerGamename: string;
    userData: GameUserData[];
    achievmentsFromView?: AchievmentsFromView[];
    achievementCount: number;
}

export interface GameUserData {
    steamID: string;
    appid: number;
    gainedAch: number;
    lastLaunchTime: string;
    percent: number;
    playtime: number;
}
