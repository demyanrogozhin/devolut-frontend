import { createSlice, createSelector } from '@reduxjs/toolkit';

import { RootState } from 'app/rootReducer';
import { tx } from 'features/transaction/transactionSlice';
import { currencySubtract, currencyAdd } from 'utils';

type Wallet = {
  code: string,
  amount: number
}

interface WalletState {
  [code: string]: number
}

const initialState: WalletState = {
  USD: 1000,
  EUR: 1000,
  GBP: 9001
};

const wallets = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder.addCase(tx.fulfilled, (state: WalletState, action) => {
      const { payload } = action;
      if( payload.confirmed ) {
        const { from, to, get, put } = action.payload.tx;
        const fromAmount = currencySubtract( state[from], get );
        const toAmount = currencyAdd( state[to], put );
        state[from] = fromAmount;
        state[to] = toAmount;
      }
    });
  }
});

export default wallets.reducer;

export const selectBalances = (state: RootState): WalletState =>
  state.wallet;

export const selectBalancesAsArray = createSelector(
  selectBalances,
  balances => Object.keys(balances)
    .reduce((acc: Wallet[], code: string) => {
      acc.push({
        code,
        amount: balances[code]
      } as Wallet);
      return acc;
    }, [] as Wallet[])
  );
