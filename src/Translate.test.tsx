import React from 'react';
import ReactDOM from 'react-dom';
import Translate, { setupConfig } from './index';

describe('Translate: Component Basis tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    setupConfig({
      clientEmail: 'test@test.com',
      projectId: 'test',
      privateKey: 'KEY'
    });

    ReactDOM.render(<Translate language="en-US">Hello</Translate>, div);
    expect(div).toBeTruthy();
    ReactDOM.unmountComponentAtNode(div);
  });
});
