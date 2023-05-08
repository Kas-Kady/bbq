export function validatePassword(password: unknown): password is string {
  return typeof password === 'string' && password.length > 0;
}

export function checkPasswordLength(password: string): boolean {
  return password.length >= 8;
}

export function validatePasswordConfirmation(
  password: string,
  passwordConfirmation: unknown
): passwordConfirmation is string {
  return (
    typeof passwordConfirmation === 'string' &&
    password === passwordConfirmation
  );
}
