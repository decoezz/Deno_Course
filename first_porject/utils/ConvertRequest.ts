function createNativeRequest(oakRequest: any, bodyData: any): Request {
  const bodyString = JSON.stringify(bodyData);
  const requestInit: RequestInit = {
    method: oakRequest.method,
    headers: oakRequest.headers,
    body: bodyString,
  };
  return new Request(oakRequest.url, requestInit);
}
export { createNativeRequest };
