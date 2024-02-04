import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNote1707042534561 implements MigrationInterface {
    name = 'AddNote1707042534561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calendar_event" ADD "note" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calendar_event" DROP COLUMN "note"`);
    }

}
