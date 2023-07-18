import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { CsvModule } from './modules/csv/csv.module';
import { MulterModule } from '@nestjs/platform-express'; 
import { QuerysService } from './querys/querys.service';
import { QuerysController } from './querys/querys.controller';
import { QuerysModule } from './querys/querys.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...databaseConfig
    }),
    MulterModule.register(),
    AuthModule,
    CsvModule,
    QuerysModule
  ],
  providers: [QuerysService],
  controllers: [QuerysController],
})
export class AppModule {}
