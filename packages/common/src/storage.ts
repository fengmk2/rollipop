import fs from 'node:fs';
import path from 'node:path';

import { getSharedDataPath } from './fs';

export interface Data {
  build: {
    [buildHash: string]: {
      totalModules: number;
    };
  };
}

const DEFAULT_DATA: Data = {
  build: {},
};

export class Storage {
  private static instance: Storage | null = null;
  private dataFilePath: string;
  private data: Data;

  static getInstance(basePath: string) {
    if (Storage.instance == null) {
      Storage.instance = new Storage(basePath);
    }
    return new Storage(basePath);
  }

  private constructor(private readonly basePath: string) {
    this.dataFilePath = path.join(getSharedDataPath(basePath), '.rollipop');

    if (fs.existsSync(this.dataFilePath)) {
      this.data = JSON.parse(fs.readFileSync(this.dataFilePath, 'utf-8'));
    } else {
      this.data = DEFAULT_DATA;
    }
  }

  get() {
    return this.data;
  }

  set(data: Data) {
    this.data = data;
    fs.writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2));
  }
}
