import { envs } from 'src/common/config/envs';
import { DataSource } from 'typeorm';
import { join } from 'path';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: envs.databaseHost,
        port: envs.databasePort,
        username: envs.databaseUser,
        password: envs.databasePassword,
        database: envs.databaseName,
        // Using join ensures the path resolves correctly across different OS and environments (dist/)
        entities: [join(__dirname, '/../../**/*.entity{.ts,.js}')],
        synchronize: envs.nodeEnv === 'development', // Auto-sync only in development
        logging: envs.nodeEnv === 'development', // Optional: logs SQL queries only in dev mode
      });

      return dataSource.initialize();
    },
  },
];
