import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;

export class PasswordUtil {

  static isValidLength(password: unknown): boolean {
    if (typeof password !== 'string') {
      return false;
    }

    return (
      password.length >= MIN_PASSWORD_LENGTH &&
      password.length <= MAX_PASSWORD_LENGTH &&
      Buffer.byteLength(password, 'utf8') <= 72
    );
  }

  static async hash(password: string): Promise<string> {
    if (!this.isValidLength(password)) {
      throw new Error(
        'La contraseña debe tener entre 8 y 72 caracteres y no superar 72 bytes.',
      );
    }

    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  static async compare(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    if (
      !this.isValidLength(password) ||
      typeof passwordHash !== 'string' ||
      passwordHash.length === 0
    ) {
      return false;
    }

    try {
      return await bcrypt.compare(password, passwordHash);
    } catch {
      return false;
    }
  }
}
