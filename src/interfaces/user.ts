import { GameData } from '.';

export interface UserData {
    user : User;
    gameCount : number;
    achCount : number;
}

export interface User {
    steamID : string;
    avatarSmall : string;
    avatarMedium : string;
    avatarLarge : string;
    avatarHash : string;
    nickname : string;
    percent : number;
    gameDatas?: GameData[];
}

export interface KeyResponse {
    statusCode : number;
    message : string
}

export interface ProfileUpdateResponse {
    updated: boolean;
    changes: {
        nickname: boolean;
        avatar: boolean;
    };
}
