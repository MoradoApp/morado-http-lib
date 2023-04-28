import axios, { AxiosError, AxiosInstance } from 'axios'
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IWrapperHttpService } from '../IWrapperHttpService';
import { IRequestHttp } from '../../model/interface/IRequestHttp';
import { ResponseHttp } from '../../model/ResponseHttp';
import { AxiosRequestType } from '../../model/types/request-axios.type';

// @ts-ignore
@Injectable()
export class AxiosImplService implements IWrapperHttpService {
  constructor(private configService: ConfigService) {}

  async get<T> (requestHttp: IRequestHttp): Promise<ResponseHttp<T>> {
    return this.buildOperation('get', requestHttp);
  }

  async post<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>> {
    return this.buildOperation('post', requestHttp);
  }

  async put<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>> {
    return this.buildOperation('put', requestHttp);
  }

  async patch<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>> {
    return this.buildOperation('patch', requestHttp);
  }

  async delete<T>(requestHttp: IRequestHttp): Promise<ResponseHttp<T>> {
    return this.buildOperation('delete', requestHttp);
  }

  private async buildOperation<T>(operation: string, requestHttp: IRequestHttp): Promise<ResponseHttp<T>> {
    const customAxiosApi = this.getAxiosInstance(requestHttp.printTimming);
    const axiosConfig = this.getOptions(requestHttp);

    return this.excecuteOperation(operation, axiosConfig, requestHttp, customAxiosApi)
  }
  
  private async excecuteOperation<T>(
    operation: string,
    axiosConfig: AxiosRequestType,
    requestHttp: IRequestHttp,
    customAxiosApi: AxiosInstance
  ): Promise<ResponseHttp<T>> {
    if (requestHttp.body) {
      const axiosResponse = await customAxiosApi[operation](requestHttp.url, requestHttp.body, axiosConfig)
      .catch((axiosError: AxiosError) => {
        throw new InternalServerErrorException({ description: axiosError.message, statusCode: axiosError.status })
      });

      return new ResponseHttp(axiosResponse.data, axiosResponse.status)
    }

    const axiosResponse = await customAxiosApi[operation](requestHttp.url, axiosConfig)
      .catch((axiosError: AxiosError) => {
        throw new InternalServerErrorException({ description: axiosError.message, statusCode: axiosError.status })
      });

    return new ResponseHttp(axiosResponse.data, axiosResponse.status)
  }
  
  private getOptions(requestHttp: IRequestHttp): AxiosRequestType {
    return {
      headers: {
        'Content-Type': 'application/json',
        ...requestHttp.headers
      },
      params: requestHttp.queryParams,
      timeout: this.configService.get('timeout'),
      retry: requestHttp?.retry ?? 1,
      retryDelay: 3000,
    };
  }

  private getAxiosInstance(printTimming = false): AxiosInstance {
    const customAxiosApi: AxiosInstance = axios.create();

    if(printTimming) {
      customAxiosApi.interceptors.request.use(
        req => this.requestInterceptor(req)
      );
  
      customAxiosApi.interceptors.response.use(
        res => this.responseInterceptor(res),
        res => this.responseInterceptorError(res)
      );
    }

    customAxiosApi.interceptors.response.use(
      (response) => response,
      (error) => this.responseInterceptorErrorRetry(error, customAxiosApi)
    );

    return customAxiosApi;
  }

  private requestInterceptor(req: any) {
    req.meta = req.meta || {}
    req.meta.requestStartedAt = new Date().getTime();
    return req;
  }

  private responseInterceptor(res: any) {
    console.log(`Execution time for: ${res.config.url} - ${ new Date().getTime() - res.config.meta.requestStartedAt} ms`)
    return res;
  }

  private responseInterceptorError(res: any) {
    console.error(`Execution time for: ${res.config.url} - ${new Date().getTime() - res.config.meta.requestStartedAt} ms`)
    throw res;
  }

  private async responseInterceptorErrorRetry(error: any, customAxiosApi: AxiosInstance): Promise<AxiosInstance> {
    const { config } = error;
    
    if (!config || !config.retry) {
      throw error;
    }

    config.retry -= 1
    const delayRetryRequest = new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("retry the request", config.url);
        resolve();
      }, config.retryDelay || 1000)
    })
    return delayRetryRequest.then(() => customAxiosApi(config));
  }
}
