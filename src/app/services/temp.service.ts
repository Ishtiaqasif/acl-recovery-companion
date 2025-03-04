// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { addRxPlugin, createRxDatabase, RxJsonSchema, RxDatabase, RxCollection } from 'rxdb/plugins/core';
// import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
// import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
// import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

// // Add PouchDB plugins
// addRxPlugin(RxDBDevModePlugin);

// // Define the schema for the user collection


// @Injectable({
//   providedIn: 'root',
// })
// export class RxDBService {
//   private db!: RxDatabase;
//   private userCollection!: RxCollection;
//   private _user = new BehaviorSubject<any>(null);
//   public readonly user = this._user.asObservable();

//   constructor() {
//     this.initializeDatabase();
//   }

//   private async initializeDatabase() {
//     try {
//       // Create the RxDB database
//       this.db = await createRxDatabase({
//         name: 'mydatabase',
//         storage: wrappedValidateAjvStorage({
//           storage: getRxStorageDexie()
//         })
//       });

//       // Add the user collection
//       await this.db.addCollections({
//         users: {
//           schema: userSchema,
//         },
//       });

//       this.userCollection = this.db.collections['users'];

//       // Check if a user is already logged in
//       const users = await this.userCollection.find().exec();
//       if (users.length > 0) {
//         this._user.next(users[0]);
//       }
//     } catch (error) {
//       console.error('Error initializing database', error);
//     }
//   }

//   async loginEmailPassword(email: string, password: string): Promise<any> {
//     try {
//       const users = await this.userCollection
//         .find({
//           selector: {
//             email,
//             password,
//           },
//         })
//         .exec();

//       if (users.length > 0) {
//         this._user.next(users[0]);
//         return users[0];
//       } else {
//         throw new Error('Invalid email or password');
//       }
//     } catch (error) {
//       console.error('Login error', error);
//       throw error;
//     }
//   }

//   async registerEmailPassword(email: string, password: string): Promise<void> {
//     try {
//       const newUser = {
//         id: this.generateId(),
//         email,
//         password,
//       };

//       await this.userCollection.insert(newUser);
//     } catch (error) {
//       console.error('Registration error', error);
//       throw error;
//     }
//   }

//   async logout(): Promise<void> {
//     try {
//       this._user.next(null);
//     } catch (error) {
//       console.error('Logout error', error);
//       throw error;
//     }
//   }

//   isLoggedIn(): boolean {
//     return !!this._user.value;
//   }

//   getCurrentUser(): any {
//     return this._user.value;
//   }

//   private generateId(): string {
//     return Math.random().toString(36).substring(2) + Date.now().toString(36);
//   }
// }-*