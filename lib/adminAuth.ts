import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'sbs_admin_session';
const SESSION_PAYLOAD = 'sweet-by-sisters-admin';

function getAdminPassword() {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) throw new Error('ADMIN_PASSWORD is not set');
  return pwd;
}

function timingSafeStringEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function isCorrectAdminPassword(candidate: string) {
  return timingSafeStringEqual(candidate, getAdminPassword());
}

export function createAdminSessionToken() {
  return crypto.createHmac('sha256', getAdminPassword()).update(SESSION_PAYLOAD).digest('hex');
}

export function isValidAdminSessionToken(token: string | undefined | null) {
  if (!token) return false;
  return timingSafeStringEqual(token, createAdminSessionToken());
}
