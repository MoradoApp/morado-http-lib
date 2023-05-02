import { ResponseHttp } from "../response-http";
import { IRequestHttp } from "./request-http.interface";

export interface IMoradoHttpService {
  get<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>>;
  post<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>>;
  put<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>>;
  patch<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>>;
  delete<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>>;
}
