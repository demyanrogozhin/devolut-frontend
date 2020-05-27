import { Transaction, TxConfirmation } from 'features/transaction/transactionSlice';

const API_URL = 'https://api.exchangeratesapi.io/latest';

function prepareURL(url: string, params: Record<string, string>) {
  const urlParams = (new URLSearchParams(params)).toString();
  return `${url}?${urlParams}`;
}

export async function exchangeRatesAPI(base: string, symbols: string[]): Promise<Record<string, number>> {
  const response =
    await fetch(prepareURL(API_URL, {base, symbols: symbols.join() }))
      .then( resp => resp.json() );
  const {rates} = response;
  const codes = Object.keys(rates);
  const pairs = codes.reduce((acc, code) => {
    acc[base.concat(code)] = rates[code];
    return acc;
  }, {} as {[_: string]: number});
  return pairs;
}

/// TODO:
/// Should be replaced with real tx-confirming API
/// currenly simply return automatic confirmation in 1 sec
export async function confirmTransaction(tx: Transaction): Promise<TxConfirmation> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const confirmed = true;
  return await Promise.resolve({
    tx,
    confirmed
  });
}
