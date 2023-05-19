import { MigrationInterface, QueryRunner } from 'typeorm';

export class addScopes1682394392479 implements MigrationInterface {
  name = 'addScopes1682394392479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "webhooks"
            ADD "scopes" character varying NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "webhooks" DROP COLUMN "scopes"
        `);
  }
}
