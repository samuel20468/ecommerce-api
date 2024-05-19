import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1714718831560 implements MigrationInterface {
  name = "Migrations1714718831560";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE users
        SET admin = true
        WHERE name = 'samuel';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE users
      SET admin = false
      WHERE name = 'samuel';
      `,
    );
  }
}
