export interface TableData {
    data: {'achievements':DatumClass[], 'allAch': boolean};
}

export interface DatumClass {
    achieved: number;
    defaultvalue: number;
    description: string;
    displayName: string;
    hidden: number;
    icon: string;
    icongray: string;
    name: string;
    percent: number;
    unlockedTimestamp: number;
}
