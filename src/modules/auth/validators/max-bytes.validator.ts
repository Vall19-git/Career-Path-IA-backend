import { ValidateBy, type ValidationOptions } from 'class-validator';

/** Valida el tamaño real en UTF-8, además de la longitud en caracteres. */
export function MaxBytes(
  maxBytes: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'maxBytes',
      constraints: [maxBytes],
      validator: {
        validate(value: unknown): boolean {
          return (
            typeof value === 'string' &&
            Buffer.byteLength(value, 'utf8') <= maxBytes
          );
        },
        defaultMessage(): string {
          return `El valor no puede superar los ${maxBytes} bytes.`;
        },
      },
    },
    validationOptions,
  );
}
