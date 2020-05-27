import React from 'react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';


import CurrencySelectInput from './CurrencySelectInput';

describe('<CurrencySelectInput />', () => {
  it('shold render input', () => {
    const { container, debug } = render(<CurrencySelectInput />);
    const input = container.querySelector('input');
    expect(input).toBeDefined();
  });
});
