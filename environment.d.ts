declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      SENDGRID_API_KEY: string;
    }
  }
}

export {};
