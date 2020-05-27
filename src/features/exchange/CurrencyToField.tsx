import React from 'react';

import CommonCurrencyField from './CommonCurrencyField';

import {
  setTo,
  setAmountTo,
  selectToAmount,
  selectToCurrency,
  selectToIsError
} from 'features/exchange/exchangeSlice';

export default function CurrencyToField() {
  return (
    <CommonCurrencyField
      id='receive'
      label='You receive'
      setAmount={setAmountTo}
      setCurrency={setTo}
      selectError={selectToIsError}
      selectCurrency={selectToCurrency}
      selectAmount={selectToAmount}
      />
  );
}
