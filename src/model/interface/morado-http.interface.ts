import { RequestHttp } from './request-http.interface';

export interface MoradoHttpService {
  get<T>(requestHttp: RequestHttp): Promise<T>;
  post<T>(requestHttp: RequestHttp): Promise<T>;
  put<T>(requestHttp: RequestHttp): Promise<T>;
  patch<T>(requestHttp: RequestHttp): Promise<T>;
  delete<T>(requestHttp: RequestHttp): Promise<T>;
}
