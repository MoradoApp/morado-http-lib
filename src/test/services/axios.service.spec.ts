import { Test, TestingModule } from '@nestjs/testing';

import { AxiosService } from '../../services/axios.service';
import { RequestHttp } from '../../model/interface/request-http.interface';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

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

      getMock.mockResolvedValue({ data: { ok: 'ok' }, status: 200 });

      const response = await axiosService.get(requestHttp);

      expect(response.status).toBe(200);
      expect(response).toEqual(
        expect.objectContaining({
          status: expect.any(Number),
          data: expect.any(Object),
        }),
      );
    });

    it(`Given a request http,
    When the method is GET 
    Then the service should be use de GET method in axios to send the request and return 500
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

      getMock.mockRejectedValueOnce({ message: 'Error', status: 500 });

      try {
        await axiosService.get(requestHttp);
      } catch (error) {
        expect(error.status).toBe(500);
        expect(error).toEqual(
          expect.objectContaining({
            status: expect.any(Number),
            data: expect.any(String),
          }),
        );
      }
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

      postMock.mockResolvedValueOnce({ data: { ok: 'Ok' }, status: 200 });

      const response = await axiosService.post(requestHttp);

      expect(response.status).toBe(200);
      expect(response).toEqual(
        expect.objectContaining({
          status: expect.any(Number),
          data: expect.any(Object),
        }),
      );
    });

    it(`Given a request http,
    When the method is POST 
    Then the service should be use de POST method in axios to send the request and return 500 and axios doenst return status
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
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      });

      postMock.mockRejectedValueOnce({ message: 'Error', status: undefined });

      try {
        await axiosService.post(requestHttp);
      } catch (error) {
        expect(error.status).toBe(500);
        expect(error).toEqual(
          expect.objectContaining({
            status: expect.any(Number),
            data: expect.any(String),
          }),
        );
      }
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

      putMock.mockResolvedValueOnce({ data: { ok: 'Ok' }, status: 200 });

      const response = await axiosService.put(requestHttp);

      expect(response.status).toBe(200);
      expect(response).toEqual(
        expect.objectContaining({
          status: expect.any(Number),
          data: expect.any(Object),
        }),
      );
    });

    it(`Given a request http,
    When the method is PATCH 
    Then the service should be use de PATCH method in axios to send the request and return 500
    `, async () => {
      const requestHttp: RequestHttp = {
        url: 'http://localhost:8080',
        body: {
          greeting: 'Hello world',
        },
        retry: 3,
      };

      const patchMock = jest.fn();

      // @ts-ignore
      axios.create.mockReturnValue({
        patch: patchMock,
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() },
        },
      });

      patchMock.mockRejectedValueOnce({ message: 'Error', status: 500 });

      try {
        await axiosService.patch(requestHttp);
      } catch (error) {
        expect(error.status).toBe(500);
        expect(error).toEqual(
          expect.objectContaining({
            status: expect.any(Number),
            data: expect.any(String),
          }),
        );
      }
    });
  });

  it(`Given a request http,
    When the method is DELETE 
    Then the service should be use de DELETE method in axios to send the request and return 500 and axios doenst return status
    `, async () => {
    const requestHttp: RequestHttp = {
      url: 'http://localhost:8080',
    };

    const deleteMock = jest.fn();

    // @ts-ignore
    axios.create.mockReturnValue({
      delete: deleteMock,
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    });

    deleteMock.mockRejectedValueOnce({ message: 'Error' });

    try {
      await axiosService.delete(requestHttp);
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error).toEqual(
        expect.objectContaining({
          status: expect.any(Number),
          data: expect.any(String),
        }),
      );
    }
  });
});
