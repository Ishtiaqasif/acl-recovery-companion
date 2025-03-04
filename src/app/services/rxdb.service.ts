import { Injectable } from "@angular/core"
import { createRxDatabase, type RxDatabase, type RxCollection, type RxDocument } from "rxdb"

import { BehaviorSubject, Observable, from, map, catchError, throwError, switchMap } from "rxjs"
import type { SchemaRegistry } from "../repository/schema/db-schemas"
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie"

// Define types for our documents
export type TodoDocument = {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: number
  updatedAt: number
}

export type TodoDocType = TodoDocument
export type TodoDocMethods = {}
export type TodoDoc = RxDocument<TodoDocType, TodoDocMethods>
export type TodoCollection = RxCollection<TodoDocType, TodoDocMethods>

// Define types for our database
export interface DatabaseCollections {
  todos: TodoCollection
  // Add more collections as needed
}

@Injectable({
  providedIn: "root",
})
export class RxDBService {
  private db$ = new BehaviorSubject<RxDatabase<DatabaseCollections> | null>(null)
  private isInitialized = false
  private dbPromise: Promise<RxDatabase<DatabaseCollections>> | null = null
  private schemas: SchemaRegistry = {}

  constructor() {}

  /**
   * Register schemas to be used with the database
   */
  registerSchemas(schemas: SchemaRegistry): void {
    this.schemas = { ...this.schemas, ...schemas }
  }

  /**
   * Initialize the database with registered schemas
   */
  async initDatabase(dbName = "angulardb", collections?: string[]): Promise<RxDatabase<DatabaseCollections>> {
    if (this.isInitialized) {
      return this.dbPromise as Promise<RxDatabase<DatabaseCollections>>
    }

    if (Object.keys(this.schemas).length === 0) {
      throw new Error("No schemas registered. Call registerSchemas() before initializing the database.")
    }

    try {
      // Create the database
      this.dbPromise = createRxDatabase<DatabaseCollections>({
        name: dbName,
        storage: getRxStorageDexie(),
      })

      const db = await this.dbPromise

      // Create collections based on registered schemas
      const collectionSchemas: { [key: string]: any } = {}

      // If collections array is provided, only create those collections
      const schemasToUse = collections
        ? Object.keys(this.schemas).filter((name) => collections.includes(name))
        : Object.keys(this.schemas)

      schemasToUse.forEach((collectionName) => {
        if (this.schemas[collectionName]) {
          collectionSchemas[collectionName] = {
            schema: this.schemas[collectionName],
          }
        }
      })

      await db.addCollections(collectionSchemas)

      this.isInitialized = true
      this.db$.next(db)

      console.log("RxDB Database initialized successfully with collections:", Object.keys(collectionSchemas))
      return db
    } catch (error) {
      console.error("Failed to initialize database:", error)
      throw error
    }
  }

  /**
   * Get the database instance
   */
  getDatabase(): Observable<RxDatabase<DatabaseCollections>> {
    if (!this.isInitialized) {
      throw new Error("Database not initialized. Call initDatabase() first.")
    }

    return this.db$.asObservable().pipe(
      map((db) => {
        if (!db) throw new Error("Database not initialized")
        return db
      }),
    )
  }

  /**
   * Get all documents from a collection
   */
  getAll<T>(collectionName: keyof DatabaseCollections): Observable<T[]> {
    return this.getDatabase().pipe(
      switchMap((db) => from(db[collectionName].find().exec())),
      map((docs) => docs.map((doc) => doc.toJSON() as unknown as T)),
      catchError((error) => {
        console.error(`Error getting all documents from ${collectionName}:`, error)
        return throwError(() => error)
      }),
    )
  }

  /**
   * Get a document by id
   */
  getById<T>(collectionName: keyof DatabaseCollections, id: string): Observable<T | null> {
    return this.getDatabase().pipe(
      switchMap((db) => from(db[collectionName].findOne(id).exec())),
      map((doc) => (doc ? (doc.toJSON() as unknown as T) : null)),
      catchError((error) => {
        console.error(`Error getting document by id from ${collectionName}:`, error)
        return throwError(() => error)
      }),
    )
  }

  /**
   * Query documents with a filter
   */
  query<T>(collectionName: keyof DatabaseCollections, queryObj: any, limit?: number, skip?: number): Observable<T[]> {
    return this.getDatabase().pipe(
      switchMap((db) => {
        let query = db[collectionName].find(queryObj)

        if (limit !== undefined) {
          query = query.limit(limit)
        }

        if (skip !== undefined) {
          query = query.skip(skip)
        }

        return from(query.exec())
      }),
      map((docs) => docs.map((doc) => doc.toJSON() as unknown as T)),
      catchError((error) => {
        console.error(`Error querying documents from ${collectionName}:`, error)
        return throwError(() => error)
      }),
    )
  }

