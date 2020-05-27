import reducer from 'features/wallet/walletSlice';
import * as walletSlice from 'features/wallet/walletSlice';
import { RootState }  from 'app/rootReducer';

describe('wallet', () => {
  const state = {
    BCH: 100,
    ETC: 100.2
  };

  describe('reducer', () => {

    it('should be defined', () => {
      expect(reducer).toBeDefined();
    });

    it('should accept store action', () => {
      expect(reducer(state, {type: '*'})).toBe(state);
    });

    it('should perform confirmed transaction', () => {
      const action = {
        type: 'transaction/send/fulfilled',
        payload: {
          confirmed: true,
          tx: {from: 'ETC', get: .1, to: 'BCH', put: .01 }
        }
      };
      const newState = reducer(state, action);
      expect(newState.BCH).toEqual(100.01);
      expect(newState.ETC).toEqual(100.1);
    });

    it('should ignore unconfirmed transaction', () => {
      const action = {
        type: 'transaction/send/fulfilled',
        payload: {
          confirmed: false,
          tx: {from: 'ETC', get: 1000, to: 'BCH', put: -100 }
        }
      };
      const newState = reducer(state, action);
      expect(newState.BCH).toEqual(state.BCH);
      expect(newState.ETC).toEqual(state.ETC);
    });
  });

  describe('selectors', () => {
   it('slice should export selectBalances selector', () => {
     expect(walletSlice.selectBalances).toBeDefined();
   });

   it('selector selectBalances should return', () => {
     expect(walletSlice.selectBalances({wallet: state} as any))
       .toEqual(state);
   });

   it('slice should export selectBalancesAsArray selector', () => {
     expect(walletSlice.selectBalancesAsArray).toBeDefined();
   });

   it('selector selectBalancesAsArray should return', () => {
     expect(walletSlice.selectBalancesAsArray({wallet: state} as any))
       .toEqual([
         {'amount': 100, 'code': 'BCH'},
         {'amount': 100.2, 'code': 'ETC'}
       ]);
   });
 });
});
