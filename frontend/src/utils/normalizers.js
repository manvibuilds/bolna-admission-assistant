const DEVANAGARI_REGEX = /[\u0900-\u097F]/;

const VOWELS = {
  '\u0905': 'a',
  '\u0906': 'aa',
  '\u0907': 'i',
  '\u0908': 'ee',
  '\u0909': 'u',
  '\u090A': 'oo',
  '\u090F': 'e',
  '\u0910': 'ai',
  '\u0913': 'o',
  '\u0914': 'au',
};

const CONSONANTS = {
  '\u0915': 'k',
  '\u0916': 'kh',
  '\u0917': 'g',
  '\u0918': 'gh',
  '\u0919': 'n',
  '\u091A': 'ch',
  '\u091B': 'chh',
  '\u091C': 'j',
  '\u091D': 'jh',
  '\u091E': 'ny',
  '\u091F': 't',
  '\u0920': 'th',
  '\u0921': 'd',
  '\u0922': 'dh',
  '\u0923': 'n',
  '\u0924': 't',
  '\u0925': 'th',
  '\u0926': 'd',
  '\u0927': 'dh',
  '\u0928': 'n',
  '\u092A': 'p',
  '\u092B': 'ph',
  '\u092C': 'b',
  '\u092D': 'bh',
  '\u092E': 'm',
  '\u092F': 'y',
  '\u0930': 'r',
  '\u0932': 'l',
  '\u0935': 'v',
  '\u0936': 'sh',
  '\u0937': 'sh',
  '\u0938': 's',
  '\u0939': 'h',
};

const MATRAS = {
  '\u093E': 'aa',
  '\u093F': 'i',
  '\u0940': 'ee',
  '\u0941': 'u',
  '\u0942': 'oo',
  '\u0947': 'e',
  '\u0948': 'ai',
  '\u094B': 'o',
  '\u094C': 'au',
};

const MISC = {
  '\u0901': 'n',
  '\u0902': 'n',
  '\u0903': 'h',
  '\u0964': '.',
  '\u0965': '.',
};

const HALANT = '\u094D';

function transliterateDevanagari(input) {
  if (!input || !DEVANAGARI_REGEX.test(input)) return input || '';

  const chars = Array.from(input);
  let out = '';

  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];

    if (VOWELS[ch]) {
      out += VOWELS[ch];
      continue;
    }

    if (CONSONANTS[ch]) {
      const next = chars[i + 1];
      if (next === HALANT) {
        out += CONSONANTS[ch];
        i += 1;
      } else if (next && MATRAS[next]) {
        out += CONSONANTS[ch] + MATRAS[next];
        i += 1;
      } else {
        out += CONSONANTS[ch] + 'a';
      }
      continue;
    }

    if (MATRAS[ch]) {
      out += MATRAS[ch];
      continue;
    }

    if (MISC[ch]) {
      out += MISC[ch];
      continue;
    }

    out += ch;
  }

  return out
    .replace(/aa(?=\b)/g, 'a')
    .replace(/\s+/g, ' ')
    .trim();
}

function toTitleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function toEnglishText(value) {
  if (value == null) return '';
  const text = String(value).trim();
  if (!text) return '';
  if (!DEVANAGARI_REGEX.test(text)) return text;
  return toTitleCase(transliterateDevanagari(text));
}

export function normalizeGrade(grade) {
  const raw = toEnglishText(grade).trim();
  if (!raw) return '';

  const lower = raw.toLowerCase();
  if (lower === 'nursery') return 'Nursery';
  if (lower === 'lkg') return 'LKG';
  if (lower === 'ukg') return 'UKG';

  const numMatch = lower.match(/^(?:class|grade)?\s*([0-9]{1,2})$/);
  if (numMatch) {
    return `Class ${numMatch[1]}`;
  }

  const classPrefixMatch = raw.match(/^(class|grade)\s+(.+)$/i);
  if (classPrefixMatch) {
    return `Class ${classPrefixMatch[2].trim()}`;
  }

  return raw;
}

export function normalizeEnquiry(enquiry) {
  return {
    ...enquiry,
    child_name: toEnglishText(enquiry.child_name),
    parent_name: toEnglishText(enquiry.parent_name),
    query_summary: toEnglishText(enquiry.query_summary),
    callback_time: toEnglishText(enquiry.callback_time),
    grade: normalizeGrade(enquiry.grade),
  };
}
