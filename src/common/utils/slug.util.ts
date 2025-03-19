export const createSlug = (text: string): string => {
  const persianToEnglishMap: { [key: string]: string } = {
    "آ": "a", "ا": "a", "ب": "b", "پ": "p", "ت": "t", "ث": "s",
    "ج": "j", "چ": "ch", "ح": "h", "خ": "kh", "د": "d", "ذ": "z",
    "ر": "r", "ز": "z", "ژ": "zh", "س": "s", "ش": "sh", "ص": "s",
    "ض": "z", "ط": "t", "ظ": "z", "ع": "a", "غ": "gh", "ف": "f",
    "ق": "gh", "ک": "k", "گ": "g", "ل": "l", "م": "m", "ن": "n",
    "و": "v", "ه": "h", "ی": "y", "ء": "", "ٔ": "", "‌": "-",
    "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6",
    "۷": "7", "۸": "8", "۹": "9", "۰": "0"
  };

  return text
    .trim()
    .toLowerCase()
    .replace(/[\u0600-\u06FF]/g, char => persianToEnglishMap[char] || char)
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
