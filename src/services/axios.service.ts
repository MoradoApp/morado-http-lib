import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';

import { delay } from '../utils';
import { AxiosRequestType } from '../model/types/request-axios.type';
import { RequestHttp } from '../model/interface/request-http.interface';
import { MoradoHttpService } from '../model/interface/morado-http.interface';

@Injectable()
export class AxiosService implements MoradoHttpService {
  constructor(private readonly configService: ConfigService) {}

  async get<T>(requestHttp: RequestHttp): Promise<T> {
    return this.excecuteOperation(
      'get',
      this.getOptions(requestHttp),
      requestHttp,
      this.getAxiosInstance(requestHttp.printTimming),
    );
  }

  async post<T>(requestHttp: RequestHttp): Promise<T> {
    return this.excecuteOperation(
      'post',
      this.getOptions(requestHttp),
      requestHttp,
      this.getAxiosInstance(requestHttp.printTimming),
    );
  }

  async put<T>(requestHttp: RequestHttp): Promise<T> {
    return this.excecuteOperation(
      'put',
      this.getOptions(requestHttp),
      requestHttp,
      this.getAxiosInstance(requestHttp.printTimming),
    );
  }

  async patch<T>(requestHttp: RequestHttp): Promise<T> {
    return this.excecuteOperation(
      'patch',
      this.getOptions(requestHttp),
      requestHttp,
      this.getAxiosInstance(requestHttp.printTimming),
    );
  }

  async delete<T>(requestHttp: RequestHttp): Promise<T> {
    return this.excecuteOperation(
      'delete',
      this.getOptions(requestHttp),
      requestHttp,
      this.getAxiosInstance(requestHttp.printTimming),
    );
  }

  private async excecuteOperation<T>(
    operation: string,
    axiosConfig: AxiosRequestType,
    requestHttp: RequestHttp,
    customAxiosApi: AxiosInstance,
  ): Promise<T> {
    return customAxiosApi[operation](
      requestHttp.url,
      requestHttp.body ? requestHttp.body : axiosConfig,
      axiosConfig,
    )
      .then((response) => response.data)
      .catch(async (axiosError: AxiosError) => {
        if (requestHttp.retry > 0) {
          await delay(axiosConfig.retryDelay);
          return this.excecuteOperation(
            operation,
            axiosConfig,
            { ...requestHttp, retry: requestHttp.retry - 1 },
            customAxiosApi,
          );
        }
        throw Object.assign(new Error(), axiosError);
      });
  }

  private getOptions(requestHttp: RequestHttp): AxiosRequestType {
    return {
      headers: {
        'Content-Type': 'application/json',
        ...requestHttp.headers,
      },
      params: requestHttp.queryParams,
      timeout: this.configService.get('timeout'),
      retry: requestHttp?.retry ?? 1,
      retryDelay: 1000,
    };
  }

  private getAxiosInstance(printTimming = false): AxiosInstance {
    const customAxiosApi: AxiosInstance = axios.create();

    if (printTimming) {
      customAxiosApi.interceptors.request.use((req) =>
        this.requestInterceptor(req),
      );

      customAxiosApi.interceptors.response.use(
        (res) => this.responseInterceptor(res),
        (res) => this.responseInterceptorError(res),
      );
    }

    return customAxiosApi;
  }

  private requestInterceptor(req: any) {
    req.meta = req.meta || {};
    req.meta.requestStartedAt = new Date().getTime();
    return req;
  }

  private responseInterceptor(res: any) {
    console.log(
      `Execution time for: ${res.config.url} - ${
        new Date().getTime() - res.config.meta.requestStartedAt
      } ms`,
    );
    return res;
  }

  private responseInterceptorError(res: any) {
    console.error(
      `Execution time for: ${res.config.url} - ${
        new Date().getTime() - res.config.meta.requestStartedAt
      } ms`,
    );
    throw res;
  }
}
