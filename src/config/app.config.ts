export const appConfig = () => {
  return {
    environment: process.env.NODE_ENV || 'production',
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      name: process.env.DB_NAME || 'nestjs',
      synchronize: process.env.DB_SYNC === 'true' ? true : false,
      autoLoadEntities: true,
    },
  };
};
