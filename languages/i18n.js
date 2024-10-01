import i18next from 'i18next'
import ar from './arabic.json'
import en from './english.json'
import { initReactI18next } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from "react-native-localize";
import { I18nManager } from "react-native";

const LANGUAGES = {ar, en};
const LANG_CODES = Object.keys(LANGUAGES);

const LANGUAGE_DETECTOR = {
    type: 'languageDetector',
    async: true,
    detect: callback => {
        AsyncStorage.getItem('user-language', (err, language) => {
            // if error fetching stored data or no language was stored
            // display errors when in DEV mode as console statements
            if (err || !language) {
                if (err) {
                    // console.log('Error fetching Languages from asyncstorage ', err);
                } else {
                    // console.log('No language is set, choosing Arabic as fallback');
                }
                return;
            }
            // console.log(language)
            // Is it a RTL language?
            const isRTL = language.indexOf('ar') === 0;

            // Allow RTL alignment in RTL languages
            I18nManager.allowRTL(!isRTL);
            I18nManager.forceRTL(!isRTL);

            callback(language);
        });
    },
    init: () => {
    },
    cacheUserLanguage: language => {
        AsyncStorage.setItem('user-language', language);
        // Is it a RTL language?
        const isRTL = language.indexOf('ar') === 0;

        // Allow RTL alignment in RTL languages
        I18nManager.allowRTL(!isRTL);
        I18nManager.forceRTL(!isRTL);
    }
};

i18next
    // detect language
    .use(LANGUAGE_DETECTOR)
    .use(initReactI18next).init({
        compatibilityJSON: 'v3',
        //remove if detector is on
        // lng: 'ar',
        fallbackLng: 'en',

        resources: LANGUAGES,
        react: {
            useSuspense: false
        },
        interpolation: {
            escapeValue: false
        }
    });
export default i18next