import 'intl-pluralrules';

import type { Language } from '@/hooks/language/schema';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en-EN.json';
import vi from './vi-VN.json';
export const defaultNS = 'myhackerapiapp';
export const resources = {
  'en-EN': en,
  'vi-VN': vi,
} as const satisfies Record<Language, unknown>;
void i18n.use(initReactI18next).init({
  defaultNS,
  fallbackLng: 'vi-VN',
  lng: 'vi-VN',
  resources,
});
i18n.services.formatter?.add(
  'capitalize',
  (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
);
export { default } from 'i18next';
