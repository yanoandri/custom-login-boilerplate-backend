import { MigrationInterface, QueryRunner } from 'typeorm';

export class WebhookTable1680273669515 implements MigrationInterface {
  name = 'WebhookTable1680273669515';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "webhooks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "convoy_id" character varying NOT NULL,
                "url" character varying NOT NULL,
                "user_id" character varying NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_9e8795cfc899ab7bdaa831e8527" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "webhooks"
        `);
  }
}
