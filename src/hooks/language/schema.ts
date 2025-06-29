import { z } from 'zod';

export const enum SupportedLanguages {
  EN_EN = 'en-EN',
  VI_VN = 'vi-VN',
}

export const languageSchema = z.enum([
  SupportedLanguages.EN_EN,
  SupportedLanguages.VI_VN,
]);

export type Language = z.infer<typeof languageSchema>;
