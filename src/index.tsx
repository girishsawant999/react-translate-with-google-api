import React from 'react';
import { setConfig, useTranslate } from 'react-google-translate';
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

export const translate = async (
  text: string,
  language = 'en-US',
  skip = false
): Promise<null | string | string[]> => {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const { data, loading } = await useTranslate(text, { language, skip });
  if (loading) {
    return null;
  }
  return data;
};

interface TranslateProps {
  children: string;
  language?: string;
  skip?: boolean;
  className?: string;
}

const Translate: React.FC<TranslateProps> = ({
  children,
  language = 'en-US',
  skip = false,
  className = ''
}: TranslateProps) => {
  if (skip) {
    return (
      <span data-loading="false" className={className}>
        {children}
      </span>
    );
  }

  const { data, loading } = useTranslate(children, { language, skip });

  return (
    <span data-loading={loading} className={className}>
      {data || children}
    </span>
  );
};

export default Translate;
