/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AxiosService } from '../../src/services/axios.service';
import { RequestHttp } from '../../src/model/interface/request-http.interface';

jest.mock('axios');

const requestHttp: RequestHttp = {
  url: 'http://localhost:8080',
};

describe('Axios Service', () => {
  let axiosService: AxiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'timeout') {
                return 1000;
              }
              return null;
            }),
          },
        },
        {
          provide: AxiosService,
          useFactory: (configService: ConfigService) =>
            new AxiosService(configService),
          inject: [ConfigService],
        },
      ],
    }).compile();
    axiosService = module.get<AxiosService>(AxiosService);

    jest.clearAllMocks();
  });

  describe('Methods', () => {
    it(`Given a request http,
    When the method is GET 
    Then the service should be use de GET method in axios to send the request and return 200
    `, async () => {
      const getMock = jest.fn();

      // @ts-ignore
      axios.create.mockReturnValue({
        get: getMock,
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      });

      const expected = { data: { message: 'get' }, status: 200 };
      getMock.mockResolvedValue(expected);

      const response = await axiosService.get(requestHttp);

      expect(response).toMatchObject(expected.data);
    });

    it(`Given a request http,
    When the method is POST 
    Then the service should be use de POST method in axios to send the request and return 200
    `, async () => {
      const requestHttp: RequestHttp = {
        url: 'http://localhost:8080',
        body: {
          greeting: 'Hello world',
        },
        printTimming: true,
      };

      const postMock = jest.fn();

      // @ts-ignore
      axios.create.mockReturnValue({
        post: postMock,
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() },
        },
      });

      const expected = { data: { message: 'post' }, status: 200 };
      postMock.mockResolvedValueOnce(expected);

      const response = await axiosService.post(requestHttp);

      expect(response).toMatchObject(expected.data);
    });

    it(`Given a request http,
    When the method is PUT 
    Then the service should be use de PUT method in axios to send the request and return 200
    `, async () => {
      const requestHttp: RequestHttp = {
        url: 'http://localhost:8080',
        body: {
          greeting: 'Hello world',
        },
        retry: undefined,
      };

      const putMock = jest.fn();

      // @ts-ignore
      axios.create.mockReturnValue({
        put: putMock,
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() },
        },
      });

      const expected = { data: { message: 'put' }, status: 200 };
      putMock.mockResolvedValueOnce(expected);

      const response = await axiosService.put(requestHttp);

      expect(response).toMatchObject(expected.data);
    });
  });

  it(`Given a request http with retry,
    When the method is GET,
    Then the service should retry the request and return 200 on third attempt
  `, async () => {
    const requestHttp: RequestHttp = {
      url: 'http://localhost:8080',
      retry: 3,
    };

    const getMock = jest.fn();

    // @ts-ignore
    axios.create.mockReturnValue({
      get: getMock,
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    });

    const expected = { data: 'Success retry test', status: 201 };

    getMock.mockRejectedValueOnce({
      code: '123',
      message: 'First error',
      status: 500,
    });

    getMock.mockRejectedValueOnce({
      code: '123',
      message: 'Second error',
      status: 403,
    });

    getMock.mockResolvedValueOnce(expected);

    const response = await axiosService.get(requestHttp);

    expect(getMock).toHaveBeenCalledTimes(3);
    expect(expected.data).toBe(response);
  });
});
