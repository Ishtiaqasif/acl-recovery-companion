import { Injectable, inject } from "@angular/core"
import { type Observable, map, catchError, throwError, lastValueFrom, switchMap } from "rxjs"
import { v4 as uuidv4 } from "uuid"
import { RxDBService } from "./rxdb.service"
import { type TodoDocument, allSchemas } from "../repository/schema/db-schemas"

export interface TodoItem {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: number
  updatedAt: number
}

export interface CreateTodoInput {
  title: string
  description?: string
}

export interface UpdateTodoInput {
  title?: string
  description?: string
  completed?: boolean
}

@Injectable({
  providedIn: "root",
})
export class TodoService {
  private readonly collectionName = "todos" as const
  private rxdbService = inject(RxDBService)

  constructor() {
    // Register schemas and initialize the database
    this.rxdbService.registerSchemas(allSchemas)
    this.rxdbService
      .initDatabase("todoApp", [this.collectionName])
      .catch((err) => console.error("Failed to initialize database in TodoService:", err))
  }

  /**
   * Get all todos
   */
  getAllTodos(): Observable<TodoItem[]> {
    return this.rxdbService.getAll<TodoItem>(this.collectionName)
  }

  /**
   * Get a todo by id
   */
  getTodoById(id: string): Observable<TodoItem | null> {
    return this.rxdbService.getById<TodoItem>(this.collectionName, id)
  }

  /**
   * Get todos with live updates
   */
  getLiveTodos(): Observable<TodoItem[]> {
    return this.rxdbService.getLiveQuery<TodoItem>(this.collectionName)
  }

  /**
   * Get completed todos
   */
  getCompletedTodos(): Observable<TodoItem[]> {
    return this.rxdbService.query<TodoItem>(this.collectionName, {
      selector: {
        completed: true,
      },
    })
  }

  /**
   * Get incomplete todos
   */
  getIncompleteTodos(): Observable<TodoItem[]> {
    return this.rxdbService.query<TodoItem>(this.collectionName, {
      selector: {
        completed: false,
      },
    })
  }

  /**
   * Create a new todo
   */
  createTodo(input: CreateTodoInput): Observable<TodoItem> {
    const newTodo: TodoDocument = {
      id: uuidv4(),
      title: input.title,
      description: input.description || "",
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    return this.rxdbService.insert<TodoItem>(this.collectionName, newTodo)
  }

  /**
   * Update a todo
   */
  updateTodo(id: string, input: UpdateTodoInput): Observable<TodoItem> {
    return this.rxdbService.update<TodoItem>(this.collectionName, id, input)
  }

  toggleTodoCompletion(id: string): Observable<TodoItem> {
    return this.getTodoById(id).pipe(
      map((todo) => {
        if (!todo) {
          throw new Error(`Todo with id ${id} not found`)
        }
        return todo
      }),
      switchMap((todo) => {
        return this.updateTodo(id, { completed: !todo.completed })
      }),
      catchError((error) => {
        console.error("Error toggling todo completion:", error)
        return throwError(() => error)
      }),
    )
  }

  /**
   * Delete a todo
   */
  deleteTodo(id: string): Observable<boolean> {
    return this.rxdbService.remove(this.collectionName, id)
  }

  /**
   * Delete all completed todos
   */
  async deleteCompletedTodos(): Promise<boolean> {
    try {
      const todos = await lastValueFrom(this.getCompletedTodos())
      const deletePromises = todos.map((todo) => lastValueFrom(this.deleteTodo(todo.id)))
      await Promise.all(deletePromises)
      return true
    } catch (error) {
      console.error("Error deleting completed todos:", error)
      throw error
    }
  }

  /**
   * Search todos by title
   */
  searchTodos(searchTerm: string): Observable<TodoItem[]> {
    return this.getAllTodos().pipe(
      map((todos) =>
        todos.filter(
          (todo) =>
            todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase())),
        ),
      ),
    )
  }

  /**
   * Create multiple todos at once
   */
  createBulkTodos(inputs: CreateTodoInput[]): Observable<TodoItem[]> {
    const newTodos = inputs.map((input) => ({
      id: uuidv4(),
      title: input.title,
      description: input.description || "",
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }))

    return this.rxdbService.bulkInsert<TodoItem>(this.collectionName, newTodos)
  }
}

