import { todo } from 'node:test';
import {
  addTodo,
  getAllTodos,
  getTodoByID,
  UpdateTodo,
} from './controllers/todoController.ts';
import {
  Application,
  Router,
  RouterContext,
} from 'https://deno.land/x/oak/mod.ts';
import { handleRequest } from './middlewares/HandleRequest.ts';
//Initalizing a new http server
const PORT = 3000;
const todosRoute = '/api/todos';
const app = new Application();
const router = new Router();
//Using native Deno
// //Accepting a request as req and return a promise response
// async function handler(req: Request): Promise<Response> {
//   const url = new URL(req.url); //getting the api url
//   const path = url.pathname; //getting url pathname
//   //Intialzing a router for the get without anything else will return a hello world

//   console.log(req);
//   if (req.method === 'GET' && path === '/') {
//     return new Response('hello world');
//   } //Routes for POST todos
//   else if (req.method === 'POST' && path === todosRoute) {
//     return await addTodo(req);
//   } //Routes for GET todos(Get all todos)
//   else if (req.method === 'GET' && path === todosRoute) {
//   } //Route to get all the incomplete todos
//   else if (req.method === 'GET' && path === `${todosRoute}/incomplete/count`) {
//   } //Route to get a certain todos using id Handle /api/todos/:id
//   else if (req.method === 'GET' && path.startsWith(todosRoute)) {
//   } //Route to update the todo Handle /api/todos/:id
//   else if (req.method === 'PUT' && path.startsWith(todosRoute)) {
//   } //Route to delete the todo Handle /api/todos/:id
//   else if (req.method === 'DELETE' && path.startsWith(todosRoute)) {
//   }
//   return new Response('Not found', { status: 404 });
// }

//Using Oak middleware
//Add middleware and routes

//Middleware for getting the request route
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get('X-Response-Time');
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});
//Middleware for calculating response time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

router.get('/', (ctx) => {
  ctx.response.body = 'Hello,World';
});

router.post(
  todosRoute,
  async (ctx) =>
    await handleRequest(
      ctx as RouterContext<string, Record<string, string>>,
      addTodo,
      'POST',
    ),
);

router.get(todosRoute, async (ctx) => {
  const response = await getAllTodos();
  ctx.response.status = response.status;
  ctx.response.body = await response.text();
  ctx.response.type = 'application/json';
});

router.get(todosRoute + '/:id', async (ctx) => {
  const { id } = ctx.params;
  if (!id) {
    ctx.response.status = 400;
    ctx.response.body = { error: 'ID is required' };
    return;
  }
  const response = await getTodoByID(id);
  ctx.response.status = response.status;
  ctx.response.body = await response.text();
  ctx.response.type = 'application/json';
});

router.put(
  todosRoute + '/:id',
  async (ctx) =>
    await handleRequest(
      ctx as RouterContext<string, Record<string, string>>,
      UpdateTodo,
      'PUT',
    ),
);

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`HTTP server is running on http://localhost:${PORT}`);
// Deno.serve(handler,PORT)
await app.listen({ port: PORT });
