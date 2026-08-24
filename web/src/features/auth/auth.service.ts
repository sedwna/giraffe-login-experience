import type {
  AuthenticateLogin,
  AuthResult,
} from './auth.types';
import { validateLoginCredentials } from './auth.validation';

/**
 * Demo account: any well-formed credentials sign in successfully, except
 * the reserved demo username below, which requires its exact password —
 * so the wrong-password journey (the giraffe bumping into the locked
 * door) can actually be experienced.
 */
const DEMO_USERNAME = 'giraffe';
const DEMO_PASSWORD = 'Giraffe1!';

const wait = (duration: number) =>
  new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, duration);
  });

export const authenticateLogin: AuthenticateLogin = async (
  credentials,
): Promise<AuthResult> => {
  await wait(180);

  const fieldErrors = validateLoginCredentials(credentials);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'Check your sign-in details and try again.',
      fieldErrors,
    };
  }

  if (
    credentials.username.trim().toLowerCase() === DEMO_USERNAME &&
    credentials.password !== DEMO_PASSWORD
  ) {
    return {
      ok: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Wrong username or password.',
    };
  }

  return {
    ok: true,
  };
};
