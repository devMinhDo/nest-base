import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1681725665560 implements MigrationInterface {
  name = 'NewMigration1681725665560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`age\` int NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`age\``);
  }
}
