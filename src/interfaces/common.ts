export interface Pagination<Row> {
    rows: Row[];
    count: number;
    pages: number;
}
