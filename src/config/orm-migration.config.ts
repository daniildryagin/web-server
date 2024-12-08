import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const data: any = dotenv.parse(fs.readFileSync(`.env`));

export const config: DataSourceOptions = {
  type: 'postgres',
  host: data.DATABASE_HOST,
  port: Number(data.DATABASE_PORT),
  username: data.DATABASE_USER,
  password: data.DATABASE_PASSWORD,
  database: data.DATABASE_NAME,
  entities: ['dist/**/*entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
}

export default new DataSource(config);