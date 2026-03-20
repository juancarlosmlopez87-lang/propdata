import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_LJExO2gn0oQD@ep-royal-silence-agtjh5el-pooler.c-2.eu-central-1.aws.neon.tech/lotesya?sslmode=require';

export const sql = neon(DATABASE_URL);
