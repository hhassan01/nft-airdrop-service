import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

export const databaseProviders = [
  {
    provide: 'USERS_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'airdrops',
        password: 'password',
        database: 'postgres',
        entities: [User],
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];
