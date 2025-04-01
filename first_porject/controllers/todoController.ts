import { todosCollection } from '../db.ts';
import { TodoService } from '../services/TodoService.ts';
import { ObjectId } from 'npm:mongodb@5.6.0';
import { z } from 'zod';
import { CreateTodo, updateTodoSchema } from '../models/Todo.ts';

export class TodoController {
  private todoService: TodoService;
  constructor() {
    this.todoService = new TodoService(); //intializing the class
  }
  
}
