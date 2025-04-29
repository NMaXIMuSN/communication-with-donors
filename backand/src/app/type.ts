export interface ISearchVariables<TData, TFilter = Record<string, unknown>> {
  limit?: number;
  offset?: number;
  search?: string;
  sort?: Record<keyof TData, 'asc' | 'desc'>;
  filter?: TFilter;
}

export interface ISearchResponse<TData> {
  data: TData[];
  paging: {
    total: number;
    offset: number;
    lastPage: number;
  };
}

export type TSearchApi<TData, TFilter> = (
  data: ISearchVariables<TData, TFilter>,
) => ISearchResponse<TData>;
