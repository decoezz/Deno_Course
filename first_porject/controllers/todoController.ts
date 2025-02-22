import { todos } from '../db.ts';
import { ObjectId } from 'npm:mongodb@5.6.0';

async function addTodo(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const result = await todos.insertOne(body);
    return new Response(JSON.stringify({ id: result.insertedId }), {
      status: 201,
      headers: { 'Content-type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-type': 'application/json' },
    });
  }
}

async function getAllTodos(): Promise<Response> {
  try {
    const AllTodos = await todos.find().toArray();
    if (!AllTodos || AllTodos.length === 0) {
      return new Response(
        JSON.stringify({ message: 'There is no todos in the data base' }),
        {
          status: 400,
          headers: { 'Content-type': 'application/json' },
        },
      );
    }
    return new Response(JSON.stringify({ todos: AllTodos }), {
      status: 200,
      headers: { 'Content-type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-type': 'application/json' },
    });
  }
}

async function getTodoByID(todoId: string): Promise<Response> {
  const objectId = new ObjectId(todoId);
  const todo = await todos.findOne({ _id: objectId });
  if (!todo) {
    return new Response(JSON.stringify({ message: 'Todo not found' }), {
      status: 400,
      headers: { 'Content-type': 'application/json' },
    });
  }
  return new Response(
    JSON.stringify({ message: 'Todo found successfully', data: { todo } }),
    {
      status: 200,
      headers: { 'Content-type': 'application/json' },
    },
  );
}

async function UpdateTodo(
  req: Request,
  params?: Record<string, string>,
): Promise<Response> {
  if (!params || !params.id) {
    return new Response(JSON.stringify({ error: 'ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const todoId = params.id;
  const objectId = new ObjectId(todoId);
  const todo = await todos.findOne({ _id: objectId });
  if (!todo) {
    return new Response(JSON.stringify({ message: 'Todo not found' }), {
      status: 400,
      headers: { 'Content-type': 'application/json' },
    });
  }
  const body = await req.json();
  if (body.complete !== undefined && typeof body.complete !== 'boolean') {
    return new Response(
      JSON.stringify({
        message: 'Complete status must be a boolean (true or false)',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
  if (!body.title && body.complete === undefined) {
    return new Response(
      JSON.stringify({
        message: 'Please enter at least one of the requested fields',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
  if (body.title) todo.title = body.title;
  if (body.complete !== undefined) todo.complete = body.complete;
  return new Response(
    JSON.stringify({ message: 'Todo Updated Successfully', data: { todo } }),
    {
      status: 200,
      headers: { 'Content-type': 'application/json' },
    },
  );
}

export { addTodo, getAllTodos, getTodoByID, UpdateTodo };
