import { useState, useMemo } from 'react';
import './IsraelQuiz.css';
import { playSuccessSound, playErrorSound } from '../../utils/audioUtils';
import SuccessCartoon from '../SuccessCartoon';

const ALL_QUESTIONS = [
  // --- גאוגרפיה ---
  {
    question: 'מהי בירת מדינת ישראל?',
    options: [
      { text: 'תל אביב', emoji: '🏙️', correct: false },
      { text: 'ירושלים', emoji: '🕌', correct: true },
      { text: 'חיפה', emoji: '⚓', correct: false }
    ]
  },
  {
    question: 'באיזה ים אפשר לצוף בלי לשקוע?',
    options: [
      { text: 'הים התיכון', emoji: '🌊', correct: false },
      { text: 'ים כנרת', emoji: '🐟', correct: false },
      { text: 'ים המלח', emoji: '🧂', correct: true }
    ]
  },
  {
    question: 'מהו המדבר הגדול בישראל?',
    options: [
      { text: 'מדבר הנגב', emoji: '🏜️', correct: true },
      { text: 'מדבר יהודה', emoji: '🐪', correct: false },
      { text: 'מדבר סיני', emoji: '🌵', correct: false }
    ]
  },
  {
    question: 'מהו ההר הגבוה ביותר בישראל?',
    options: [
      { text: 'הר תבור', emoji: '⛰️', correct: false },
      { text: 'הר כרמל', emoji: '🌲', correct: false },
      { text: 'הר חרמון', emoji: '🏔️', correct: true }
    ]
  },
  {
    question: 'איזו עיר נמצאת על חוף הים התיכון?',
    options: [
      { text: 'ירושלים', emoji: '🕌', correct: false },
      { text: 'תל אביב', emoji: '🏖️', correct: true },
      { text: 'אילת', emoji: '🐠', correct: false }
    ]
  },
  {
    question: 'באיזו עיר נמצא נמל תעופה בן גוריון?',
    options: [
      { text: 'חיפה', emoji: '⚓', correct: false },
      { text: 'לוד', emoji: '✈️', correct: true },
      { text: 'באר שבע', emoji: '🏜️', correct: false }
    ]
  },
  {
    question: 'מה שמו של האגם הגדול בצפון ישראל?',
    options: [
      { text: 'ים המלח', emoji: '🧂', correct: false },
      { text: 'ים כנרת', emoji: '🐟', correct: true },
      { text: 'הים התיכון', emoji: '🌊', correct: false }
    ]
  },
  {
    question: 'באיזו עיר נמצאים הגנים הבהאיים?',
    options: [
      { text: 'חיפה', emoji: '🌺', correct: true },
      { text: 'נתניה', emoji: '🏙️', correct: false },
      { text: 'אשדוד', emoji: '⚓', correct: false }
    ]
  },
  {
    question: 'איזו עיר נמצאת בדרום ישראל על חוף ים סוף?',
    options: [
      { text: 'אשקלון', emoji: '🏖️', correct: false },
      { text: 'אילת', emoji: '🐠', correct: true },
      { text: 'הרצליה', emoji: '🌊', correct: false }
    ]
  },
  {
    question: 'כמה ימים יש בישראל?',
    options: [
      { text: 'שניים', emoji: '2️⃣', correct: false },
      { text: 'שלושה', emoji: '3️⃣', correct: true },
      { text: 'ארבעה', emoji: '4️⃣', correct: false }
    ]
  },
  {
    question: 'מה שמו של הנהר הארוך בישראל?',
    options: [
      { text: 'נהר הירדן', emoji: '🏞️', correct: true },
      { text: 'נהר הירקון', emoji: '🌊', correct: false },
      { text: 'נחל הבשור', emoji: '💧', correct: false }
    ]
  },
  {
    question: 'איזו עיר ידועה בשם "העיר הלבנה"?',
    options: [
      { text: 'חיפה', emoji: '⚓', correct: false },
      { text: 'תל אביב', emoji: '🏙️', correct: true },
      { text: 'ירושלים', emoji: '🕌', correct: false }
    ]
  },
  {
    question: 'באיזה אזור בישראל יורד הכי הרבה גשם?',
    options: [
      { text: 'הנגב', emoji: '🏜️', correct: false },
      { text: 'הצפון', emoji: '🌧️', correct: true },
      { text: 'המרכז', emoji: '🏙️', correct: false }
    ]
  },
  {
    question: 'מה שמה של המצודה העתיקה ליד ים המלח?',
    options: [
      { text: 'מצדה', emoji: '🏰', correct: true },
      { text: 'עכו', emoji: '⚔️', correct: false },
      { text: 'קיסריה', emoji: '🏛️', correct: false }
    ]
  },
  // --- סמלים ומדינה ---
  {
    question: 'מה מופיע על דגל ישראל?',
    options: [
      { text: 'מגן דוד', emoji: '✡️', correct: true },
      { text: 'חצי ירח', emoji: '🌙', correct: false },
      { text: 'שמש', emoji: '☀️', correct: false }
    ]
  },
  {
    question: 'מה מופיע על סמל מדינת ישראל?',
    options: [
      { text: 'מגן דוד', emoji: '✡️', correct: false },
      { text: 'מנורה ועלי זית', emoji: '🕎', correct: true },
      { text: 'אריה', emoji: '🦁', correct: false }
    ]
  },
  {
    question: 'מהי השפה הרשמית של ישראל?',
    options: [
      { text: 'אנגלית', emoji: '🇬🇧', correct: false },
      { text: 'עברית', emoji: '🇮🇱', correct: true },
      { text: 'צרפתית', emoji: '🇫🇷', correct: false }
    ]
  },
  {
    question: 'מה צבעי דגל ישראל?',
    options: [
      { text: 'אדום ולבן', emoji: '🔴', correct: false },
      { text: 'כחול ולבן', emoji: '🔵', correct: true },
      { text: 'ירוק ולבן', emoji: '🟢', correct: false }
    ]
  },
  {
    question: 'מהו ההמנון הלאומי של ישראל?',
    options: [
      { text: 'התקווה', emoji: '🎵', correct: true },
      { text: 'ירושלים של זהב', emoji: '🎶', correct: false },
      { text: 'הבה נגילה', emoji: '🎤', correct: false }
    ]
  },
  {
    question: 'באיזו שנה קמה מדינת ישראל?',
    options: [
      { text: '1948', emoji: '🇮🇱', correct: true },
      { text: '1950', emoji: '📅', correct: false },
      { text: '1945', emoji: '📆', correct: false }
    ]
  },
  {
    question: 'מי הכריז על הקמת מדינת ישראל?',
    options: [
      { text: 'דוד בן גוריון', emoji: '👨‍💼', correct: true },
      { text: 'חיים וייצמן', emoji: '🧑‍🔬', correct: false },
      { text: 'גולדה מאיר', emoji: '👩‍💼', correct: false }
    ]
  },
  {
    question: 'מהו המטבע של ישראל?',
    options: [
      { text: 'דולר', emoji: '💵', correct: false },
      { text: 'שקל', emoji: '💰', correct: true },
      { text: 'אירו', emoji: '💶', correct: false }
    ]
  },
  // --- חגים ומסורת ---
  {
    question: 'באיזה חג מדליקים נרות בחנוכייה?',
    options: [
      { text: 'חנוכה', emoji: '🕯️', correct: true },
      { text: 'ראש השנה', emoji: '🍎', correct: false },
      { text: 'שבועות', emoji: '🌾', correct: false }
    ]
  },
  {
    question: 'באיזה חג אוכלים מצות?',
    options: [
      { text: 'פורים', emoji: '🎭', correct: false },
      { text: 'פסח', emoji: '🫓', correct: true },
      { text: 'יום כיפור', emoji: '🙏', correct: false }
    ]
  },
  {
    question: 'איזה חג חוגגים עם סוכה?',
    options: [
      { text: 'פסח', emoji: '🫓', correct: false },
      { text: 'פורים', emoji: '🎭', correct: false },
      { text: 'סוכות', emoji: '🌿', correct: true }
    ]
  },
  {
    question: 'באיזה חג מתחפשים?',
    options: [
      { text: 'פורים', emoji: '🎭', correct: true },
      { text: 'חנוכה', emoji: '🕯️', correct: false },
      { text: 'סוכות', emoji: '🌿', correct: false }
    ]
  },
  {
    question: 'מה אוכלים בראש השנה לסימן טוב?',
    options: [
      { text: 'מצה', emoji: '🫓', correct: false },
      { text: 'תפוח בדבש', emoji: '🍎', correct: true },
      { text: 'סופגנייה', emoji: '🍩', correct: false }
    ]
  },
  {
    question: 'כמה נרות יש בחנוכייה?',
    options: [
      { text: 'שבעה', emoji: '7️⃣', correct: false },
      { text: 'תשעה', emoji: '9️⃣', correct: true },
      { text: 'שמונה', emoji: '8️⃣', correct: false }
    ]
  },
  {
    question: 'מה שמו של השופר שתוקעים בראש השנה?',
    options: [
      { text: 'חליל', emoji: '🎵', correct: false },
      { text: 'שופר', emoji: '📯', correct: true },
      { text: 'תוף', emoji: '🥁', correct: false }
    ]
  },
  {
    question: 'באיזה חג קוראים את מגילת אסתר?',
    options: [
      { text: 'סוכות', emoji: '🌿', correct: false },
      { text: 'פורים', emoji: '📜', correct: true },
      { text: 'שבועות', emoji: '🌾', correct: false }
    ]
  },
  {
    question: 'מה אוכלים בחנוכה?',
    options: [
      { text: 'המנטשן', emoji: '🥟', correct: false },
      { text: 'סופגניות ולביבות', emoji: '🍩', correct: true },
      { text: 'מצות', emoji: '🫓', correct: false }
    ]
  },
  {
    question: 'באיזה חג צמים כל היום?',
    options: [
      { text: 'פורים', emoji: '🎭', correct: false },
      { text: 'חנוכה', emoji: '🕯️', correct: false },
      { text: 'יום כיפור', emoji: '🙏', correct: true }
    ]
  },
  {
    question: 'מה שמו של החג שבו שמחים עם ספר התורה?',
    options: [
      { text: 'שמחת תורה', emoji: '📜', correct: true },
      { text: 'ל"ג בעומר', emoji: '🔥', correct: false },
      { text: 'טו בשבט', emoji: '🌳', correct: false }
    ]
  },
  {
    question: 'באיזה חג נוהגים לשתול עצים?',
    options: [
      { text: 'פסח', emoji: '🫓', correct: false },
      { text: 'טו בשבט', emoji: '🌳', correct: true },
      { text: 'חנוכה', emoji: '🕯️', correct: false }
    ]
  },
  {
    question: 'באיזה חג מדליקים מדורות?',
    options: [
      { text: 'ל"ג בעומר', emoji: '🔥', correct: true },
      { text: 'פורים', emoji: '🎭', correct: false },
      { text: 'סוכות', emoji: '🌿', correct: false }
    ]
  },
  {
    question: 'מה עושים בליל הסדר של פסח?',
    options: [
      { text: 'מדליקים נרות', emoji: '🕯️', correct: false },
      { text: 'מספרים את סיפור יציאת מצרים', emoji: '📖', correct: true },
      { text: 'מתחפשים', emoji: '🎭', correct: false }
    ]
  },
  {
    question: 'איזה יום בשבוע הוא יום המנוחה בישראל?',
    options: [
      { text: 'יום שישי', emoji: '📅', correct: false },
      { text: 'שבת', emoji: '🕯️', correct: true },
      { text: 'יום ראשון', emoji: '📆', correct: false }
    ]
  },
  // --- אוכל ---
  {
    question: 'מהו האוכל המפורסם של ישראל?',
    options: [
      { text: 'פיצה', emoji: '🍕', correct: false },
      { text: 'פלאפל', emoji: '🧆', correct: true },
      { text: 'סושי', emoji: '🍣', correct: false }
    ]
  },
  {
    question: 'מהו הפרי שישראל מפורסמת בו?',
    options: [
      { text: 'תפוז', emoji: '🍊', correct: true },
      { text: 'מנגו', emoji: '🥭', correct: false },
      { text: 'אבטיח', emoji: '🍉', correct: false }
    ]
  },
  {
    question: 'מה שמים בתוך פיתה עם פלאפל?',
    options: [
      { text: 'שוקולד', emoji: '🍫', correct: false },
      { text: 'סלט וטחינה', emoji: '🥗', correct: true },
      { text: 'גלידה', emoji: '🍦', correct: false }
    ]
  },
  {
    question: 'מהו המשקה הלאומי של ישראל?',
    options: [
      { text: 'קולה', emoji: '🥤', correct: false },
      { text: 'לימונענע', emoji: '🍋', correct: true },
      { text: 'חלב', emoji: '🥛', correct: false }
    ]
  },
  {
    question: 'מאיזה צמח מכינים חומוס?',
    options: [
      { text: 'עגבנייה', emoji: '🍅', correct: false },
      { text: 'גרגירי חומוס', emoji: '🫘', correct: true },
      { text: 'תפוח אדמה', emoji: '🥔', correct: false }
    ]
  },
  {
    question: 'מהו המאכל המסורתי של שבת?',
    options: [
      { text: 'חלה', emoji: '🍞', correct: true },
      { text: 'בייגלה', emoji: '🥯', correct: false },
      { text: 'פיתה', emoji: '🫓', correct: false }
    ]
  },
  // --- טבע וחי ---
  {
    question: 'מהו הפרח הלאומי של ישראל?',
    options: [
      { text: 'ורד', emoji: '🌹', correct: false },
      { text: 'כלנית', emoji: '🌺', correct: true },
      { text: 'חמנייה', emoji: '🌻', correct: false }
    ]
  },
  {
    question: 'איזה ציפור נודדת עוברת דרך ישראל?',
    options: [
      { text: 'חסידה', emoji: '🦩', correct: true },
      { text: 'פינגווין', emoji: '🐧', correct: false },
      { text: 'תוכי', emoji: '🦜', correct: false }
    ]
  },
  {
    question: 'מהו העץ הלאומי של ישראל?',
    options: [
      { text: 'אורן', emoji: '🌲', correct: false },
      { text: 'עץ זית', emoji: '🫒', correct: true },
      { text: 'דקל', emoji: '🌴', correct: false }
    ]
  },
  {
    question: 'איזה חיה אפשר לראות בים סוף באילת?',
    options: [
      { text: 'דולפין', emoji: '🐬', correct: true },
      { text: 'דוב קוטב', emoji: '🐻‍❄️', correct: false },
      { text: 'כריש לבן', emoji: '🦈', correct: false }
    ]
  },
  {
    question: 'מהו בעל החיים הלאומי של ישראל?',
    options: [
      { text: 'אריה', emoji: '🦁', correct: false },
      { text: 'דוכיפת', emoji: '🐦', correct: true },
      { text: 'נחש', emoji: '🐍', correct: false }
    ]
  },
  {
    question: 'איזו חיה חיה במדבר הנגב?',
    options: [
      { text: 'דוב', emoji: '🐻', correct: false },
      { text: 'יעל', emoji: '🐐', correct: true },
      { text: 'פינגווין', emoji: '🐧', correct: false }
    ]
  },
  {
    question: 'מה גדל על עץ תמר?',
    options: [
      { text: 'תפוחים', emoji: '🍎', correct: false },
      { text: 'בננות', emoji: '🍌', correct: false },
      { text: 'תמרים', emoji: '🌴', correct: true }
    ]
  },
  // --- היסטוריה ותרבות ---
  {
    question: 'מי כתב את התורה לפי המסורת?',
    options: [
      { text: 'דוד המלך', emoji: '👑', correct: false },
      { text: 'משה רבנו', emoji: '📜', correct: true },
      { text: 'אברהם אבינו', emoji: '🧔', correct: false }
    ]
  },
  {
    question: 'מי בנה את בית המקדש הראשון?',
    options: [
      { text: 'שלמה המלך', emoji: '👑', correct: true },
      { text: 'דוד המלך', emoji: '🎵', correct: false },
      { text: 'משה רבנו', emoji: '📜', correct: false }
    ]
  },
  {
    question: 'מהו הכותל המערבי?',
    options: [
      { text: 'קיר של מצודה', emoji: '🏰', correct: false },
      { text: 'שריד מבית המקדש', emoji: '🧱', correct: true },
      { text: 'חומה של עיר', emoji: '🏛️', correct: false }
    ]
  },
  {
    question: 'באיזו עיר נמצא הכותל המערבי?',
    options: [
      { text: 'תל אביב', emoji: '🏙️', correct: false },
      { text: 'ירושלים', emoji: '🕌', correct: true },
      { text: 'חיפה', emoji: '⚓', correct: false }
    ]
  },
  {
    question: 'מה שמו של הספר הקדוש ביהדות?',
    options: [
      { text: 'התורה', emoji: '📜', correct: true },
      { text: 'הקוראן', emoji: '📗', correct: false },
      { text: 'התנ"ך החדש', emoji: '📕', correct: false }
    ]
  },
  // --- כללי ומגוון ---
  {
    question: 'מה שמה של חברת התעופה הלאומית של ישראל?',
    options: [
      { text: 'אל על', emoji: '✈️', correct: true },
      { text: 'ישראייר', emoji: '🛩️', correct: false },
      { text: 'ארקיע', emoji: '🛫', correct: false }
    ]
  },
  {
    question: 'באיזה יבשת נמצאת ישראל?',
    options: [
      { text: 'אירופה', emoji: '🌍', correct: false },
      { text: 'אסיה', emoji: '🌏', correct: true },
      { text: 'אפריקה', emoji: '🌍', correct: false }
    ]
  },
  {
    question: 'מהו הספורט הפופולרי ביותר בישראל?',
    options: [
      { text: 'כדורגל', emoji: '⚽', correct: true },
      { text: 'הוקי', emoji: '🏒', correct: false },
      { text: 'בייסבול', emoji: '⚾', correct: false }
    ]
  },
  {
    question: 'כמה כוכבים יש על דגל ישראל?',
    options: [
      { text: 'אחד', emoji: '1️⃣', correct: false },
      { text: 'אין כוכבים - יש מגן דוד', emoji: '✡️', correct: true },
      { text: 'שניים', emoji: '2️⃣', correct: false }
    ]
  },
  {
    question: 'מהי מערכת הכתב של השפה העברית?',
    options: [
      { text: 'כותבים משמאל לימין', emoji: '➡️', correct: false },
      { text: 'כותבים מימין לשמאל', emoji: '⬅️', correct: true },
      { text: 'כותבים מלמעלה למטה', emoji: '⬇️', correct: false }
    ]
  },
  {
    question: 'מהו יום העצמאות של ישראל?',
    options: [
      { text: 'ה\' באייר', emoji: '🇮🇱', correct: true },
      { text: 'א\' בתשרי', emoji: '📅', correct: false },
      { text: 'כ"ה בכסלו', emoji: '📆', correct: false }
    ]
  },
  {
    question: 'מה חוגגים ביום הזיכרון?',
    options: [
      { text: 'יום הולדת', emoji: '🎂', correct: false },
      { text: 'זוכרים את החיילים שנפלו', emoji: '🕯️', correct: true },
      { text: 'חג שמח', emoji: '🎉', correct: false }
    ]
  },
  {
    question: 'מהו הים שנמצא במערב ישראל?',
    options: [
      { text: 'ים סוף', emoji: '🐠', correct: false },
      { text: 'הים התיכון', emoji: '🌊', correct: true },
      { text: 'ים המלח', emoji: '🧂', correct: false }
    ]
  },
  {
    question: 'איזו מדינה שכנה של ישראל?',
    options: [
      { text: 'צרפת', emoji: '🇫🇷', correct: false },
      { text: 'מצרים', emoji: '🇪🇬', correct: true },
      { text: 'יפן', emoji: '🇯🇵', correct: false }
    ]
  },
  {
    question: 'מה הצבע של ים המלח?',
    options: [
      { text: 'אדום', emoji: '🔴', correct: false },
      { text: 'כחול-ירקרק', emoji: '💎', correct: true },
      { text: 'שחור', emoji: '⚫', correct: false }
    ]
  },
  {
    question: 'למה ים המלח נקרא כך?',
    options: [
      { text: 'כי יש בו דגים מלוחים', emoji: '🐟', correct: false },
      { text: 'כי המים מאוד מלוחים', emoji: '🧂', correct: true },
      { text: 'כי הוא ליד מכרה מלח', emoji: '⛏️', correct: false }
    ]
  },
  {
    question: 'מה הם שבעת המינים?',
    options: [
      { text: 'שבעה בעלי חיים', emoji: '🐾', correct: false },
      { text: 'שבעה פירות וצמחים של ארץ ישראל', emoji: '🌾', correct: true },
      { text: 'שבעה הרים', emoji: '⛰️', correct: false }
    ]
  },
  {
    question: 'מהו השם העברי של ירושלים?',
    options: [
      { text: 'עיר הזהב', emoji: '✨', correct: false },
      { text: 'ירושלים', emoji: '🕌', correct: true },
      { text: 'ציון', emoji: '⭐', correct: false }
    ]
  },
  {
    question: 'איזה כיוון מתפללים יהודים?',
    options: [
      { text: 'לכיוון מזרח - ירושלים', emoji: '🧭', correct: true },
      { text: 'לכיוון צפון', emoji: '⬆️', correct: false },
      { text: 'לכיוון מערב', emoji: '⬅️', correct: false }
    ]
  },
];

