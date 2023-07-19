import { MigrationInterface, QueryRunner } from "typeorm";

export class Finally1689762694430 implements MigrationInterface {
    name = 'Finally1689762694430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" text NOT NULL, "rut" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "role" text NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "csv" ("id" SERIAL NOT NULL, "Fecha" text NOT NULL, "Carguio" text NOT NULL, "Camión" text NOT NULL, "Flota" text NOT NULL, "Material" text NOT NULL, "Origen" text NOT NULL, "Zona" text NOT NULL, "Destino" text NOT NULL, "Tonelaje" numeric NOT NULL, "Ciclos" integer NOT NULL, "Rajo" text NOT NULL, CONSTRAINT "PK_f3661c9e3fc6e2fb82e2cfcdf22" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "csv"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
