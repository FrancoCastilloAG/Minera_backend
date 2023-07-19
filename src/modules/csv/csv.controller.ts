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
    console.log('Buffer del archivo:', file.buffer);

    await this.csvService.cargarDatosDesdeCsv(file.buffer);
  }
  @Get('load')
  async obtenerDatosCsv(): Promise<Csv[]> {
    return this.csvService.obtenerDatosCsv();
  }
  @Get('consultar-semanal-movil')
  async consultarSemanalMovil(
    @Query('nombre_fase') nombre_fase: string,
    @Query('nombre_rajo') nombre_rajo: string,
    @Query('fecha') fecha: string,
  ): Promise<number> {
    return this.csvService.showSemanalMovil(nombre_fase, nombre_rajo, fecha);
  }
  @Get('consultar-mensual')
  async consultarMensual(
    @Query('nombre_fase') nombre_fase: string,
    @Query('nombre_rajo') nombre_rajo: string,
    @Query('fecha') fecha: string,
  ): Promise<number> {
    return this.csvService.showMensual(nombre_fase, nombre_rajo, fecha);
  }
  @Get('consultar-semanal-iso')
  async consultarSemanalIso(
    @Query('nombre_fase') nombre_fase: string,
    @Query('nombre_rajo') nombre_rajo: string,
    @Query('fecha') fecha: string,
  ): Promise<number> {
    return this.csvService.showSemanalIso(nombre_fase, nombre_rajo, fecha);
  }
  @Get('filtro-reportes-rajo')
  async filtroReportesRajo(): Promise<{ rajo: string; fase: string }[]> {
    return this.csvService.getFilteredReportRajo();
  }
  @Get('show-diario')
  async getShowDiario(
    @Query('nombre_fase') nombre_fase: string,
    @Query('nombre_rajo') nombre_rajo: string,
    @Query('fecha') fecha: string,
  ): Promise<number> {
    return this.csvService.showDiario(nombre_fase, nombre_rajo, fecha);
  }
  @Get('filtro-reportes-fase')
  async filtroReportesFase(): Promise<{ rajo: string; fase: string }[]> {
    return this.csvService.getFilteredReportFase();
  }
  @Get('busqueda-reportes')
  async busquedaReportes(
    @Query('filter_parameter') filterParameter: string,
  ): Promise<{ rajo: string; fase: string }[]> {
    return this.csvService.searchReportes(filterParameter);
  }
  @Get('busqueda-produccion')
  async busquedaProduccion(
    @Query('filter_parameter') filterParameter: string,
  ): Promise<any[]> {
    return this.csvService.searchProduccion(filterParameter);
  }
  @Get('filtro-produccion-material')
  async filtroProduccionMaterial(): Promise<any[]> {
    return this.csvService.getFilteredProduccionMaterial();
  }
  @Get('filtro-produccion-fase')
  async filtroProduccionFase(): Promise<any[]> {
    return this.csvService.getFilteredProduccionFase();
  }
  @Get('filtro-produccion-fecha')
  async filtroProduccionFecha(
    @Query('filter_parameter') filterParameter: string,
  ): Promise<any[]> {
    return this.csvService.getFilteredProduccionFecha(filterParameter);
  }
}