const QUESTIONS_PER_GAME = 15;

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function IsraelQuiz({ onComplete, onBack }) {
  const questions = useMemo(() => shuffleArray(ALL_QUESTIONS).slice(0, QUESTIONS_PER_GAME), []);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [showSuccessCartoon, setShowSuccessCartoon] = useState(false);

  const question = questions[currentQuestion];

  const handleAnswer = (option, index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    if (option.correct) {
      setFeedback('correct');
      setScore(score + 1);
      playSuccessSound();
      setShowSuccessCartoon(true);

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setFeedback('');
          setShowSuccessCartoon(false);
        } else {
          setIsGameComplete(true);
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      playErrorSound();

      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback('');
      }, 1000);
    }
  };

  if (isGameComplete) {
    const finalScore = Math.max(1, score);
    return (
      <div className="game-container israel-quiz">
        <div className="completion-screen">
          <div className="quiz-complete">
            <div className="celebration-icons">🇮🇱🎉✡️</div>
            <h1>כל הכבוד! 🎉</h1>
            <p>סיימת את החידון על ישראל!</p>
            <div className="final-score">
              <h2>הציון שלך: {score} / {questions.length}</h2>
              <div className="stars-earned">
                ⭐ הרווחת {finalScore} כוכבים!
              </div>
            </div>
            <button className="success" onClick={() => onComplete(finalScore)}>
              חזרה הביתה 🏠
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container israel-quiz">
      <button className="back" onClick={onBack}>← חזרה</button>

      {showSuccessCartoon && <SuccessCartoon />}

      <div className="game-header">
        <h1>🇮🇱 חידון ישראל 🇮🇱</h1>
        <p className="instructions">בחרו את התשובה הנכונה!</p>
        <div className="score-display">
          נכון: {score} | שאלה: {currentQuestion + 1}/{questions.length}
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-label">התקדמות:</div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
          >
            <span className="progress-star">⭐</span>
          </div>
        </div>
      </div>

      <div className="question-card israel-question-card">
        <h2 className="question-text">{question.question}</h2>
      </div>

      <div className="answers-grid">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`answer-option ${
              selectedAnswer === index
                ? option.correct
                  ? 'correct'
                  : 'wrong'
                : ''
            }`}
            onClick={() => handleAnswer(option, index)}
            disabled={selectedAnswer !== null}
          >
            <span className="option-emoji">{option.emoji}</span>
            <span className="option-label">{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default IsraelQuiz;
