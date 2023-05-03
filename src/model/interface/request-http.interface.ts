export interface RequestHttp {
  url: string;
  retry?: number;
  body?: unknown;
  printTimming?: boolean;
  queryParams?: { [key: string]: string };
  headers?: { [key: string]: string };
}
