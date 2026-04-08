import type { Handler } from '@netlify/functions';
import { getUser } from '../../lib/db';

export const handler: Handler = async () => {
  try {
    const user = await getUser();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    };
  } catch {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: null }),
    };
  }
};