import { MigrationInterface, QueryRunner } from "typeorm";

export class UserIsAdmin1733651683717 implements MigrationInterface {
    name = 'UserIsAdmin1733651683717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isAdmin"`);
    }

}
