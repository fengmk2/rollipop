interface ImportMetaEnv {
  readonly MODE: 'development' | 'production';
  readonly BASE_URL: string | undefined;
}

interface ImportMeta {
  hot?: import('./dist').HMRContext;
  env: ImportMetaEnv;
}
