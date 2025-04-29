export interface ISearchResponse<T> {
    data: T[];
    page: {
        total: number;
        offset: number;
        lastPage: number;
    };
}
