import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CsvDto } from './dto/create_csv.dto';
import { Csv } from 'src/entities/csv.entity';
import * as csvParser from 'csv-parser';
import { getManager } from 'typeorm';

@Injectable()
export class CsvService {
  private readonly logger = new Logger(CsvService.name);

  constructor(
    @InjectRepository(Csv)
    private readonly csvRepository: Repository<Csv>,private readonly entityManager: EntityManager,
  ) {}

  private async readCsvFile(buffer: Buffer): Promise<CsvDto[]> {
    const results: CsvDto[] = [];

    // Convertir el Buffer a un stream legible por csv-parser
    const stream = bufferToStream(buffer);

    return new Promise((resolve, reject) => {
      stream
        .pipe(csvParser({ separator: ';' }))
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  async cargarDatosDesdeCsv(buffer: Buffer): Promise<void> {
    try {
      const results: CsvDto[] = await this.readCsvFile(buffer);
      this.logger.log(`Datos leídos del CSV: ${JSON.stringify(results)}`);
  
      for (const item of results) {
        const entidad = new Csv();
        entidad.Fecha = item.Fecha;
        entidad.Carguio = item.Carguio;
        entidad.Camión = item.Camión;
        entidad.Flota = item.Flota;
        entidad.Material = item.Material;
        entidad.Origen = item.Origen;
        entidad.Zona = item.Zona;
        entidad.Destino = item.Destino;
        // Redondear el tonelaje
        if (item.Tonelaje) {
          const tonelajeStr = item.Tonelaje.toString().replace(',', '.');
          const tonelajeNum = parseFloat(tonelajeStr);
          entidad.Tonelaje = Math.round(tonelajeNum); // Redondeamos a 2 decimales
        } else {
          entidad.Tonelaje = null; // Opcional: manejar casos donde no haya tonelaje
        }
        
        entidad.Ciclos = item.Ciclos;
        entidad.Rajo = item.Rajo;
  
        await this.csvRepository.save(entidad);
      }
      this.entityManager.query(`alter table csv alter column "Fecha" type date using "Fecha"::date;`)
      this.entityManager.query(`alter table csv alter column "Fecha" type text using "Fecha"::text;`)
      this.logger.log('Datos del CSV cargados exitosamente');
    } catch (error) {
      this.logger.error('Error al cargar datos desde el CSV:', error);
      throw error; // Re-lanzamos el error para manejarlo en el controlador
    }
  }

  async obtenerDatosCsv(): Promise<Csv[]> {
    return this.csvRepository.find();
  }

  async showSemanalMovil(nombre_fase: string, nombre_rajo: string, fecha: string): Promise<number> {
    try {
      const result = await this.entityManager.query(
        `SELECT semanal_movil from showSemanal_movil($1, $2, $3)`,
        [nombre_fase, nombre_rajo, fecha],
      );
      return result;
    } catch (error) {
      this.logger.error('Error al ejecutar showSemanal_movil:', error);
      throw error;
    }
  }
  async showMensual(nombre_fase: string, nombre_rajo: string, fecha: string): Promise<number> {
    try {
      const result = await this.entityManager.query(
        `SELECT tonelaje_total from showMensual($1, $2, $3)`,
        [nombre_fase, nombre_rajo, fecha],
      );
      return result;
    } catch (error) {
      this.logger.error('Error al ejecutar showMensual:', error);
      throw error;
    }
  }
  async showSemanalIso(nombre_fase: string, nombre_rajo: string, fecha: string): Promise<number> {
    try {
      const result = await this.entityManager.query(
        `SELECT semanal from showSemanal_iso($1, $2, $3)`,
        [nombre_fase, nombre_rajo, fecha],
      );
      return result;
    } catch (error) {
      this.logger.error('Error al ejecutar showSemanal_iso:', error);
      throw error;
    }
  }
  async showDiario(nombre_fase: string, nombre_rajo: string, fecha: string): Promise<number> {
    try {
      const result = await this.entityManager.query(
        `SELECT diario from showDiario($1, $2, $3)`,
        [nombre_fase, nombre_rajo, fecha],
      );
      return result;
    } catch (error) {
      this.logger.error('Error al ejecutar showDiario:', error);
      throw error;
    }
  }
  async getFilteredReportRajo(): Promise<{ rajo: string; fase: string }[]> {
    try {
      const result = await this.entityManager.query(`
        SELECT rajo, zona FROM filtro_reportes_rajo()
      `);
      return result;
    } catch (error) {
      this.logger.error('Error al ejecutar filtro_reportes_rajo:', error);
      throw error;
    }
  }
  async getFilteredReportFase(): Promise<{ rajo: string; fase: string }[]> {
    try {
      const result = await this.entityManager.query(`
        SELECT rajo, zona FROM filtro_reportes_fase()
      `);
      return result;
    } catch (error) {
      this.logger.error('Error al ejecutar filtro_reportes_fase:', error);
      throw error;
    }
  }
  async searchReportes(filterParameter: string): Promise<{ rajo: string; fase: string }[]> {
    try {
      const result = await this.entityManager.query(`
        SELECT rajo, fase FROM busquedaReportes($1)
      `, [filterParameter]);
      return result;
    } catch (error) {
      this.logger.error('Error al ejecutar busquedaReportes:', error);
      throw error;
    }
  }
  async searchProduccion(filterParameter: string): Promise<any[]> {
    try {
      const result = await this.entityManager.query(`
        SELECT fecha, carguio, camion, flota, material, fase, destino, tonelaje, ciclos, rajo 
        FROM busquedaProduccion($1)
      `, [filterParameter]);
      return result;
    } catch (error) {
      this.logger.error('Error al ejecutar busquedaProduccion:', error);
      throw error;
    }
  }
  async getFilteredProduccionMaterial(): Promise<any[]> {
    try {
      const result = await this.entityManager.query(`
        SELECT fecha, carguio, camion, flota, material, fase, destino, tonelaje, ciclos, rajo 
        FROM filtro_produccion_material()
      `);
      return result;
    } catch (error) {
      this.logger.error('Error al ejecutar filtro_produccion_material:', error);
      throw error;
    }
  }
  async getFilteredProduccionFase(): Promise<any[]> {
    try {
      const result = await this.entityManager.query(`
        SELECT fecha, carguio, camion, flota, material, fase, destino, tonelaje, ciclos, rajo 
        FROM filtro_produccion_fase()
      `);
      return result;
    } catch (error) {
      this.logger.error('Error al ejecutar filtro_produccion_fase:', error);
      throw error;
    }
  }
  async getFilteredProduccionFecha(filterParameter: string): Promise<any[]> {
    try {
      const result = await this.entityManager.query(`
        SELECT fecha, carguio, camion, flota, material, fase, destino, tonelaje, ciclos, rajo 
        FROM filtro_produccion_fecha($1)
      `, [filterParameter]);
      return result;
    } catch (error) {
      this.logger.error('Error al ejecutar filtro_produccion_fecha:', error);
      throw error;
    }
  }

}

// Función para convertir un Buffer a un stream legible por csv-parser
function bufferToStream(buffer: Buffer) {
  const Duplex = require('stream').Duplex;
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
