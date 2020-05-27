import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import Chip from '@material-ui/core/Chip';

import { selectRates, refreshRates } from 'features/rates/ratesSlice';
import {
  selectFromCurrency,
  selectToCurrency
} from 'features/exchange/exchangeSlice';

const selectActualRate = createSelector(
  selectFromCurrency,
  selectToCurrency,
  selectRates,
  (from, to, rates) => rates[from.concat(to)]
);

export default function RatesWidget() {
  const dispatch = useDispatch();
  const fromCurrency = useSelector(selectFromCurrency);
  const toCurrency = useSelector(selectToCurrency);
  const rate = useSelector(selectActualRate);

  useEffect(() => {
    refreshRates(dispatch, fromCurrency, [toCurrency]);
    const id = setInterval(
      () => refreshRates(dispatch, fromCurrency, [toCurrency]),
      10000
    );
    return () => clearInterval(id);
  }, [dispatch, fromCurrency, toCurrency]);

  return (
    <Chip
      variant='outlined'
      color={ rate ? 'primary' : 'default' }
      label={ rate
        ? `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`
        : 'loading...'
      }
    />
  );
}
