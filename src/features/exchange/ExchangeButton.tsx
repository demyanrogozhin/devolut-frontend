import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import Fab from '@material-ui/core/Fab';

import { selectBalances } from 'features/wallet/walletSlice';
import { tx, selectTxReady } from 'features/transaction/transactionSlice';
import {
  selectTransaction,
  selectReceiveAmount,
  selectFromCurrency,
  selectSendAmount,
  fieldHasError
} from 'features/exchange/exchangeSlice';

const selectAvailableBalance = createSelector(
  selectFromCurrency,
  selectSendAmount,
  selectBalances,
  (code, amount, wallet) => amount <= wallet[code] && amount > 0
);

const isValidTxSelector = createSelector(
  fieldHasError,
  selectTxReady,
  selectReceiveAmount,
  selectAvailableBalance,
  (error, txIdle, amount, hasFunds) => !error && txIdle && amount && hasFunds
);

export default function ExchangeButton() {
  const valid = useSelector(isValidTxSelector);
  const transaction = useSelector(selectTransaction);
  const dispatch = useDispatch();

  const handleSubmit = () => dispatch( tx( transaction ) );

  return (
    <Fab
      variant='extended'
      color='primary'
      disabled={!valid}
      onClick={ handleSubmit }>
      Exchange
    </Fab>
  );
}
