import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'app/rootReducer';
import { update as updateRates } from 'features/rates/ratesSlice';
import { tx } from 'features/transaction/transactionSlice';
import { parseAmount, currencyMultiply, currencyDivide } from 'utils';

interface ExchangeState {
  from: string,
  to: string,
  amountSend: number,
  amountReceive: number,
  rate: number,
  formatError: string | null,
  reverse: boolean,             // user type into receive field
  amountFrom: string,
  amountTo: string
}

const initialState: ExchangeState = {
  from: 'GBP',
  to: 'EUR',
  amountSend: 0,
  amountReceive: 0,
  rate: 0,
  formatError: null,
  reverse: false,
  amountFrom: '',
  amountTo: ''
};

const exchange = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    format(state: ExchangeState, action: PayloadAction) {
      if ( state.formatError ) {
        return;
      }
      if ( state.reverse ) {
        state.amountTo = state.amountTo.length
          ? state.amountReceive.toFixed(2)
          : state.amountTo;
      } else {
        state.amountFrom = state.amountFrom.length
          ? state.amountSend.toFixed(2)
          : state.amountFrom;
      }
    },

    setFrom(state: ExchangeState, action: PayloadAction<string>) {
      if ( state.to === action.payload ) {
        state.to = state.from;
      }
      state.from = action.payload;
    },

    setTo(state: ExchangeState, action: PayloadAction<string>) {
      if ( state.from === action.payload ) {
        state.from = state.to;
      }
      state.to = action.payload;
    },

    setAmountFrom(state: ExchangeState, action: PayloadAction<string>) {
      state.amountFrom = action.payload;
      state.reverse = false;
      const amountSend = parseAmount(state.amountFrom);
      if (amountSend == null) {
        state.formatError = 'format error';
        return;
      } else {
        state.formatError = null;
        state.amountSend = amountSend;
      }
      state.amountReceive = currencyMultiply(state.amountSend, state.rate);
      state.amountTo = state.amountReceive.toFixed(2);
    },

    setAmountTo(state: ExchangeState, action: PayloadAction<string>) {
      state.amountTo = action.payload;
      state.reverse = true;
      const amountTo = parseAmount(state.amountTo);
      if (amountTo == null) {
        state.formatError = 'format error';
        return;
      } else {
        state.formatError = null;
        state.amountReceive = amountTo;
      }
      if ( state.rate === 0 ) {
        state.amountSend = 0;
        state.amountFrom = '';
        return;
      }
      state.amountSend = currencyDivide(amountTo, state.rate);
      state.amountFrom = state.amountSend.toFixed(2);
    }
  },

  extraReducers: builder => {
    builder.addCase( tx.pending, (state: ExchangeState, action) => {
      /// reseting form as TX was send
      state.amountSend = initialState.amountSend;
      state.amountReceive = initialState.amountReceive;
      state.formatError = initialState.formatError;
      state.reverse = initialState.reverse;
      state.amountFrom = initialState.amountFrom;
      state.amountTo  = initialState.amountTo;
    });

    builder.addCase( updateRates, (state: ExchangeState, action) => {
      const { payload: rates } = action;

      let rate: number = rates[state.from.concat(state.to)];
      if ( !rate || rate === Infinity || rate === -Infinity ) {
        rate = 1 / rates[state.to.concat(state.from)];
      }

      // set rate if found
      if ( rate && !(rate === Infinity || rate === -Infinity) ) {
        state.rate = rate;
      } else {
        return;
      }

      // input has error - done
      if( state.formatError ) {
        return;
      }

      if ( state.reverse ) {
        // recalculate send ammount
        state.amountSend = state.amountReceive && currencyDivide(state.amountReceive, rate);
        state.amountFrom = (state.amountFrom.length !== 0 || state.amountSend)
          ? state.amountSend.toFixed(2)
          : '';
      } else {
        // recalculate receive amount
        state.amountReceive = currencyMultiply(state.amountSend, rate);
        state.amountTo = (state.amountTo.length !== 0 || state.amountReceive)
          ? state.amountReceive.toFixed(2)
          : '';
      }
    });
  }
});

export default exchange.reducer;

export const {
  format,
  setFrom,
  setAmountFrom,
  setTo,
  setAmountTo
} = exchange.actions;

export const selectToCurrency = (state: RootState) =>
  state.exchange.to;

export const selectToAmount = (state: RootState) =>
  state.exchange.amountTo;

export const selectSendAmount = (state: RootState) =>
  state.exchange.amountSend;

export const selectToIsError = (state: RootState) =>
  (state.exchange.reverse || null) && state.exchange.formatError;

export const fieldHasError = (state: RootState) =>
  state.exchange.formatError;

export const selectFromCurrency = (state: RootState) =>
  state.exchange.from;

export const selectFromAmount = (state: RootState) =>
  state.exchange.amountFrom;

export const selectReceiveAmount = (state: RootState) =>
  state.exchange.amountReceive;

export const selectFromIsError = (state: RootState) =>
  (!state.exchange.reverse || null) && state.exchange.formatError;

export const selectTransaction = (state: RootState) => ({
  from: state.exchange.from,
  to: state.exchange.to,
  get: state.exchange.amountSend,
  put: state.exchange.amountReceive
});
