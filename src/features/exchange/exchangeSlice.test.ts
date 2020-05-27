import reducer from 'features/exchange/exchangeSlice';
import * as exchangeSlice from 'features/exchange/exchangeSlice';

describe('exchange', () => {
  const state = {
    from: 'BCH',
    to: 'ETC',
    amountFrom: '',
    amountTo: '',
    rate: 0.5,
    formatError: null,
    reverse: false,
    amountSend: 0,
    amountReceive: 0
  };

  const formatError = 'format error';

  describe('reducer', () => {
    it('should be defined', () => {
      expect(reducer).toBeDefined();
    });

    it('should accept store action', () => {
      expect(reducer(state, {type: '*'})).toBe(state);
    });

    it('format should normalize number', () => {
      const action = exchangeSlice.format();

      expect(reducer({
        ...state, amountFrom: '1', amountSend: 1, formatError
      } as any, action).amountFrom).toBe('1');

      expect(reducer({
        ...state, amountFrom: '1', amountSend: 1
      } as any, action).amountFrom).toBe('1.00');

      expect(reducer(state as any, action).amountFrom).toBe('');

      expect(reducer(state as any, action).amountTo).toBe('');

      expect(reducer({
        ...state, amountTo: '.99', amountReceive: 0.99, reverse: true
      } as any, action).amountTo).toBe('0.99');

      expect(reducer({
        ...state, amountTo: '', amountReceive: 0, reverse: true
      } as any, action).amountTo).toBe('');
    });

    it('setFrom should update from currency', () => {
      const action = exchangeSlice.setFrom('ABC');
      const newState = reducer(state, action);
      expect(newState.from).toBe('ABC');
      expect(newState.to).toBe('ETC');
    });

    it('setFrom should update from currency and swap', () => {
      const action = exchangeSlice.setFrom('ETC');
      const newState = reducer(state, action);
      expect(newState.from).toBe('ETC');
      expect(newState.to).toBe('BCH');
    });

    it('setTo should update from currency', () => {
      const action = exchangeSlice.setTo('ABC');
      const newState = reducer(state, action);
      expect(newState.to).toBe('ABC');
      expect(newState.from).toBe('BCH');
    });

    it('setTo should update from currency and swap', () => {
      const action = exchangeSlice.setTo('BCH');
      const newState = reducer(state, action);
      expect(newState.to).toBe('BCH');
      expect(newState.from).toBe('ETC');
    });

    it('setAmountFrom should update from-field text', () => {
      const action = exchangeSlice.setAmountFrom('1.2');
      const newState = reducer(state, action);
      const { amountFrom, reverse, formatError, amountSend, amountTo } = newState;
      expect([amountFrom, reverse, formatError, amountSend, amountTo ])
        .toEqual([ '1.2', false, null, 1.2, '0.60' ]);
    });

    it('setAmountFrom should not update if wrong format', () => {
      const action = exchangeSlice.setAmountFrom('1..2');
      const newState = reducer(state, action);
      const { amountFrom, reverse, formatError, amountSend, amountTo } = newState;
      expect([amountFrom, reverse, formatError, amountSend, amountTo ])
        .toEqual([ '1..2', false, 'format error', 0, '' ]);
    });

    it('setAmountTo should update to-field text', () => {
      const action = exchangeSlice.setAmountTo('.5');
      const newState = reducer(state, action);
      const { amountFrom, reverse, formatError, amountReceive, amountTo } = newState;
      expect([amountFrom, reverse, formatError, amountReceive, amountTo ])
        .toEqual([ '1.00', true, null, 0.5, '.5' ]);
    });

    it('setAmountTo should not update if wrong format', () => {
      const action = exchangeSlice.setAmountTo('.1.');
      const newState = reducer(state, action);
      const { amountFrom, reverse, formatError, amountReceive, amountTo } = newState;
      expect([amountFrom, reverse, formatError, amountReceive, amountTo ])
        .toEqual([ '', true, 'format error', 0, '.1.' ]);
    });

    it('setAmountTo should update and if no rate clear from field', () => {
      const action = exchangeSlice.setAmountTo('.5');
      const newState = reducer({...state, rate: 0, amountFrom: '9'}, action);
      const { amountFrom, reverse, formatError, amountReceive, amountTo } = newState;
      expect([amountFrom, reverse, formatError, amountReceive, amountTo ])
        .toEqual([ '', true, null, 0.5, '.5' ]);
    });

    it('transaction/send/pending should reset fields', () => {
      const action = { type: 'transaction/send/pending' };
      const oldState = {
        from: 'ABC',
        to: 'XYZ',
        formatError,
        reverse: true,
        amountFrom: '123',
        amountTo: '321..'
      };
      const {from, to, reverse, amountFrom, amountTo} = reducer(oldState as any, action);
      expect([from, to, reverse, amountFrom, amountTo])
        .toEqual(['ABC', 'XYZ', false, '', '']);
    });

    it('rates/update should recalculate amountTo', () => {
      const action = {
        type: 'rates/update',
        payload: { 'BCHETC': .25 }
      };
      const newState = reducer({
        ...state, rate: 0, amountSend: 50, amountTo: ''
      }, action);
      expect(newState.rate).toBe(.25);
      expect(newState.amountTo).toBe('12.50');
    });
    it('rates/update should recalculate amountFrom if reverse', () => {
       const action = {
        type: 'rates/update',
        payload: { 'BCHETC': .25 }
      };
      const newState = reducer({
        ...state, reverse: true, amountReceive: 50, amountFrom: ''
      }, action);
      expect(newState.rate).toBe(.25);
      expect(newState.amountFrom).toBe('200.00');
      const branchState = reducer({
        ...state, reverse: true, amountReceive: 0, amountFrom: ''
      }, action);
      expect(branchState.amountFrom).toBe('');
    });
    it('rates/update more tests', () => {
       const testFn = (rate: number, amountSend: number) =>
        reducer({
          ...state,
          amountSend
        } as any, {
          type: 'rates/update',
          payload: { 'BCHETC': rate }
        });
      const testdata = [
        [0.2,  0.1,    '0.02'],
        [1.2, 12.99,  '15.58'],
        [50,   2,    '100.00'],
        [1,    0.3,    '0.30'],
      ];
      testdata
        .map( t => testFn(t[0] as number, t[1] as number) )
        .forEach((newState, idx) => {
          expect(newState.amountTo).toBe(testdata[idx][2]);
        });
    });

    it('rates/update should not recalculate amountTo/amountFrom if format error', () => {
      const action = { type: 'rates/update', payload: { 'BCHETC': 1 } };
      const newState = reducer({
        ...state, amountSend: 0, amountFrom: '.1.', formatError
      }, action);
      expect(newState.rate).toBe(1);
      expect(newState.amountTo).toBe('');
    });

    it('rates/update should reverse currency pair if possible', () => {
      const action = { type: 'rates/update', payload: { 'ETCBCH': 3 } };
      const newState = reducer(state, action);
      expect(newState.rate).toBe(1/3);
      expect(newState.amountTo).toBe('');
    });

    it('rates/update rate is 0', () => {
      const action = { type: 'rates/update', payload: { 'ETCBCH': 0 } };
      const newState = reducer(state, action);
      expect(newState.rate).toBe(.5);
      expect(newState.amountTo).toBe('');
    });

  });

  describe('selectors', () => {
    it('selectTransaction should be defined', () => {
      expect(exchangeSlice.selectTransaction).toBeDefined();
    });

    it('selectTransaction return tx', () => {
      const { selectTransaction } = exchangeSlice;
      expect(selectTransaction({
        exchange: { from: 'ETC', to: 'BCH', amountSend: 2, amountReceive: 1 }
      } as any)).toEqual({ from: 'ETC', to: 'BCH', get: 2, put: 1 });
    });

    it('selectFromIsError should be defined', () => {
      expect(exchangeSlice.selectFromIsError).toBeDefined();
    });

    it('selectFromIsError should return formating error text', () => {
      const { selectFromIsError } = exchangeSlice;
      expect(selectFromIsError({
        exchange: { formatError: 'format error' }
      } as any)).toEqual('format error');
    });

    it('selectFromIsError should return null', () => {
      const { selectFromIsError } = exchangeSlice;
      expect(selectFromIsError({
        exchange: { reverse: true, formatError: 'format error' }
      } as any)).toEqual(null);
      expect(selectFromIsError({
        exchange: { formatError: null }
      } as any)).toEqual(null);
    });

    it('selectReceiveAmount should be defined', () => {
      expect(exchangeSlice.selectReceiveAmount).toBeDefined();
    });

    it('selectReceiveAmount should return amount', () => {
      const { selectReceiveAmount } = exchangeSlice;
      expect( selectReceiveAmount({
        exchange: { amountReceive: 10.2 }
      } as any)).toEqual(10.2);
    });

    it('selectFromAmount should be defined', () => {
      expect(exchangeSlice.selectFromAmount).toBeDefined();
    });

    it('selectReceiveAmount should return amount', () => {
      const { selectReceiveAmount } = exchangeSlice;
      expect( selectReceiveAmount({
        exchange: { amountReceive: 2.01 }
      } as any)).toEqual(2.01);
    });

    it('selectFromAmount should be defined', () => {
      expect(exchangeSlice.selectFromAmount).toBeDefined();
    });

    it('selectFromAmount should return amount', () => {
      const { selectFromAmount } = exchangeSlice;
      expect( selectFromAmount({
        exchange: { amountFrom: '0.01' }
      } as any)).toEqual('0.01');
    });

    it('selectFromCurrency should be defined', () => {
      expect(exchangeSlice.selectFromCurrency).toBeDefined();
    });

    it('selectFromCurrency should return currency', () => {
      const { selectFromCurrency } = exchangeSlice;
      expect( selectFromCurrency({
        exchange: { from: 'BCH' }
      } as any)).toEqual('BCH');
    });

    it('fieldHasError should be defined', () => {
      expect(exchangeSlice.fieldHasError).toBeDefined();
    });

    it('fieldHasError should return error', () => {
      const { fieldHasError } = exchangeSlice;
      expect( fieldHasError({
        exchange: { formatError: 'error' }
      } as any)).toEqual('error');
    });

    it('selectToIsError should be defined', () => {
      expect(exchangeSlice.selectToIsError).toBeDefined();
    });

    it('selectToIsError should return error if reverse', () => {
      const { selectToIsError } = exchangeSlice;
      expect(selectToIsError({
        exchange: { formatError: 'error' }
      } as any)).toEqual(null);
      expect(selectToIsError({
        exchange: { reverse: true, formatError: null }
      } as any)).toEqual(null);
      expect(selectToIsError({
        exchange: { reverse: true, formatError: 'the test' }
      } as any)).toEqual('the test');
    });

    it('selectSendAmount should be defined', () => {
      expect(exchangeSlice.selectSendAmount).toBeDefined();
    });

    it('selectSendAmount should return amount', () => {
      const { selectSendAmount } = exchangeSlice;
      expect( selectSendAmount({
        exchange: { amountSend: 123 }
      } as any)).toEqual(123);
    });

    it('selectToAmount should be defined', () => {
      expect(exchangeSlice.selectToAmount).toBeDefined();
    });

    it('selectToAmount should return amount', () => {
      const { selectToAmount } = exchangeSlice;
      expect( selectToAmount({
        exchange: { amountTo: '123' }
      } as any)).toEqual('123');
    });

    it('selectToCurrency should be defined', () => {
      expect(exchangeSlice.selectToCurrency).toBeDefined();
    });

    it('selectToCurrency should return currency code', () => {
      const { selectToCurrency } = exchangeSlice;
      expect( selectToCurrency({
        exchange: { to: 'ETC' }
      } as any)).toEqual('ETC');
    });
  });
});
