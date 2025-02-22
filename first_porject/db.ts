import { MongoClient } from 'npm:mongodb@5.6.0';

const dbPassword = Deno.env.get('MONGODB_URL_PASSWORD') || '';

const MONGODB_URL = Deno.env.get('MONGODB_URL') || '';

const DB_NAME = Deno.env.get('MONGODB_NAME') || 'todo_db';

if (!MONGODB_URL) {
  console.error("MONGODB_URL doesn't exist");
  Deno.exit(1);
}

const actualDB = MONGODB_URL.replace('<PASSWORD>', dbPassword);

const client = new MongoClient(actualDB);

try {
  await client.connect();
  await client.db('admin').command({ ping: 1 });
  console.log('DB connected succesfully');
} catch (error) {
  console.error('DB connection failed', error);
  Deno.exit(1);
}
const db = client.db(DB_NAME);
const todos = db.collection('todos');

export { db, todos };
