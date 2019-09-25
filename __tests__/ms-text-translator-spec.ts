import { MsTextTranslator } from '../src/ms-text-translator';
import { ProfanityAction } from '../src/ms-text-translator.types';

const subscriptionKey = '';
const translator = new MsTextTranslator({ subscriptionKey });

describe('MsTextTranslator', () => {
  describe('languages', () => {
    it('gets the set of languages currently supported by other operations', async () => {
      const languages = await translator.getLanguages(['translation', 'transliteration', 'dictionary']);
      expect(Object.keys(languages)).toEqual(['translation', 'transliteration', 'dictionary']);
    });
  });

  describe('translate', () => {
    it('translates a single input', async () => {
      const translation = await translator.translate([{ Text: 'Hello, what is your name?' }], {
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
      const translation = await translator.translate([{ Text: 'Hello, what is your name?' }], {
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
      const translation = await translator.translate([{ Text: 'Hello, what is your name?' }], {
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
        [{ Text: 'Hello, what is your name?' }, { Text: 'I am fine, thank you.' }],
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
      const translation = await translator.translate([{ Text: 'Hello, what is your name?' }], {
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
      const translation = await translator.translate([{ Text: 'This is a freaking good idea.' }], {
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
            Text:
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
                'site ou à des utilisateurs comme un humain. Il suffit de copier et coller un extrait de code n\'importe où.',
              to: 'fr',
              sentLen: { srcSentLen: [40, 117, 46], transSentLen: [50, 154, 62] },
            },
          ],
        },
      ]);
    });
  });
});
