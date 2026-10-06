import type { PasswordGenerationOptions } from "../types/password";

export const DEFAULT_PASSWORD_OPTIONS = {
  length: 20,
  lowercase: true,
  uppercase: true,
  digits: true,
  symbols: true,
  minLowercase: 0,
  minUppercase: 0,
  minDigits: 0,
  minSymbols: 0,
  excludeAmbiguous: false,
  excludedCharacters: "",
} satisfies PasswordGenerationOptions;