  /**
   * Insert a document
   */
  insert<T>(collectionName: keyof DatabaseCollections, document: any): Observable<T> {
    // Add timestamps
    const now = Date.now()
    const docWithTimestamps = {
      ...document,
      createdAt: document.createdAt || now,
      updatedAt: document.updatedAt || now,
    }

    return this.getDatabase().pipe(
      switchMap((db) => from(db[collectionName].insert(docWithTimestamps))),
      map((doc) => doc.toJSON() as unknown as T),
      catchError((error) => {
        console.error(`Error inserting document into ${collectionName}:`, error)
        return throwError(() => error)
      }),
    )
  }

  /**
   * Update a document
   */
  update<T>(collectionName: keyof DatabaseCollections, id: string, update: Partial<T>): Observable<T> {
    return this.getDatabase().pipe(
      switchMap((db) => from(db[collectionName].findOne(id).exec())),
      switchMap((doc) => {
        if (!doc) {
          throw new Error(`Document with id ${id} not found in ${collectionName}`)
        }

        // Add updated timestamp
        const updateWithTimestamp = {
          ...update,
          updatedAt: Date.now(),
        }

        return from(
          doc.update({
            $set: updateWithTimestamp,
          }),
        ).pipe(map(() => doc))
      }),
      map((doc) => doc.toJSON() as unknown as T),
      catchError((error) => {
        console.error(`Error updating document in ${collectionName}:`, error)
        return throwError(() => error)
      }),
    )
  }

  /**
   * Remove a document
   */
  remove(collectionName: keyof DatabaseCollections, id: string): Observable<boolean> {
    return this.getDatabase().pipe(
      switchMap((db) => from(db[collectionName].findOne(id).exec())),
      switchMap((doc) => {
        if (!doc) {
          throw new Error(`Document with id ${id} not found in ${collectionName}`)
        }

        return from(doc.remove()).pipe(map(() => true))
      }),
      catchError((error) => {
        console.error(`Error removing document from ${collectionName}:`, error)
        return throwError(() => error)
      }),
    )
  }

  /**
   * Get a live query that updates when data changes
   */
  getLiveQuery<T>(
    collectionName: keyof DatabaseCollections,
    queryObj: any = {},
    limit?: number,
    skip?: number,
  ): Observable<T[]> {
    return this.getDatabase().pipe(
      switchMap((db) => {
        let query = db[collectionName].find(queryObj)

        if (limit !== undefined) {
          query = query.limit(limit)
        }

        if (skip !== undefined) {
          query = query.skip(skip)
        }

        // Return the inner observable directly with switchMap
        return query.$.pipe(map((docs) => docs.map((doc) => doc.toJSON() as unknown as T)))
      }),
      catchError((error) => {
        console.error(`Error in live query operation for ${collectionName}:`, error)
        return throwError(() => error)
      }),
    )
  }

  /**
   * Bulk insert multiple documents
   */
  bulkInsert<T>(collectionName: keyof DatabaseCollections, documents: any[]): Observable<T[]> {
    const now = Date.now()
    const docsWithTimestamps = documents.map((doc) => ({
      ...doc,
      createdAt: doc.createdAt || now,
      updatedAt: doc.updatedAt || now,
    }))

    return this.getDatabase().pipe(
      switchMap((db) => {
        const insertPromises = docsWithTimestamps.map((doc) => db[collectionName].insert(doc))
        return from(Promise.all(insertPromises))
      }),
      map((docs) => docs.map((doc) => doc.toJSON() as unknown as T)),
      catchError((error) => {
        console.error(`Error bulk inserting documents into ${collectionName}:`, error)
        return throwError(() => error)
      }),
    )
  }

  /**
   * Sync with a remote database (if needed)
   */
  setupReplication(url: string): Observable<any> {
    // This is a placeholder for replication setup
    // Implementation would depend on your backend
    console.log("Replication would be set up with:", url)
    return new Observable((observer) => {
      observer.next("Replication setup placeholder")
      observer.complete()
    })
  }

  /**
   * Clean up database resources
   */
  async destroy(): Promise<void> {
    const db = this.db$.getValue()
    if (db) {
      await db.destroy()
      this.db$.next(null)
      this.isInitialized = false
      this.dbPromise = null
      console.log("Database destroyed")
    }
  }
}

