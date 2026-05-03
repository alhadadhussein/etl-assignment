import * as appInsights from 'applicationinsights';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DefaultAzureCredential } from '@azure/identity';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const connectionString = configService.get<string>('APPLICATIONINSIGHTS_CONNECTION_STRING');
  if (connectionString) {
    appInsights.setup(connectionString).setSendLiveMetrics(true).start();
    appInsights.defaultClient.config.aadTokenCredential = new DefaultAzureCredential();
  }

  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log(`Server running on port ${port}`);
}
bootstrap();
