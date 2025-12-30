import api from './api';

/**
 * Traduce un texto usando el backend
 */
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (!text || targetLang === 'en' || targetLang === 'en-US') {
    return text;
  }

  try {
    const response = await api.post('/translate', {
      text,
      targetLang
    });
    return response.data.translatedText;
  } catch (error) {
    console.error('Error al traducir texto:', error);
    return text; // Retornar original si falla
  }
};

/**
 * Traduce múltiples campos de un objeto
 */
export const translateObject = async (
  object: any,
  fields: string[],
  targetLang: string
): Promise<any> => {
  if (!object || targetLang === 'en' || targetLang === 'en-US') {
    return object;
  }

  try {
    const response = await api.post('/translate/fields', {
      object,
      fields,
      targetLang
    });
    return response.data;
  } catch (error) {
    console.error('Error al traducir objeto:', error);
    return object; // Retornar original si falla
  }
};

export default {
  translateText,
  translateObject
};

