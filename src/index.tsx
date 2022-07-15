import React, { useEffect, useState, Dispatch } from 'react';
import './style.scss';
import { Translate as TranslateV2 } from '@google-cloud/translate/build/src/v2';
import {
  Translate as ITranslate,
  LanguageResult
} from '@google-cloud/translate/build/src/v2/index.d';

let translate: undefined | ITranslate;
export const setupConfig = ({
  clientEmail,
  privateKey,
  projectId
}: {
  clientEmail: string;
  privateKey: string;
  projectId: string;
}): void => {
  try {
    translate = new TranslateV2({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey
      },
      projectId
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error while setting up Google Translate API:', error);
  }
};

const useLocalStorage = (key: string, initialValue: unknown): [unknown, Dispatch<unknown>] => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return (item ? JSON.parse(item) : initialValue) as unknown;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [value]);

  return [value, setValue];
};

interface TReturnUseTranslate {
  translatedData: {
    [key: string]: string;
  };
  loading: boolean;
}

export const useTranslate = (
  language = 'en-US',
  initialData: {
    [key: string]: string;
  },
  options: {
    skip?: boolean;
    useStorage?: boolean;
  } = {}
): TReturnUseTranslate => {
  const [storedTranslatedData, setStoredTranslatedData] = useLocalStorage('react-translate', {});
  const { useStorage } = { useStorage: true, ...options };
  const { skip } = { skip: false, ...options };

  const [translatedData, setTranslatedData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skip) return;
    if (!translate) {
      throw new Error('Google Translate API is not setup yet');
    }
    void (async (): Promise<void> => {
      setLoading(true);
      for (const [key, value] of Object.entries(initialData)) {
        if (useStorage) {
          const existedValue = (storedTranslatedData as { [key: string]: string })[
            `${language}-${key}`
          ];
          if (existedValue) {
            setTranslatedData((prevState) => ({
              ...prevState,
              [key]: existedValue
            }));
            continue;
          }
        }
        try {
          const result = await translate.translate(value, language);
          const translatedText = result[0];
          setTranslatedData((prevState) => ({
            ...prevState,
            [key]: translatedText
          }));
          setStoredTranslatedData((prevState: { [key: string]: string }) => ({
            ...prevState,
            [`${language}-${key}`]: translatedText
          }));
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error while translating: ${value} & language ${language}`, error);
        }
      }
      setLoading(false);
    })();
  }, [language]);

  return {
    translatedData,
    loading
  };
};

interface TranslateProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  children: string;
  language?: string;
  skip?: boolean;
  useStorage?: boolean;
}

const Translate: React.FC<TranslateProps> = (props: TranslateProps) => {
  const { language = 'en-US', skip = false, useStorage = true, children, ...otherProps } = props;
  const { translatedData, loading } = useTranslate(
    language,
    {
      [children]: children
    },
    { skip, useStorage }
  );

  return (
    <span data-loading={loading} {...otherProps}>
      {translatedData[children]}
    </span>
  );
};

export const getLanguages = async (): Promise<LanguageResult[]> => {
  if (!translate) {
    throw new Error('Google Translate API is not setup yet');
  }
  const result = await translate.getLanguages();
  return result[0];
};

export default Translate;
