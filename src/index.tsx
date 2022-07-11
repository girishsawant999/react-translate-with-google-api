import React, { useEffect, useState, useRef } from 'react';
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

interface TReturnuseTranslate {
  translatedData: {
    [key: string]: string;
  };
  loading: boolean;
}

export const useTranslate = (
  language = 'en-US',
  initialData: {
    [key: string]: string;
  }
): TReturnuseTranslate => {
  const [translatedData, setTranslatedData] = useState(initialData);

  const [translate, { data, loading }] = useLazyTranslate({ language });

  const currentKey = useRef<string>('');
  useEffect(() => {
    void (async (): Promise<void> => {
      for (const [key, value] of Object.entries(initialData)) {
        currentKey.current = key;
        await translate(value);
      }
    })();
  }, [language]);

  useEffect(() => {
    if (data && typeof data === 'string') {
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
}

const Translate: React.FC<TranslateProps> = (props: TranslateProps) => {
  const { language = 'en', skip = false, children, ...otherProps } = props;

  const [translate, { data, loading }] = useLazyTranslate({ language });

  useEffect(() => {
    if (children && !skip) {
      void translate(children);
    }
  }, [translate, children]);

  if (skip) {
    return (
      <span data-loading="false" {...otherProps}>
        {children}
      </span>
    );
  }

  return (
    <span data-loading={loading} {...otherProps}>
      {data || children}
    </span>
  );
};

export default Translate;
