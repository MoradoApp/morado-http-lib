import { AxiosInstance } from "axios";

export interface IRequestHttp {
  url: string;
  retry?: number;
  body?: unknown;
  printTimming?: boolean;
  queryParams?: { [key: string]: string };
  headers?: { [key: string]: string };
}
