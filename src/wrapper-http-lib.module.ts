import { Module } from '@nestjs/common';
import { WrapperHttpLibService } from './services/impl/wrapper-http-impl.service';
import { AxiosImplService } from './services/impl/axios-impl.service';
// @ts-ignore
@Module({
  providers: [AxiosImplService, WrapperHttpLibService],
  exports: [WrapperHttpLibService],
})
export class WrapperHttpLibModule {}
