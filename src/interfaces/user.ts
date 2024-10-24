import { GameData } from '.';

export interface UserData {
    user: User;
    gameCount: number;
    achCount: number;
}

export interface User {
    steamID: string;
    avatarSmall: string;
    avatarMedium: string;
    avatarLarge: string;
    avatarHash: string;
    nickname: string;
    percent: number;
    gameDatas?: GameData[];
}
