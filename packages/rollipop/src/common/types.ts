export interface FileStorageData {
  build: {
    [buildHash: string]: {
      totalModules: number;
    };
  };
}
