/**
 * Environment variable validation.
 * Import this module early to fail fast if required variables are missing.
 */

interface EnvConfig {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN?: string;
  JWT_SECRET: string;
  NEXT_PUBLIC_SITE_URL?: string;
}

let validated = false;

export function validateEnv(): EnvConfig {
  if (validated) {
    return {
      TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL!,
      TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
      JWT_SECRET: process.env.JWT_SECRET!,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    };
  }

  const missing: string[] = [];

  if (!process.env.TURSO_DATABASE_URL) {
    missing.push('TURSO_DATABASE_URL');
  }

  if (!process.env.JWT_SECRET) {
    missing.push('JWT_SECRET');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'See .env.example for the required configuration.'
    );
  }

  validated = true;

  return {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL!,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET!,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  };
}
