import { ResponseHttp } from '../response-http';
import { RequestHttp } from './request-http.interface';

export interface MoradoHttpService {
  get<T>(requestHttp: RequestHttp): Promise<ResponseHttp<T>>;
  post<T>(requestHttp: RequestHttp): Promise<ResponseHttp<T>>;
  put<T>(requestHttp: RequestHttp): Promise<ResponseHttp<T>>;
  patch<T>(requestHttp: RequestHttp): Promise<ResponseHttp<T>>;
  delete<T>(requestHttp: RequestHttp): Promise<ResponseHttp<T>>;
}
