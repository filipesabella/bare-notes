const API_URL = 'http://localhost:8000/';

export class Api {
}

async function ffetch(path: string, opts: RequestInit = {}): Promise<Response> {
  return await fetch(API_URL + path, {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    ...opts,
  });
}
