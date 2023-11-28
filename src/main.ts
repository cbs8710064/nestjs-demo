declare const module: any;
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const httpAdapter = app.get(HttpAdapterHost);
  const logger = new Logger();
  app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));
  await app.listen(3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
