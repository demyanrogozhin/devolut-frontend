import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'app/rootReducer';
import { confirmTransaction } from 'api';

export type TxStatus = 'IDLE' | 'PENDING' | 'CONFIRMED' | 'REJECTED';

export type Transaction = {
  from: string,
  to: string,
  get: number,
  put: number
}

export type TxConfirmation = {
  tx: Transaction,
  confirmed: boolean,
  reason?: string
}

export interface TransactionState {
  status: TxStatus,
  tx?: Transaction,
  rejectinReason?: string
}

const initialState: TransactionState = {
  status: 'IDLE'
};

export const tx = createAsyncThunk(
  'transaction/send',
  async (tx: Transaction, thunkAPI) =>
    await confirmTransaction(tx)
);

const transaction = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    idle(state: TransactionState, action: PayloadAction) {
      state.status = initialState.status;
      state.tx = undefined;
      state.rejectinReason = undefined;
    }
  },
  extraReducers: builder => {

    builder.addCase( tx.pending, (state, action) => {
      if (state.status === 'IDLE' || state.status === 'CONFIRMED') {
        state.tx = action.meta.arg;
        state.status = 'PENDING';
      }
    });

    builder.addCase(tx.fulfilled, (state, action) => {
      const { payload } = action;
      if (state.status === 'PENDING') {
        state.status = payload.confirmed ? 'CONFIRMED' : 'REJECTED';
        if( !payload.confirmed ) {
          state.rejectinReason = payload.reason;
        }
      }
    });

    builder.addCase(tx.rejected, (state, action) => {
      if (state.status === 'PENDING') {
        state.status = 'REJECTED';
      }
    });

  }
});

export default transaction.reducer;

export const { idle } = transaction.actions;

export const selectTxReady = (state: RootState) => (
  state.transaction.status === 'IDLE'
  || state.transaction.status === 'CONFIRMED'
);
export const selectRejectinReason = (state: RootState) =>
  state.transaction.rejectinReason;
