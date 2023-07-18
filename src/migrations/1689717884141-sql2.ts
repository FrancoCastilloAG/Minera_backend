import { MigrationInterface, QueryRunner } from "typeorm";

export class Sql21689717884141 implements MigrationInterface {
    name = 'Sql21689717884141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "csv" RENAME COLUMN "Fase" TO "Zona"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "csv" RENAME COLUMN "Zona" TO "Fase"`);
    }

}
