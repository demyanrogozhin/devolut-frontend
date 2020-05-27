import React from 'react';

import CommonCurrencyField from './CommonCurrencyField';

import {
  setFrom,
  setAmountFrom,
  selectFromAmount,
  selectFromIsError,
  selectFromCurrency
} from 'features/exchange/exchangeSlice';

export default function CurrencyFromField() {
  return (
    <CommonCurrencyField
      id='send'
      label='You send'
      setAmount={setAmountFrom}
      setCurrency={setFrom}
      selectError={selectFromIsError}
      selectCurrency={selectFromCurrency}
      selectAmount={selectFromAmount}
      />
  );
}
