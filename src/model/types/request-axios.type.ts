import { AxiosRequestConfig } from 'axios';

export type AxiosRequestType = AxiosRequestConfig & { retry: number, retryDelay: number, meta?: { [key: string]: string | number }};
