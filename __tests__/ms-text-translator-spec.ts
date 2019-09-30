import { MsTextTranslator } from '../src/ms-text-translator';
import { ProfanityAction } from '../src/ms-text-translator.types';

const subscriptionKey = '';
const translator = new MsTextTranslator({
  credentials: {
    subscriptionKey,
  },
});

describe('MsTextTranslator', () => {
  describe('languages', () => {
    it('gets the set of languages currently supported by other operations', async () => {
      const languages = await translator.getLanguages(['translation', 'transliteration', 'dictionary']);
      expect(Object.keys(languages)).toEqual(['translation', 'transliteration', 'dictionary']);
    });
  });

  describe('translate', () => {
    it('translates a single input', async () => {
      const translation = await translator.translate([{ text: 'Hello, what is your name?' }], {
        from: 'en',
        to: 'zh-Hans',
      });

      expect(translation).toEqual([
        {
          translations: [{ text: '你好，你叫什么名字？', to: 'zh-Hans' }],
        },
      ]);
    });

    it('translates a single input with language auto-detection', async () => {
      const translation = await translator.translate([{ text: 'Hello, what is your name?' }], {
        to: 'zh-Hans',
      });

      expect(translation).toEqual([
        {
          detectedLanguage: { language: 'en', score: 1.0 },
          translations: [{ text: '你好，你叫什么名字？', to: 'zh-Hans' }],
        },
      ]);
    });

    it('translates with transliteration', async () => {
      const translation = await translator.translate([{ text: 'Hello, what is your name?' }], {
        to: 'zh-Hans',
        toScript: 'Latn',
      });

      expect(translation).toEqual([
        {
          detectedLanguage: { language: 'en', score: 1.0 },
          translations: [
            {
              text: '你好，你叫什么名字？',
              transliteration: { script: 'Latn', text: 'nǐ hǎo ， nǐ jiào shén me míng zì ？' },
              to: 'zh-Hans',
            },
          ],
        },
      ]);
    });

    it('translates multiple pieces of text', async () => {
      const translation = await translator.translate(
        [{ text: 'Hello, what is your name?' }, { text: 'I am fine, thank you.' }],
        {
          from: 'en',
          to: 'zh-Hans',
        }
      );

      expect(translation).toEqual([
        {
          translations: [{ text: '你好，你叫什么名字？', to: 'zh-Hans' }],
        },
        {
          translations: [{ text: '我很好，谢谢你。', to: 'zh-Hans' }],
        },
      ]);
    });

    it('translates to multiple languages', async () => {
      const translation = await translator.translate([{ text: 'Hello, what is your name?' }], {
        from: 'en',
        to: ['zh-Hans', 'de'],
      });

      expect(translation).toEqual([
        {
          translations: [{ text: '你好，你叫什么名字？', to: 'zh-Hans' }, { text: 'Hallo, wie heißt du?', to: 'de' }],
        },
      ]);
    });

    it.skip('handles profanity', async () => {
      const translation = await translator.translate([{ text: 'This is a freaking good idea.' }], {
        from: 'en',
        to: 'de',
        profanityAction: ProfanityAction.Marked,
      });

      expect(translation).toEqual([
        {
          translations: [{ text: 'Das ist eine *** gute Idee.', to: 'de' }],
        },
      ]);
    });

    it('obtains sentence boundaries', async () => {
      const translation = await translator.translate(
        [
          {
            text:
              'The answer lies in machine translation. ' +
              'The best machine translation technology cannot always provide translations tailored to a site or users like a human. ' +
              'Simply copy and paste a code snippet anywhere.',
          },
        ],
        {
          from: 'en',
          to: 'fr',
          includeSentenceLength: true,
        }
      );

      expect(translation).toEqual([
        {
          translations: [
            {
              text:
                'La réponse réside dans la traduction automatique. La meilleure technologie de traduction automatique ne peut pas toujours fournir des traductions adaptées à un ' +
                "site ou à des utilisateurs comme un humain. Il suffit de copier et coller un extrait de code n'importe où.",
              to: 'fr',
              sentLen: { srcSentLen: [40, 117, 46], transSentLen: [50, 154, 62] },
            },
          ],
        },
      ]);
    });

    describe('transliterate', () => {
      it('transliterates text', async () => {
        const transliteration = await translator.transliterate(
          [
            {
              text: 'こんにちは',
            },
          ],
          {
            language: 'ja',
            fromScript: 'jpan',
            toScript: 'latn',
          }
        );

        expect(transliteration).toEqual([{ text: "Kon'nichiwa", script: 'latn' }]);
      });
    });

    describe('detect', () => {
      it('detects language', async () => {
        const detect = await translator.detectLanguage([
          { text: 'Ich würde wirklich gern Ihr Auto um den Block fahren ein paar Mal.' },
        ]);
        expect(detect).toEqual([
          {
            alternatives: [
              { isTranslationSupported: true, isTransliterationSupported: false, language: 'nl', score: 0.92 },
              { isTranslationSupported: true, isTransliterationSupported: false, language: 'sk', score: 0.77 },
            ],
            isTranslationSupported: true,
            isTransliterationSupported: false,
            language: 'de',
            score: 1,
          },
        ]);
      });
    });

    describe('break sentence', () => {
      it('breaks sentence', async () => {
        const breaksentence = await translator.breakSentence([
          { text: 'How are you? I am fine. What did you do today?' },
        ]);
        expect(breaksentence).toEqual([
          {
            sentLen: [13, 11, 22],
            detectedLanguage: {
              language: 'en',
              score: 1,
            },
          },
        ]);
      });
    });

    describe('dictinary lookup', () => {
      it('provides alternative translation for the word', async () => {
        const lookup = await translator.lookupDictionary([{ text: 'rahaa' }], { from: 'fi', to: 'en' });

        expect(lookup).toEqual([
          {
            normalizedSource: 'rahaa',
            displaySource: 'rahaa',
            translations: [
              {
                normalizedTarget: 'money',
                displayTarget: 'money',
                posTag: 'NOUN',
                confidence: 0.6793,
                prefixWord: '',
                backTranslations: [
                  { normalizedText: 'rahaa', displayText: 'rahaa', numExamples: 15, frequencyCount: 23016 },
                  { normalizedText: 'rahat', displayText: 'rahat', numExamples: 15, frequencyCount: 2028 },
                  { normalizedText: 'raha', displayText: 'raha', numExamples: 15, frequencyCount: 1984 },
                  { normalizedText: 'rahan', displayText: 'rahan', numExamples: 15, frequencyCount: 1283 },
                  { normalizedText: 'rahoista', displayText: 'rahoista', numExamples: 5, frequencyCount: 173 },
                  { normalizedText: 'rahoja', displayText: 'rahoja', numExamples: 5, frequencyCount: 168 },
                  { normalizedText: 'rahasta', displayText: 'rahasta', numExamples: 5, frequencyCount: 167 },
                ],
              },
              {
                normalizedTarget: 'cash',
                displayTarget: 'cash',
                posTag: 'NOUN',
                confidence: 0.1783,
                prefixWord: '',
                backTranslations: [
                  { normalizedText: 'käteistä', displayText: 'käteistä', numExamples: 15, frequencyCount: 2432 },
                  { normalizedText: 'rahaa', displayText: 'rahaa', numExamples: 15, frequencyCount: 1145 },
                  { normalizedText: 'rahat', displayText: 'rahat', numExamples: 15, frequencyCount: 215 },
                  { normalizedText: 'kassa', displayText: 'kassa', numExamples: 15, frequencyCount: 128 },
                  { normalizedText: 'rahana', displayText: 'rahana', numExamples: 5, frequencyCount: 103 },
                  { normalizedText: 'rahavirtaa', displayText: 'rahavirtaa', numExamples: 5, frequencyCount: 36 },
                ],
              },
              {
                normalizedTarget: 'spend money',
                displayTarget: 'spend money',
                posTag: 'VERB',
                confidence: 0.1423,
                prefixWord: '',
                backTranslations: [
                  { normalizedText: 'rahaa', displayText: 'rahaa', numExamples: 15, frequencyCount: 133 },
                ],
              },
            ],
          },
        ]);
      });
    });

    describe('dictionary examples', () => {
      it('should provide examples', async () => {
        const examples = await translator.dictionaryExamples([{ text: 'fly', translation: 'volar' }], {
          from: 'en',
          to: 'es',
        });

        expect(examples[0]).toMatchObject({
          normalizedSource: 'fly',
          normalizedTarget: 'volar',
        });
        expect(examples[0].examples.length).toBeGreaterThan(0);
      });
    });
  });
});
