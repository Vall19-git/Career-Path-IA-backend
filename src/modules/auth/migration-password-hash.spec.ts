import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migrationFile = resolve(
  process.cwd(),
  'prisma/migrations/20261122_add_users_password_hash/migration.sql',
);

const sql = readFileSync(migrationFile, 'utf8');

describe('Migración de contraseña de usuarios', () => {
  it('agrega password_hash sobre la tabla public.users existente', () => {
    expect(sql).toMatch(/ALTER\s+TABLE\s+"public"\."users"/i);
    expect(sql).toMatch(/ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+"password_hash"\s+VARCHAR\(255\)/i);
  });

  it('no define un NOT NULL que rompa los usuarios anteriores', () => {
    expect(sql).not.toMatch(/\bNOT\s+NULL\b/i);
  });

  it('no contiene operaciones destructivas', () => {
    expect(sql).not.toMatch(/\b(?:DROP|TRUNCATE|DELETE|UPDATE)\b/i);
  });
});
