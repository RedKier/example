import { Migration } from '@mikro-orm/migrations';

export class Migration20250201205002 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "product" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(50) not null, "description" varchar(300) not null, "price" int not null, "stock" int not null, constraint "product_pkey" primary key ("id"));`,
    );
  }
}
