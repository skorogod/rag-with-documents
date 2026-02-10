import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToDocument1770758886909 implements MigrationInterface {
    name = 'AddFieldsToDocument1770758886909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" ADD "status" character varying NOT NULL DEFAULT 'processed'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "status"`);
    }

}
