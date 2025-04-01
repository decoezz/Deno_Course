import { todosCollection } from '../db.ts';
import { ObjectId } from 'npm:mongodb@^5.6.0';
import { CreateTodo, Todo, UpdateTodo } from '../models/Todo.ts';
export class TodoService {
  async createTodo(data: CreateTodo): Promise<string> {
    const result = await todosCollection.insertOne(data);
    return result.insertedId.toString();
  }
  async getAllTodos(): Promise<Todo[]> {
    const todos = await todosCollection.find({}).toArray();
    return todos.map((todo) => ({
      _id: todo._id,
      title: todo.title,
      completed: todo.completed,
    }));
  }
  async getTodoById(id: string): Promise<Todo | null> {
    const todo = await todosCollection.findOne({ _id: new ObjectId(id) });
    if (!todo) return null;
    return {
      _id: todo._id,
      title: todo.title,
      completed: todo.completed,
    };
  }
  async updateTodo(id: string, data: UpdateTodo): Promise<number> {
    const result = await todosCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
    );
    return result.modifiedCount;
  }
}
