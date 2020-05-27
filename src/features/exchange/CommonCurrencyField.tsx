import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'app/rootReducer';
import CurrencySelectInput from 'components/CurrencySelectInput';
import {
  selectBalances,
  selectBalancesAsArray
} from 'features/wallet/walletSlice';

import {
  format,
  setFrom,
  fieldHasError,
  setAmountFrom,
  selectFromAmount,
  selectFromCurrency
} from 'features/exchange/exchangeSlice';

const selectCurrencies = createSelector(
  selectBalancesAsArray,
  balanes => balanes.map(it => ({
    label: it.amount.toFixed(2),
    value: it.code
  }))
);

const balanceSelector = (selectCurrency: (state: RootState) => string) =>
  createSelector(
    selectBalances,
    selectCurrency,
    (balances, code) => ''.concat(balances[code].toFixed(2), ' ', code)
  );

interface CommonCurrencyFieldProps {
  id: string,
  label: string,
  setAmount: typeof setAmountFrom,
  setCurrency: typeof setFrom,
  selectError: typeof fieldHasError,
  selectCurrency: typeof selectFromCurrency,
  selectAmount: typeof selectFromAmount
}

export default function CommonCurrencyField(props: CommonCurrencyFieldProps) {
  const {
    id,
    label,
    setAmount,
    setCurrency,
    selectError,
    selectCurrency,
    selectAmount } = props;
  const balance = useSelector(balanceSelector(selectCurrency));
  const currencies = useSelector(selectCurrencies);
  const currency = useSelector(selectCurrency);
  const amount = useSelector(selectAmount);
  const error = useSelector(selectError);
  const dispatch = useDispatch();

  return (
    <CurrencySelectInput
      error={!!error}
      id={id}
      label={label}
      currency={currency}
      currencies={currencies}
      amount={amount}
      onBlur={ () => dispatch(format()) }
      onChange={ _ => dispatch(setAmount(_)) }
      onCurrencySet={ _ => dispatch(setCurrency(_)) }
      helper={ error || 'You have ' + balance }
      />
  );
}
