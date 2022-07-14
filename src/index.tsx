import React, { useEffect, useState, useRef, Dispatch } from 'react';
import { setConfig, useLazyTranslate } from 'react-google-translate';
import './style.scss';

export const setupConfig = ({
  clientEmail,
  privateKey,
  projectId
}: {
  clientEmail: string;
  privateKey: string;
  projectId: string;
}): void => {
  setConfig({
    clientEmail,
    privateKey,
    projectId
  })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('Config set react with google translate');
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error in setting config react with google translate', err);
    });
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
  const { skip, useStorage } = { skip: false, useStorage: true, ...options };

  const [translatedData, setTranslatedData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const [translate, { data }] = useLazyTranslate({ language, skip });

  const currentKey = useRef<string>('');
  const currentValue = useRef<string>('');
  useEffect(() => {
    if (skip) return;
    void (async (): Promise<void> => {
      setLoading(true);
      for (const [key, value] of Object.entries(initialData)) {
        if (useStorage) {
          const existedValue = (storedTranslatedData as { [key: string]: string })[
            `${language}-${value}`
          ];
          if (existedValue) {
            setTranslatedData({
              ...translatedData,
              [key]: existedValue
            });
            continue;
          }
        }
        currentKey.current = key;
        currentValue.current = value;
        await translate(value);
      }
      setLoading(false);
    })();
  }, [language]);

  useEffect(() => {
    if (skip) return;
    if (data && typeof data === 'string') {
      if (useStorage) {
        setStoredTranslatedData({
          ...(storedTranslatedData as { [key: string]: string }),
          [`${language}-${currentValue.current}`]: data
        });
      }
      setTranslatedData({
        ...translatedData,
        [currentKey.current]: data
      });
    }
  }, [data]);

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

export default Translate;
