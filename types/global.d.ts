declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VUE_APP_SERVICE_URL: string;
    }
  }
}

export {};
