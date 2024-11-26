export interface Achievements {
    appid : number;
    name : string;
    hidden : number;
    icon : string;
    grayIcon : string;
    percent : number;
    steamID : string;
    unlocked : boolean;
    unlockedDate : Date;
    language : string;
    description : string;
    displayName : string;
}
export interface AchievmentsFromView {
    appid : number;
    name : string;
    hidden : number;
    icon : string;
    grayIcon : string;
    percent : number;
    steamID : string;
    unlocked : boolean;
    unlockedDate : Date | null;
    language : string;
    description : string;
    lowerDisplayName : string;
    displayName : string;
    game?: achGame
}

interface achGame {
    gamename : string
}

export interface RareAchievementCount {
    [key : string] : number
}

export interface TimeAchievementCount {
    date : string
    count : number
}

export interface RareAchievementCountStats {
    _count : {
        percent: number
    }
    percent : number
}
