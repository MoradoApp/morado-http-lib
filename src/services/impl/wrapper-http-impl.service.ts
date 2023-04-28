import { Injectable } from '@nestjs/common';

import { IRequestHttp } from '../../model/interface/IRequestHttp';
import { ResponseHttp } from '../../model/ResponseHttp';
import { IWrapperHttpService } from '../IWrapperHttpService';
import { AxiosImplService } from './axios-impl.service';

// @ts-ignore
@Injectable()
export class WrapperHttpLibService implements IWrapperHttpService {

  constructor(private readonly httpService: AxiosImplService) {}

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
