import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

import { SupportedLanguages } from './schema';

const changeLanguage = (lang: SupportedLanguages) => {
  void i18next.changeLanguage(lang);
};

const toggleLanguage = () => {
  void i18next.changeLanguage(
    i18next.language === (SupportedLanguages.EN_EN as string)
      ? SupportedLanguages.VI_VN
      : SupportedLanguages.EN_EN,
  );
};

export const useI18n = () => {
  const { t } = useTranslation();
  return { changeLanguage, t, toggleLanguage };
};
