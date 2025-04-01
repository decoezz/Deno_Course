import { z } from 'https://deno.land/x/zod@v3.22.2/mod.ts';
import { ObjectId } from 'npm:mongodb@^5.6.0';
export interface Todo {
  _id: ObjectId;
  title: string;
  completed: boolean;
}
export const createTodoSchema = z.object({
  title: z.string(),
  completed: z.boolean(),
});

export const updateTodoSchema = z.object({
  title: z.string().optional(),
  completed: z.boolean().optional(),
});

export type CreateTodo = z.infer<typeof createTodoSchema>;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;
