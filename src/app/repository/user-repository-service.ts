import { Injectable } from '@angular/core';
import { createRxDatabase, RxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { BehaviorSubject } from 'rxjs';
import { userSchema } from './schema/user-schema';

@Injectable({
  providedIn: 'root',
})
export class RxDBService {
  private db: RxDatabase | null = null;
  private isDbInitialized = new BehaviorSubject<boolean>(false);
  public readonly isInitialized$ = this.isDbInitialized.asObservable();

  constructor() {
    this.initializeDB();
  }

  private async initializeDB() {
    try {
      this.db = await createRxDatabase({
        name: 'mydatabase', // Database name
        storage: getRxStorageDexie(), // Use IndexedDB via Dexie
      });

      await this.db.addCollections({
        users: { schema: userSchema },
      });

      this.isDbInitialized.next(true);
      console.log('RxDB Initialized');
    } catch (error) {
      console.error('Error initializing RxDB', error);
    }
  }

  getCollection(collectionName: string) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const collection = this.db.collections[collectionName];
    if (!collection) {
      throw new Error(`Collection "${collectionName}" not found`);
    }

    return collection;
  }

  async insert(collectionName: string, data: any) {
    const collection = this.getCollection(collectionName);
    return await collection.insert(data);
  }

  async findAll(collectionName: string) {
    const collection = this.getCollection(collectionName);
    return collection.find().exec();
  }

  async findById(collectionName: string, id: string) {
    const collection = this.getCollection(collectionName);
    return collection.findOne({ selector: { id } }).exec();
  }

  async update(collectionName: string, id: string, data: Partial<any>) {
    const doc = await this.findById(collectionName, id);
    if (doc) {
      await doc.patch(data);
    }
  }

  async delete(collectionName: string, id: string) {
    const doc = await this.findById(collectionName, id);
    if (doc) {
      await doc.remove();
    }
  }

  async clearDatabase() {
    if (!this.db) return;
    await this.db.remove();
    console.log('Database cleared');
  }
}
