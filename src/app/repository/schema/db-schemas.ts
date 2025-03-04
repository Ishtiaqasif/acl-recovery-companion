import type { RxJsonSchema, RxCollection, RxDocument } from "rxdb"

// ==================== Todo Schema ====================
export type TodoDocument = {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: number
  updatedAt: number
}

export type TodoDocMethods = {}
export type TodoDoc = RxDocument<TodoDocument, TodoDocMethods>
export type TodoCollection = RxCollection<TodoDocument, TodoDocMethods>

export const todoSchema: RxJsonSchema<TodoDocument> = {
  title: "todo schema",
  version: 0,
  description: "Describes a todo item",
  type: "object",
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    title: {
      type: "string",
    },
    description: {
      type: "string",
      default: "",
    },
    completed: {
      type: "boolean",
      default: false,
    },
    createdAt: {
      type: "number",
    },
    updatedAt: {
      type: "number",
    },
  },
  required: ["id", "title", "completed", "createdAt", "updatedAt"],
}

// ==================== User Schema ====================
export type UserDocument = {
  id: string
  username: string
  email: string
  avatarUrl?: string
  createdAt: number
  updatedAt: number
}

export type UserDocMethods = {}
export type UserDoc = RxDocument<UserDocument, UserDocMethods>
export type UserCollection = RxCollection<UserDocument, UserDocMethods>

export const userSchema: RxJsonSchema<UserDocument> = {
  title: "user schema",
  version: 0,
  description: "Describes a user",
  type: "object",
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    username: {
      type: "string",
    },
    email: {
      type: "string",
    },
    avatarUrl: {
      type: "string",
    },
    createdAt: {
      type: "number",
    },
    updatedAt: {
      type: "number",
    },
  },
  required: ["id", "username", "email", "createdAt", "updatedAt"],
}

// ==================== Note Schema ====================
export type NoteDocument = {
  id: string
  title: string
  content: string
  tags?: string[]
  userId: string
  createdAt: number
  updatedAt: number
}

export type NoteDocMethods = {}
export type NoteDoc = RxDocument<NoteDocument, NoteDocMethods>
export type NoteCollection = RxCollection<NoteDocument, NoteDocMethods>

export const noteSchema: RxJsonSchema<NoteDocument> = {
  title: "note schema",
  version: 0,
  description: "Describes a note",
  type: "object",
  primaryKey: "id",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    title: {
      type: "string",
    },
    content: {
      type: "string",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
    },
    userId: {
      type: "string",
    },
    createdAt: {
      type: "number",
    },
    updatedAt: {
      type: "number",
    },
  },
  required: ["id", "title", "content", "userId", "createdAt", "updatedAt"],
}

// ==================== Database Collections Interface ====================
export interface DatabaseCollections {
  todos: TodoCollection
  users?: UserCollection
  notes?: NoteCollection
  // Add more collections as needed
}

// ==================== Schema Registry ====================
export interface SchemaRegistry {
  [collectionName: string]: RxJsonSchema<any>
}

export const allSchemas: SchemaRegistry = {
  todos: todoSchema,
  users: userSchema,
  notes: noteSchema,
}

