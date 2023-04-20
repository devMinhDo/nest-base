import { MigrationInterface, QueryRunner } from 'typeorm';
export class AddAvatar1681809588614 implements MigrationInterface {
  name = 'AddAvatar1681809588614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
  }
}
