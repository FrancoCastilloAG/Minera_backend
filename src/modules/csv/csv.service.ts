import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CsvDto } from './dto/create_csv.dto';
import { Csv } from 'src/entities/csv.entity';
import * as csvParser from 'csv-parser';

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
  
      this.logger.log('Datos del CSV cargados exitosamente');
    } catch (error) {
      this.logger.error('Error al cargar datos desde el CSV:', error);
      throw error; // Re-lanzamos el error para manejarlo en el controlador
    }
  }

  async obtenerDatosCsv(): Promise<Csv[]> {
    return this.csvRepository.find();
  }

  async showSemanalMovil(nombreFase: string, nombreRajo: string, fecha: string): Promise<number> {
    try {
      const result = await this.entityManager.query(
        'SELECT showSemanal_movil($1, $2, $3) as tonelaje_total',
        [nombreFase, nombreRajo, fecha],
      );
      return parseInt(result[0].tonelaje_total, 10);
    } catch (error) {
      this.logger.error('Error al ejecutar showSemanal_movil:', error);
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