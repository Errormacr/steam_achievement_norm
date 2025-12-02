export interface Pagination<Row> {
    rows: Row[];
    count: number;
    pages: number;
}

export interface Filters {
    searchQuery: string
    selectedValue: string
    selectedTimeFilterValue: string | null
    selectedCompletionFilterValue: string | null
    desc: boolean
}

export interface ApiResponse {
    message: string;
}
