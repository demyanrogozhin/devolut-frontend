import { combineReducers } from '@reduxjs/toolkit';

import ratesReducer from 'features/rates/ratesSlice';
import walletReducer from 'features/wallet/walletSlice';
import exchangeReducer from 'features/exchange/exchangeSlice';
import transactionReducer from 'features/transaction/transactionSlice';

const rootReducer = combineReducers({
  rates: ratesReducer,
  wallet: walletReducer,
  exchange: exchangeReducer,
  transaction: transactionReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
