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
};

export interface TextForTranslate {
  Text: string;
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
