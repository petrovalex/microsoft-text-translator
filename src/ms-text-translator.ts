import axios, { AxiosInstance } from 'axios';
import * as uuidv4 from 'uuid/v4';
import {
  GetLanguagesResponse,
  Credentials,
  Text,
  TranslateOptions,
  TranslateResponse,
  TransliterateOptions,
  BreakSentenceOptions,
  DetectLanguageResponse,
} from './ms-text-translator.types';

const qs = require('qs');

const BASE_URL = 'https://api.cognitive.microsofttranslator.com';

export class MsTextTranslator {
  api: AxiosInstance;

  constructor(
    private readonly credentials: Credentials //private readonly autoRefresh = true
  ) {
    this.api = axios.create({
      baseURL: BASE_URL,
      params: {
        'api-version': '3.0',
      },
      headers: {
        'Ocp-Apim-Subscription-Key': this.credentials.subscriptionKey,
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
      headers: {
        'X-ClientTraceId': uuidv4().toString(),
      },
    });
    return response.data;
  }

  async translate(data: Text[], options: TranslateOptions) {
    const response = await this.api.post<TranslateResponse>('translate', data, {
      params: options,
      headers: {
        'X-ClientTraceId': uuidv4().toString(),
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
    return response.data;
  }

  async transliterate(data: Text[], options: TransliterateOptions) {
    const response = await this.api.post('transliterate', data, {
      params: options,
      headers: {
        'X-ClientTraceId': uuidv4().toString(),
      },
    });
    return response.data;
  }

  async detectLanguage(data: Text[]) {
    const response = await this.api.post<DetectLanguageResponse>('detect', data, {
      headers: {
        'X-ClientTraceId': uuidv4().toString(),
      },
    });
    return response.data;
  }

  async breakSentence(data: Text[], options: BreakSentenceOptions = {}) {
    const response = await this.api.post('breaksentence', data, {
      params: options,
      headers: {
        'X-ClientTraceId': uuidv4().toString(),
      },
    });
    return response.data;
  }
}
