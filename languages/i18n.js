import i18next from 'i18next';
import ar from './arabic.json';
import en from './english.json';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart'; // Make sure to import this
import { I18nManager } from 'react-native';

const LANGUAGES = { ar, en };

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => { // Use async/await for cleaner code
    try {
      const language = await AsyncStorage.getItem('user-language');
      const detectedLanguage = language || 'en'; // Default to English if no language found
      const isRTL = detectedLanguage.indexOf('ar') === 0;

      // Check if the current layout direction matches the language
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        RNRestart.Restart(); // Restart the app to apply changes
      }

      callback(detectedLanguage);
    } catch (error) {
      console.error("Error detecting language: ", error);
      callback('en'); // Fallback to English on error
    }
  },
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem('user-language', language);
      const isRTL = language.indexOf('ar') === 0;

      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        RNRestart.Restart(); // Restart the app after setting RTL
      }
    } catch (error) {
      console.error("Error caching user language: ", error);
    }
  }
};

i18next
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next).init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    resources: LANGUAGES,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });

export default i18next;
