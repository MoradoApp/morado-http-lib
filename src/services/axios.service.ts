import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';

import { MoradoHttpService } from '../model/interface/morado-http.interface';
import { RequestHttp } from '../model/interface/request-http.interface';
import { ResponseHttp } from '../model/response-http';
import { AxiosRequestType } from '../model/types/request-axios.type';

@Injectable()
export class AxiosService implements MoradoHttpService {
  constructor(private readonly configService: ConfigService) {}

  async get<T>(requestHttp: RequestHttp): Promise<ResponseHttp<T>> {
    return this.excecuteOperation(
      'get',
      this.getOptions(requestHttp),
      requestHttp,
      this.getAxiosInstance(requestHttp.printTimming),
    );
  }

  async post<T>(requestHttp: RequestHttp): Promise<ResponseHttp<T>> {
    return this.excecuteOperation(
      'post',
      this.getOptions(requestHttp),
      requestHttp,
      this.getAxiosInstance(requestHttp.printTimming),
    );
  }

  async put<T>(requestHttp: RequestHttp): Promise<ResponseHttp<T>> {
    return this.excecuteOperation(
      'put',
      this.getOptions(requestHttp),
      requestHttp,
      this.getAxiosInstance(requestHttp.printTimming),
    );
  }

  async patch<T>(requestHttp: RequestHttp): Promise<ResponseHttp<T>> {
    return this.excecuteOperation(
      'patch',
      this.getOptions(requestHttp),
      requestHttp,
      this.getAxiosInstance(requestHttp.printTimming),
    );
  }

  async delete<T>(requestHttp: RequestHttp): Promise<ResponseHttp<T>> {
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
  ): Promise<ResponseHttp<T>> {
    if (requestHttp.body) {
      const axiosResponse = await customAxiosApi[operation](
        requestHttp.url,
        requestHttp.body,
        axiosConfig,
      ).catch((axiosError: AxiosError) => {
        throw new ResponseHttp(axiosError.message, axiosError.status ?? 500);
      });

      return new ResponseHttp(axiosResponse.data, axiosResponse.status);
    }

    const axiosResponse = await customAxiosApi[operation](
      requestHttp.url,
      axiosConfig,
    ).catch((axiosError: AxiosError) => {
      throw new ResponseHttp(axiosError.message, axiosError.status ?? 500);
    });

    return new ResponseHttp(axiosResponse.data, axiosResponse.status);
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
      retryDelay: 3000,
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

    customAxiosApi.interceptors.response.use(
      (response) => response,
      (error) => this.responseInterceptorErrorRetry(error, customAxiosApi),
    );

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

  private async responseInterceptorErrorRetry(
    error: any,
    customAxiosApi: AxiosInstance,
  ): Promise<AxiosInstance> {
    const { config } = error;

    if (!config || !config.retry) {
      throw error;
    }

    config.retry -= 1;
    const delayRetryRequest = new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('retry the request', config.url);
        resolve();
      }, config.retryDelay || 1000);
    });
    return delayRetryRequest.then(() => customAxiosApi(config));
  }
}
