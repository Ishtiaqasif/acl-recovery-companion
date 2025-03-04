import { Injectable, inject } from "@angular/core"
import { RxDBService } from "./rxdb.service"
import { allSchemas } from "../repository/schema/db-schemas"
import { TodoService } from "./todo.service"

/**
 * This service manages the database initialization and provides
 * access to all domain-specific services.
 */
@Injectable({
  providedIn: "root",
})
export class DbManagerService {
  private initialized = false
  private rxdbService = inject(RxDBService)
  private todoService = inject(TodoService)

  constructor() {}

  /**
   * Initialize the database with all collections
   */
  async initializeDatabase(): Promise<void> {
    if (this.initialized) {
      return
    }

    try {
      // Register all schemas
      this.rxdbService.registerSchemas(allSchemas)

      // Initialize database with all collections
      await this.rxdbService.initDatabase("appDatabase", Object.keys(allSchemas))

      this.initialized = true
      console.log("Database initialized with all collections")
    } catch (error) {
      console.error("Failed to initialize database:", error)
      throw error
    }
  }

  /**
   * Get the todo service
   */
  getTodoService(): TodoService {
    return this.todoService
  }

  /**
   * Clean up database resources
   */
  async destroyDatabase(): Promise<void> {
    await this.rxdbService.destroy()
    this.initialized = false
  }
}

