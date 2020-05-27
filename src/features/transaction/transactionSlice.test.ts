import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import reducer from 'features/transaction/transactionSlice';
import * as transactionSlice from 'features/transaction/transactionSlice';
import { RootState } from 'app/rootReducer';
import { confirmTransaction } from 'api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const txStatus = [
  'IDLE', 'PENDING', 'CONFIRMED', 'REJECTED'
] as transactionSlice.TxStatus[];

jest.mock('api');

describe('transaction', () => {
  const tx = {from: 'BTC', to: 'ETC', get: 0.01, put: 2};
  const state = { status: txStatus[0] };
  const statePending = { status: txStatus[1], tx };
  const stateConfirmed = { status: txStatus[2], tx };
  const stateRejected = { status: txStatus[3], tx, rejectinReason: 'the test' };
  const actionPending = { type: 'transaction/send/pending', meta: {arg: tx} };
  const actionFulfilled = { type: 'transaction/send/fulfilled', payload: { confirmed: true }, meta: {arg: tx} };
  const actionRejected = { type: 'transaction/send/rejected' };


  it('should be defined', () => {
    expect(reducer).toBeDefined();
  });

  it('should accept store action', () => {
    expect(reducer(state, {type: '*'})).toBe(state);
  });

  it('should change state from idle to pending', () => {
    expect(reducer(state, actionPending)).toEqual(statePending);
  });

  it('should change state from confirmed to pending', () => {
      expect(reducer(stateConfirmed, actionPending)).toEqual(statePending);
  });

  it('should NOT change state from rejected to pending', () => {
      expect(reducer(stateRejected, actionPending)).not.toEqual(statePending);
  });

  it('should change state from pending to confirmed', () => {
    expect(reducer(statePending, actionFulfilled)).toEqual(stateConfirmed);
  });

  it('should NOT change state from idle to confirmed', () => {
    expect(reducer(state, actionFulfilled)).not.toEqual(stateConfirmed);
  });

  it('should NOT change state from rejected to confirmed', () => {
    expect(reducer(stateRejected, actionFulfilled)).not.toEqual(stateConfirmed);
  });

  it('should change state from pending to rejected', () => {
    const action = {
      type: 'transaction/send/fulfilled',
      payload: {confirmed: false, reason: 'the test'},
      meta: {arg: tx}
    };
    expect(reducer(statePending, action)).toEqual(stateRejected);
  });

  it('should change state from pending to rejected when promise rejects', () => {
    expect(reducer(statePending, actionRejected)).toEqual({ status: txStatus[3], tx});
  });

  it('should NOT change state from idle to rejected when promise rejects', () => {
    expect(reducer(state, actionRejected)).toEqual(state);
  });

  it('should NOT change state from confirmed to rejected when promise rejects', () => {
    expect(reducer(stateConfirmed, actionRejected)).toEqual(stateConfirmed);
  });

  it('should change state from * to idle', () => {
    const action = transactionSlice.idle();
    expect(reducer(stateConfirmed, action)).toEqual(state);
    expect(reducer(stateRejected, action)).toEqual(state);
    expect(reducer(statePending, action)).toEqual(state);
  });

  describe('actions', () => {
    it('idle action should be defined', () => {
      expect(transactionSlice.idle).toBeDefined();
    });

    it('tx thunk action should be defined', () => {
      expect(transactionSlice.tx).toBeDefined();
      expect(transactionSlice.tx.pending).toBeDefined();
      expect(transactionSlice.tx.fulfilled).toBeDefined();
      expect(transactionSlice.tx.rejected).toBeDefined();
    });

    it('tx thunk should return promese', () => {
      const store = mockStore({ transaction: state });
      const actionCreator = transactionSlice.tx(tx);
      return store.dispatch(actionCreator as any).then((_: any) => {
        expect(_.type).toBe('transaction/send/fulfilled');
        expect(_.meta.arg).toEqual(tx);
      });
    });
  });

  describe('selectors', () => {
    it('selectTxReady should be defined', () => {
      expect(transactionSlice.selectTxReady).toBeDefined();
    });

    it('selectTxReady should return true on idle or confirmed', () => {
      const { selectTxReady } = transactionSlice;
      const results = txStatus
        .map(_ => selectTxReady({transaction: { status: _}} as RootState));
      expect(results).toEqual([
        true,  // IDLE
        false, // PENDING
        true,  // CONFIRMED
        false  // REJECTED
      ]);
    });

    it('selectRejectinReason should be defined', () => {
      expect(transactionSlice.selectRejectinReason).toBeDefined();
    });

    it('selectRejectinReason should be defined', () => {
      const { selectRejectinReason } = transactionSlice;
      expect(
        selectRejectinReason({transaction: state} as RootState)
      ).toBeUndefined();
      expect(
        selectRejectinReason({
          transaction: { status: txStatus[3], rejectinReason: 'test' }
        } as RootState)
      ).toBe('test');
    });
  });
});
