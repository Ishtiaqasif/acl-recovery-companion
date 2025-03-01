import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as Realm from 'realm-web';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MongoDBService {
  private app: Realm.App;
  private _user = new BehaviorSubject<Realm.User | null>(null);
  public readonly user = this._user.asObservable();

  constructor() {
    this.app = new Realm.App(environment.mongodb.appId);
    this.initializeUser();
  }

  private async initializeUser() {
    try {
      // Check if we have a stored session
      if (this.app.currentUser) {
        await this.app.currentUser.refreshCustomData();
        this._user.next(this.app.currentUser);
      }
    } catch (error) {
      console.error('Error initializing user', error);
      await this.app.currentUser?.logOut();
      this._user.next(null);
    }
  }

  async loginEmailPassword(email: string, password: string): Promise<Realm.User> {
    try {
      const credentials = Realm.Credentials.emailPassword(email, password);
      const user = await this.app.logIn(credentials);
      this._user.next(user);
      return user;
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  }

  async registerEmailPassword(email: string, password: string): Promise<void> {
    try {
      await this.app.emailPasswordAuth.registerUser({ email, password });
    } catch (error) {
      console.error('Registration error', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.app.currentUser) {
        await this.app.currentUser.logOut();
      }
      this._user.next(null);
    } catch (error) {
      console.error('Logout error', error);
      throw error;
    }
  }

  getCollection(databaseName: string, collectionName: string) {
    if (!this.app.currentUser) {
      throw new Error('User not authenticated');
    }

    const mongodb = this.app.currentUser.mongoClient('mongodb-atlas');
    const database = mongodb.db(databaseName);
    return database.collection(collectionName);
  }

  isLoggedIn(): boolean {
    return !!this.app.currentUser;
  }

  getCurrentUser(): Realm.User | null {
    return this.app.currentUser;
  }
}