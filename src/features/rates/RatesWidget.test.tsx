import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { mocked } from 'ts-jest/utils';

import RatesWidget from 'features/rates/RatesWidget';
import { RootState } from 'app/rootReducer';
import { exchangeRatesAPI } from 'api';

jest.mock('api');
jest.useFakeTimers();
const mockStore = configureMockStore([]);
const exchangeRatesMock = mocked(exchangeRatesAPI);

describe('<RatesWidget />', () => {
  const rates = { rates:{BCHETC:2}};
  const exchange = { from: 'BCH', to: 'ETC' };
  const exchangeReverse = { from: 'ETC', to: 'BCH' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shold render rate with 4 decimals', async () => {
    const state = { exchange, rates };
    const { findAllByText } = render(
      <Provider store={mockStore(state)}>
        <RatesWidget />
      </Provider>
    );
    const items = await findAllByText('1 BCH = 2.0000 ETC');
    expect(items).toHaveLength(1);
  });

  it('shold show loading if no rate for currency pair', async () => {
    const state = { exchange: exchangeReverse, rates };
    const { findAllByText } = render(
      <Provider store={mockStore(state)}>
        <RatesWidget />
      </Provider>
    );
    const items = await findAllByText(/loading/);
    expect(items).toHaveLength(1);
  });

  it('shold request new rate in each 10 sec', async () => {
    const state = { exchange, rates };
    const store = mockStore(state);

    const { container } = render(
      <Provider store={store}>
        <RatesWidget />
      </Provider>
    );
    expect( exchangeRatesMock.mock.calls ).toHaveLength(1);
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    expect( exchangeRatesMock.mock.calls ).toHaveLength(2);
  });
});
