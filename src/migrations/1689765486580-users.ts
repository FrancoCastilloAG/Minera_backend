import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1689765486580 implements MigrationInterface {
    name = 'Users1689765486580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "nombre" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "rut" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "csv" DROP COLUMN "Origen"`);
        await queryRunner.query(`ALTER TABLE "csv" ADD "Origen" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "csv" DROP COLUMN "Origen"`);
        await queryRunner.query(`ALTER TABLE "csv" ADD "Origen" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "rut"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nombre"`);
    }

}
