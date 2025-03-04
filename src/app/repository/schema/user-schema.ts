import { RxJsonSchema } from "rxdb";

export const userSchema: RxJsonSchema<any> = {
  title: 'user schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['id', 'email', 'password'],
};