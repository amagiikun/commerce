import bcrypt from 'bcryptjs';

export function hashPasswordSync(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
