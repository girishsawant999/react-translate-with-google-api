<p align="center">
  <a href="#" rel="noopener">
 <img height=200px src="./.github/readme/intro.png" alt="Project logo"></a>
</p>

<h2 align="center">React Translate with Google API</h2>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)](#)
[![GitHub Issues](https://img.shields.io/github/issues/girishsawant999/react-translate-with-google-api.svg)](https://github.com/girishsawant999/react-translate-with-google-api/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/girishsawant999/react-translate-with-google-api.svg)](https://github.com/girishsawant999/react-translate-with-google-api/pulls)

[![Build ](https://img.shields.io/github/workflow/status/girishsawant999/react-translate-with-google-api/CI/main)](https://github.com/girishsawant999/react-translate-with-google-api/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> A simple react package develope to translate text using Google Translate API. You can use component or the simple hook.</p>
<br>

## 📝 Table of Contents

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Built Using](#built_using)
- [Contributing](./.github/CONTRIBUTING.md)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

Pass your string as a children to component and provide language to the component it will translate the string to the language you provided.

## Installation <a name = "installation"></a>

Let's start with the following steps.

- Now run the following code in project directory to install dependency.

  ```bash
    npm i @girishsawant999/react-translate-with-google-api
  ```

- Thats all you are ready to use translate component.

## Usage <a name = "usage"></a>

Generate your credentials and project id in Google Cloud Platform. Read through the [documentation](https://cloud.google.com/iam/docs/creating-managing-service-accounts) for setting a service account.

After you acquired your credentials and project id, add it to your environment variables and add following code in **index.js** file.

```jsx
import { setupConfig } from '@girishsawant999/react-translate-with-google-api';

setupConfig({
  clientEmail: process.env.REACT_APP_GCP_CLIENT_SERVICE_ACC_EMAIL,
  privateKey: process.env.REACT_APP_GCP_PRIVATE_KEY,
  projectId: process.env.REACT_APP_GCP_PROJECT_ID
});
```

Now use Translate component

```jsx
import Translate from '@girishsawant999/react-translate-with-google-api';

<Translate language="fr" className="font-bold" style={{ color: 'red' }}>
  Hello World
</Translate>;
```

You will see output as "Bonjour le monde".

| Props                 | Description                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| language              | Type: **String** <br>Language code [check here](https://cloud.google.com/translate/docs/languages) eg. `fr \| mr \| hi \| en-US` |
| skip (optional)       | Type: **Boolean** <br>Skip translation API call.                                                                                 |
| useStorage (optional) | Type: **Boolean** <br>Use local storage to store translation.                                                                    |

Also You can use the useTranslate hook to translate the string.

```jsx
import { useTranslate } from '@girishsawant999/react-translate-with-google-api';

const language = 'fr';
const options = {
  skip: false, // skip translation API call
  useStorage: true // use local storage to store the translation
};

const { translatedData, loading } = useTranslate(
  language,
  {
    emailAddress: 'email address',
    firstName: 'first name',
    lastName: 'last name'
  },
  options
);

return (
  <div>
    {loading ? <div>Loading...</div> : null}
    <div>
      <label>
        <Translate language="fr" className="font-bold" style={{ color: 'red' }}>
          Email Address
        </Translate>
        <input type="text" placeholder={translatedData.emailAddress} />
      </label>
    </div>
  </div>
);
```

You will get the translated data and loading status.

## ⛏️ Built Using <a name = "built_using"></a>

- [React](https://reactjs.org)
- [Parcel](https://parceljs.org)
- [Typescript](https://www.typescriptlang.org)
- [Javascript](https://developer.mozilla.org/en-US/)
- [Jest](https://jestjs.io)

## ✍️ Authors <a name = "authors"></a>

- [@girishsawant999](https://girishsawant999.github.io) - Idea & Initial work

See also the list of [contributors](https://github.com/girishsawant999/react-translate-with-google-api/contributors) who participated in this project.
