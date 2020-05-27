import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'app/rootReducer';
import { AppDispatch } from 'app/store';
import { exchangeRatesAPI } from 'api';

type Currency = {
  code: string,                 // ISO 4217 code
  symbol: string,               // Unicode symbol (if any)
  name: string                  // eg. US Dollar
}

type CurrencyPair = [
  string,                       // Two ISO 4217 codes
  number                        // exchange rate
];

type CurrencyPairs = {
  [fromto: string]: number
}

interface RatesState {
  currencies: Currency[],
  rates: CurrencyPairs
}

const initialState: RatesState = {
  currencies: [],
  rates: {}
};

const rates = createSlice({
  name: 'rates',
  initialState,
  reducers: {
    update(state:RatesState, action:PayloadAction<CurrencyPairs>) {
      state.rates = {...state.rates, ...action.payload};
    }
  }
});

export default rates.reducer;

export const {
  update
} = rates.actions;

export async function refreshRates(
  dispatch: AppDispatch,
  base: string,
  symbols: string[]
) {
  const pairs = await exchangeRatesAPI(base, symbols);
  dispatch(update(pairs));
}

export const selectRates = (state: RootState) =>
  state.rates.rates;

export const selectCurrencies = (state: RootState) =>
  state.rates.currencies;
