import { Controller, Get, Query } from '@nestjs/common';
import { CsvService } from '../modules/csv/csv.service';

@Controller('querys')
export class QuerysController {
    constructor(private readonly csvService: CsvService){}


}
