import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_HOST_DOCKER,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB_TEST,
  ENV,
} = process.env;

let client: Pool;

switch (ENV) {
  case 'test':
    client = new Pool({
      host: POSTGRES_HOST,
      database: POSTGRES_DB_TEST,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
    });
    break;

  case 'dev':
    client = new Pool({
      host: POSTGRES_HOST,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
    });
    break;

  case 'post': {
    console.log(POSTGRES_HOST_DOCKER);
    client = new Pool({
      host: POSTGRES_HOST_DOCKER,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
    });
    break;
  }
  default:
    throw Error('ENV must be test, dev or post');
}

export default { client };
