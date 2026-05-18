import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_NAME: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  JWT_SECRET: string;
  NODE_ENV: string;
  URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().default(3000),
    DATABASE_NAME: joi.string().required(),
    DATABASE_HOST: joi.string().required(),
    DATABASE_PORT: joi.number().default(3306),
    DATABASE_USER: joi.string().required(),
    DATABASE_PASSWORD: joi.string().allow('').default(''),
    JWT_SECRET: joi.string().required(),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .default('development'),
    URL: joi.string().uri().default('http://localhost:${PORT}'),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = {
  ...value,
};

export const envs = {
  port: envVars.PORT,
  databaseName: envVars.DATABASE_NAME,
  databaseHost: envVars.DATABASE_HOST,
  databasePort: envVars.DATABASE_PORT,
  databaseUser: envVars.DATABASE_USER,
  databasePassword: envVars.DATABASE_PASSWORD,
  jwtSecret: envVars.JWT_SECRET,
  nodeEnv: envVars.NODE_ENV,
  url: envVars.URL,
};
