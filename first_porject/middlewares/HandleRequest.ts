import { createNativeRequest } from '../utils/ConvertRequest.ts';
import { Context } from 'https://deno.land/x/oak/mod.ts';
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';

type HandlerFunction = (req: Request) => Promise<Response>;

//Handling the JSON request and request body
const parseJsonRequest = async (ctx: Context): Promise<any | null> => {
  const contentType = ctx.request.headers.get('content-type'); //getting the type of headers
  if (!contentType || !contentType.includes('application/json')) {
    ctx.response.status = 400;
    ctx.response.body = { error: 'Unsupported content type' };
    return null; // Indicating failure
  }
  const body = await ctx.request.body.json(); //getting the req.body
  return body;
};
const handleRequest = async (
  ctx: RouterContext<string, Record<string, string>>, // Ensure correct RouterContext type
  handler: (req: Request, params?: Record<string, string>) => Promise<Response>,
  method: 'POST' | 'PUT' | 'PATCH',
): Promise<void> => {
  if (!['POST', 'PUT', 'PATCH'].includes(ctx.request.method)) {
    ctx.response.status = 405; // Method Not Allowed
    ctx.response.body = { error: 'Method not allowed' };
    return;
  }
  const requestBody = await parseJsonRequest(ctx);
  if (!requestBody) return; // Stop execution if parsing failed
  //  Ensure req is defined before using it
  const req = new Request(ctx.request.url, {
    method: ctx.request.method,
    headers: ctx.request.headers,
    body: JSON.stringify(requestBody),
  });

  const params: Record<string, string> = {};
  for (const key in ctx.params) {
    if (ctx.params[key] !== undefined) {
      params[key] = ctx.params[key] as string;
    }
  }
  const response = await handler(
    req,
    Object.keys(params).length ? params : undefined,
  );
  ctx.response.status = response.status;
  ctx.response.body = await response.text();
  ctx.response.type = 'application/json';
};

export { handleRequest };
