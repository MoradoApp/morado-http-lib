import { Injectable } from '@nestjs/common';

import { AxiosService } from './axios.service';
import { RequestHttp } from '../model/interface/request-http.interface';
import { MoradoHttpService } from '../model/interface/morado-http.interface';

@Injectable()
export class MoradoHttp implements MoradoHttpService {
  constructor(private readonly httpService: AxiosService) {}

  async post<T>(requestHttp: RequestHttp): Promise<T> {
    return this.httpService.post(requestHttp);
  }

  async put<T>(requestHttp: RequestHttp): Promise<T> {
    return this.httpService.put(requestHttp);
  }

  async patch<T>(requestHttp: RequestHttp): Promise<T> {
    return this.httpService.patch(requestHttp);
  }

  async delete<T>(requestHttp: RequestHttp): Promise<T> {
    return this.httpService.delete(requestHttp);
  }

  async get<T>(requestHttp: RequestHttp): Promise<T> {
    return this.httpService.get(requestHttp);
  }
}
