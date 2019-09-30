export type ConfigOptions = {
  credentials: Credentials;
};

export type Credentials = {
  subscriptionKey: string;
};

export interface LangProps {
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export interface LangPropsWithCode extends LangProps {
  code: string;
}

export type Scripts = {
  [K in keyof LangPropsWithCode]: LangPropsWithCode[K];
} & {
  toScripts: LangPropsWithCode[];
};

export type Translations = {
  [K in keyof LangProps]: LangProps[K];
} & {
  translations: LangPropsWithCode[];
};

export interface LangPropsWithScripts extends Exclude<LangProps, 'dir'> {
  scripts: Scripts;
}

export type GetLanguagesResponse = {
  translation: { [langTag: string]: LangProps };
  transliteration: { [langTag: string]: LangPropsWithScripts };
  dictionary: { [langTag: string]: Translations };
};

export type TranslateResponse = {
  detectedLanguage?: {
    language: string;
    score: number;
  };
  translations: [
    {
      to: string;
      text: string;
      alignment?: { proj: string };
      sentLen?: { srcSentLen: number[]; transSentLen: number[] };
      transliteration?: {
        script: string;
        text: string;
      };
    }
  ];
  sourceText?: {
    text: string;
  };
}[];

type DetectLanguageResult = {
  language: string;
  score: number;
  isTranslationSupported: boolean;
  isTransliterationSupported: boolean;
};

export type DetectLanguageResponse = (DetectLanguageResult & { alternatives: DetectLanguageResult[] })[];

export type TransliterateResponse = {
  text: string;
  script: string;
}[];

export type BreakSentenceResponse = {
  sentenceLengths: number[];
  detectedLanguage?: {
    language: string;
    score: number;
  };
}[];

export type DictionaryLookupResponse = {
  normalizedSource: string;
  displaySource: string;
  translations: {
    normalizedTarget: string;
    displayTarget: string;
    posTag: string;
    confidence: number;
    prefixWord: string;
    backTranslations: {
      normalizedText: string;
      displayText: string;
      numExamples: string;
      frequencyCount: number;
    }[];
  }[];
}[];

export type DictinaryExamplesResponse = {
  normalizedSource: string;
  normalizedTarget: string;
  examples: {
    sourcePrefix: string;
    sourceTerm: string;
    sourceSuffix: string;
    targetPrefix: string;
    targetTerm: string;
    targetSuffix: string;
  }[];
}[];

export interface Text {
  text: string;
}

export interface DictinaryExampleData {
  text: string;
  translation: string;
}

export enum ProfanityAction {
  NoAction = 'NoAction',
  Marked = 'Marked',
  Deleted = 'Deleted',
}

export enum ProfanityMarker {
  Asterisk = 'Asterisk',
  Tag = 'Tag',
}

export interface TranslateOptions {
  to: string | string[];
  from?: string;
  textType?: 'plain' | 'html';
  category?: string;
  profanityAction?: ProfanityAction;
  profanityMarker?: ProfanityMarker;
  includeAlignment?: boolean;
  includeSentenceLength?: boolean;
  suggestedFrom?: string;
  fromScript?: string;
  toScript?: string;
  allowFallback?: boolean;
}

export interface TransliterateOptions {
  language: string;
  fromScript: string;
  toScript: string;
}

export interface BreakSentenceOptions {
  language?: string;
  script?: string;
}

export interface DictinaryLookupOptions {
  from: string;
  to: string;
}

export interface DictionaryExampleOptions {
  from: string;
  to: string;
}
