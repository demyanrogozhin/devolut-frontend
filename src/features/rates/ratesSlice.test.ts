import reducer from 'features/rates/ratesSlice';
import { exchangeRatesAPI } from 'api';
import * as ratesSlice from 'features/rates/ratesSlice';
import { RootState } from 'app/rootReducer';

jest.mock('api');

describe('rates', () => {
  const state = { rates: { 'BCHETC': 0.314 }, currencies: [
    {  code: 'BCH', symbol: 'BCH',  name: 'Bitcoin Cash' }
  ]};
  const actionUpdate = {
    type: 'rates/update', payload: { 'ETCBCH': 3.184 }
  };
  const actionUpdateRewrite = {
    type: 'rates/update', payload: { 'BCHETC': 0.5, 'ETCBCH': 2 }
  };

  it('should be defined', () => {
    expect(reducer).toBeDefined();
  });

  it('should accept store action', () => {
    expect(reducer(state, {type: '*'})).toBe(state);
  });

  it('should update rates', () => {
    const newState = reducer(state, actionUpdate);
    expect(newState.rates).toEqual({...state.rates, ...actionUpdate.payload});
  });

  it('should update rewrite rates', () => {
    const newState = reducer(state, actionUpdateRewrite);
    expect(newState.rates['BCHETC']).toEqual(.5);
    expect(newState.rates['ETCBCH']).toEqual(2);
  });

  describe('actions', () => {
    it('should export refreshRates', () => {
      expect(ratesSlice.refreshRates).toBeDefined();
    });

    it('refreshRates should return promise', () => {
      const { refreshRates, update } = ratesSlice;
      const mockDispatch = jest.fn();
      const base = 'BCH';
      const symbols = [ 'ETC' ];
      const response = refreshRates(mockDispatch, base, symbols);
      response.then( () => {
        expect(mockDispatch).toBeCalledWith({
          type: 'rates/update',
          payload: undefined
        });
      });
    });
  });

  describe('selectors', () => {
    it('selectRates should be defined', () => {
      expect(ratesSlice.selectRates).toBeDefined();
    });

    it('selectRates should return rates', () => {
      expect(ratesSlice.selectRates({
        rates: state
      } as any)).toBe(state.rates);
    });
    it('selectCurrencies should be defined', () => {
      expect(ratesSlice.selectCurrencies).toBeDefined();
    });

    it('selectCurrencies should return currencies', () => {
      expect(ratesSlice.selectCurrencies({
        rates: state
      } as any)).toBe(state.currencies);
    });
  });
});
