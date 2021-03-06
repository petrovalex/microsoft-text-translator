import axios, { AxiosInstance } from 'axios';
import * as qs from 'qs';
import * as uuidv4 from 'uuid/v4';
import {
  GetLanguagesResponse,
  ConfigOptions,
  Text,
  TranslateOptions,
  TranslateResponse,
  TransliterateOptions,
  BreakSentenceOptions,
  DetectLanguageResponse,
  DictinaryLookupOptions,
  DictionaryLookupResponse,
  BreakSentenceResponse,
  TransliterateResponse,
  DictinaryExampleData,
  DictionaryExampleOptions,
  DictinaryExamplesResponse,
} from './ms-text-translator.types';

const BASE_URL = 'https://api.cognitive.microsofttranslator.com';

export class MsTextTranslator {
  private api: AxiosInstance;

  constructor(private readonly config: ConfigOptions) {
    this.api = axios.create({
      baseURL: BASE_URL,
      params: {
        'api-version': '3.0',
      },
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.credentials.subscriptionKey,
        'Content-Type': 'application/json',
      },
    });
  }

  async getLanguages<Scope extends keyof GetLanguagesResponse>(
    scopes: Scope[] = ['translation', 'transliteration', 'dictionary'] as Scope[]
  ) {
    let params = {};
    if (scopes.length) {
      params = {
        ...params,
        scope: scopes.join(','),
      };
    }
    const response = await this.api.get<Pick<GetLanguagesResponse, Scope>>('languages', {
      params,
      headers: this.makeHeaders(),
    });
    return response.data;
  }

  translate(data: Text[], options: TranslateOptions) {
    return this.makeRequest<TranslateResponse>('translate', data, options);
  }

  transliterate(data: Text[], options: TransliterateOptions) {
    return this.makeRequest<TransliterateResponse>('transliterate', data, options);
  }

  detectLanguage(data: Text[]) {
    return this.makeRequest<DetectLanguageResponse>('detect', data);
  }

  breakSentence(data: Text[], options: BreakSentenceOptions = {}) {
    return this.makeRequest<BreakSentenceResponse>('breaksentence', data, options);
  }

  lookupDictionary(data: Text[], options: DictinaryLookupOptions) {
    return this.makeRequest<DictionaryLookupResponse>('dictionary/lookup', data, options);
  }

  dictionaryExamples(data: DictinaryExampleData[], options: DictionaryExampleOptions) {
    return this.makeRequest<DictinaryExamplesResponse>('dictionary/examples', data, options);
  }

  private async makeRequest<TResponse>(op: string, data: any, params: object = {}, request = this.api.post) {
    const response = await request<TResponse>(op, data, {
      params,
      headers: this.makeHeaders(),
      paramsSerializer: function(p) {
        return qs.stringify(p, { arrayFormat: 'repeat' });
      },
    });
    return response.data;
  }
  private makeHeaders() {
    return {
      'X-ClientTraceId': uuidv4().toString(),
    };
  }
}
