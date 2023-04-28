import { ResponseHttp } from "../model/ResponseHttp";
import { IRequestHttp } from "../model/interface/IRequestHttp";

export interface IWrapperHttpService {
  get<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>>;
  post<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>>;
  put<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>>;
  patch<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>>;
  delete<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>>;
}
