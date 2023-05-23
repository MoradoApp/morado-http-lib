import { Test } from '@nestjs/testing';

import { AxiosService } from '../../src/services/axios.service';
import { MoradoHttp } from '../../src/services/morado-http.service';
import { RequestHttp } from '../../src/model/interface/request-http.interface';

describe('MoradoHttp', () => {
  let moradoHttp: MoradoHttp;
  let axiosService: AxiosService;

  const requestHttp: RequestHttp = {
    url: 'http://localhost:8080',
    body: {},
    headers: {},
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MoradoHttp,
        {
          provide: AxiosService,
          useValue: {
            post: jest.fn(),
            put: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    moradoHttp = moduleRef.get<MoradoHttp>(MoradoHttp);
    axiosService = moduleRef.get<AxiosService>(AxiosService);
  });

  describe('post', () => {
    it('should call post method of AxiosService', async () => {
      await moradoHttp.post(requestHttp);

      expect(axiosService.post).toHaveBeenCalledWith(requestHttp);
    });
  });

  describe('put', () => {
    it('should call put method of AxiosService', async () => {
      await moradoHttp.put(requestHttp);

      expect(axiosService.put).toHaveBeenCalledWith(requestHttp);
    });
  });

  describe('patch', () => {
    it('should call patch method of AxiosService', async () => {
      await moradoHttp.patch(requestHttp);

      expect(axiosService.patch).toHaveBeenCalledWith(requestHttp);
    });
  });

  describe('delete', () => {
    it('should call delete method of AxiosService', async () => {
      await moradoHttp.delete(requestHttp);

      expect(axiosService.delete).toHaveBeenCalledWith(requestHttp);
    });
  });

  describe('get', () => {
    it('should call get method of AxiosService', async () => {
      await moradoHttp.get(requestHttp);

      expect(axiosService.get).toHaveBeenCalledWith(requestHttp);
    });
  });
});
