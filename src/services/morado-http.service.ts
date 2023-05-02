import { Injectable } from '@nestjs/common';

import { IRequestHttp } from '../model/interface/request-http.interface';
import { ResponseHttp } from '../model/response-http';
import { IMoradoHttpService } from '../model/interface/morado-http.interface';
import { AxiosService } from './axios.service';

// @ts-ignore
@Injectable()
export class MoradoHttp implements IMoradoHttpService {
  constructor(private readonly httpService: AxiosService) {}

  async post<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>> {
    return this.httpService.post(requestHttp);
  }

  async put<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>> {
    return this.httpService.put(requestHttp);
  }

  async patch<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>> {
    return this.httpService.patch(requestHttp);
  }
  
  async delete<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>> {
    return this.httpService.delete(requestHttp);
  }

  async get<T> (requestHttp: IRequestHttp): Promise<ResponseHttp<T>> {
    return this.httpService.get(requestHttp);
  }
}
