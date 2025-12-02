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
    game?: AchGame
}

interface AchGame {
    gamename : string
}

export interface RareAchievementCount {
    [key : string] : number
}
export interface TimeAveragePercent {
    [key : string] : number
}
export interface TimeAchievementCount {
    date : string
    count : number
}

export interface AchContainerProps {
    appid?: number;
    all : boolean;
    minPercent?: number;
    maxPercent?: number;
    date?: string;
    unlocked?: boolean;
}
