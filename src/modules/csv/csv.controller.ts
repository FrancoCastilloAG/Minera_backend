import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get,Query} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvService } from './csv.service';
import {Csv} from "src/entities/csv.entity"

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post('cargar')
  @UseInterceptors(FileInterceptor('file'))
  async cargarCsv(@UploadedFile() file: Express.Multer.File): Promise<void> {
    if (!file) {
      console.log('El archivo es undefined en el controlador.');
      throw new BadRequestException('Archivo no encontrado.');
    }

    console.log('Archivo recibido en el controlador:', file.originalname);
    console.log('Buffer del archivo:', file.buffer); // Agregar este log para verificar el buffer

    await this.csvService.cargarDatosDesdeCsv(file.buffer);
  }
  @Get('load')
  async obtenerDatosCsv(): Promise<Csv[]> {
    return this.csvService.obtenerDatosCsv();
  }
  @Get('consultar-semanal-movil')
  async consultarSemanalMovil(
    @Query('nombre_fase') nombreFase: string,
    @Query('nombre_rajo') nombreRajo: string,
    @Query('fecha') fecha: string,
  ): Promise<number> {
    return this.csvService.showSemanalMovil(nombreFase, nombreRajo, fecha);
  }
  
}
