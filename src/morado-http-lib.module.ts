import { Module } from '@nestjs/common';
import { MoradoHttp } from './services/morado-http.service';
import { AxiosService } from './services/axios.service';
// @ts-ignore
@Module({
  providers: [AxiosService, MoradoHttp],
  exports: [MoradoHttp],
})
export class WrapperHttpLibModule {}
