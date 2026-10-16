// Copyright 2026 Softwell S.r.l. - SPDX-License-Identifier: Apache-2.0
// Vocabulary from genro-toolbox dfb7322a53a2f9030d6baaadfbb87028559672fd.
// Keep the upstream JSON contents unchanged; see PORT-0009 for refresh/fixture provenance.
const locales = {
    "it": {
        "months": {
            "gennaio": 1,
            "febbraio": 2,
            "marzo": 3,
            "aprile": 4,
            "maggio": 5,
            "giugno": 6,
            "luglio": 7,
            "agosto": 8,
            "settembre": 9,
            "ottobre": 10,
            "novembre": 11,
            "dicembre": 12,
            "gen": 1,
            "feb": 2,
            "mar": 3,
            "apr": 4,
            "mag": 5,
            "giu": 6,
            "lug": 7,
            "ago": 8,
            "set": 9,
            "ott": 10,
            "nov": 11,
            "dic": 12
        },
        "weekdays": {
            "lunedì": 0,
            "martedì": 1,
            "mercoledì": 2,
            "giovedì": 3,
            "venerdì": 4,
            "sabato": 5,
            "domenica": 6,
            "lun": 0,
            "mar": 1,
            "mer": 2,
            "gio": 3,
            "ven": 4,
            "sab": 5,
            "dom": 6
        },
        "quarters": {
            "1º trimestre": 1,
            "2º trimestre": 2,
            "3º trimestre": 3,
            "4º trimestre": 4,
            "1° trimestre": 1,
            "2° trimestre": 2,
            "3° trimestre": 3,
            "4° trimestre": 4,
            "t1": 1,
            "t2": 2,
            "t3": 3,
            "t4": 4,
            "q1": 1,
            "q2": 2,
            "q3": 3,
            "q4": 4
        },
        "keywords": {
            "today": [
                "oggi"
            ],
            "yesterday": [
                "ieri"
            ],
            "tomorrow": [
                "domani"
            ],
            "this_week": [
                "questa settimana",
                "settimana"
            ],
            "last_week": [
                "settimana scorsa"
            ],
            "next_week": [
                "settimana prossima"
            ],
            "this_month": [
                "questo mese",
                "mese"
            ],
            "last_month": [
                "mese scorso"
            ],
            "next_month": [
                "mese prossimo"
            ],
            "last": [
                "scorso",
                "scorsa"
            ],
            "next": [
                "prossimo",
                "prossima"
            ],
            "articles": [
                "il",
                "lo",
                "la"
            ],
            "from": [
                "da",
                "dal",
                "dalla",
                "tra",
                "fra"
            ],
            "to": [
                "a",
                "al",
                "alla",
                "e"
            ],
            "no_period": [
                "-",
                "senza periodo",
                "sempre"
            ]
        },
        "date_order": {
            "default": "DMY"
        }
    },
    "en": {
        "months": {
            "january": 1,
            "february": 2,
            "march": 3,
            "april": 4,
            "may": 5,
            "june": 6,
            "july": 7,
            "august": 8,
            "september": 9,
            "october": 10,
            "november": 11,
            "december": 12,
            "jan": 1,
            "feb": 2,
            "mar": 3,
            "apr": 4,
            "jun": 6,
            "jul": 7,
            "aug": 8,
            "sep": 9,
            "oct": 10,
            "nov": 11,
            "dec": 12
        },
        "weekdays": {
            "monday": 0,
            "tuesday": 1,
            "wednesday": 2,
            "thursday": 3,
            "friday": 4,
            "saturday": 5,
            "sunday": 6,
            "mon": 0,
            "tue": 1,
            "wed": 2,
            "thu": 3,
            "fri": 4,
            "sat": 5,
            "sun": 6
        },
        "quarters": {
            "1st quarter": 1,
            "2nd quarter": 2,
            "3rd quarter": 3,
            "4th quarter": 4,
            "q1": 1,
            "q2": 2,
            "q3": 3,
            "q4": 4
        },
        "keywords": {
            "today": [
                "today"
            ],
            "yesterday": [
                "yesterday"
            ],
            "tomorrow": [
                "tomorrow"
            ],
            "this_week": [
                "this week",
                "week"
            ],
            "last_week": [
                "last week"
            ],
            "next_week": [
                "next week"
            ],
            "this_month": [
                "this month",
                "month"
            ],
            "last_month": [
                "last month"
            ],
            "next_month": [
                "next month"
            ],
            "last": [
                "last"
            ],
            "next": [
                "next"
            ],
            "articles": [
                "the"
            ],
            "from": [
                "from",
                "between"
            ],
            "to": [
                "to",
                "and"
            ],
            "no_period": [
                "no period",
                "always"
            ]
        },
        "date_order": {
            "default": "MDY",
            "GB": "DMY",
            "AU": "DMY",
            "IE": "DMY",
            "NZ": "DMY",
            "IN": "DMY"
        }
    }
};

export function localeContext(locale) {
    if (typeof locale !== 'string') throw new RangeError('A supported locale is required.');
    const tag = locale.replaceAll('-', '_');
    const split = tag.indexOf('_');
    const language = (split < 0 ? tag : tag.slice(0, split)).toLowerCase();
    const region = (split < 0 ? '' : tag.slice(split + 1)).toUpperCase();
    if (!Object.hasOwn(locales, language)) throw new RangeError(`Unsupported locale: ${locale}`);
    const dictionary = locales[language];
    const phrases = key => [...new Set([...dictionary.keywords[key], ...locales.en.keywords[key]])];
    return {dictionary, phrases, order: dictionary.date_order[region] ?? dictionary.date_order.default};
}
