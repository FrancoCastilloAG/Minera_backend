import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Csv } from 'src/entities/csv.entity';
import { MulterModule } from '@nestjs/platform-express';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Csv]),
    MulterModule.register(),
  ],
  controllers: [CsvController],
  providers: [CsvService],
  exports: [CsvService]
})
export class CsvModule {}
