export interface Response<T = any> {
  code: number;
  data: T;
  msg: string;
}

export interface ListResponse<T = any> {
  code: number;
  count: number;
  data: T[];
}
