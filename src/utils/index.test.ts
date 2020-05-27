 import {
  parseAmount,
  currencyAdd,
  currencySubtract,
  currencyMultiply,
  currencyDivide
} from 'utils';

describe('parseAmount', () => {
  it('should parse empty string as 0', () => {
    expect(parseAmount('')).toBe(0);
  });
  it('should parse number without decimal part', () => {
    expect(parseAmount('1')).toBe(1);
    expect(parseAmount('9001')).toBe(9001);
  });
  it('should parse number with dot', () => {
    expect(parseAmount('1.')).toBe(1);
    expect(parseAmount('9999.')).toBe(9999);
    expect(parseAmount('000000000.')).toBe(.0);
  });
  it('should parse number with decimal part (1 or 2 digits)', () => {
    expect(parseAmount('1.3')).toBe(1.3);
    expect(parseAmount('9999.99')).toBe(9999.99);
    expect(parseAmount('000000000.01')).toBe(.01);
  });
  it('should not parse number other', () => {
    expect(parseAmount('-1')).toBe(null);
    expect(parseAmount('9.999')).toBe(null);
    expect(parseAmount('000.0.')).toBe(null);
    expect(parseAmount('0.1e2')).toBe(null);
    expect(parseAmount('ten')).toBe(null);
    expect(parseAmount('null')).toBe(null);
  });
});

describe('currencyAdd', () => {
  it('should add decimals witout rounding issues', () => {
    expect(currencyAdd(0.2, 0.1)).toBe(0.3);
    expect(currencyAdd(90001.1, 0.3)).toBe(90001.40);
  });
  it('should add huge numbers', () => {
    expect(
      currencyAdd(90071992547409.99, 0.01)
    ).toBe(90071992547410) ;
    expect(
      currencyAdd(900719925474099.9, .11)
    ).toBe(900719925474100.01);
  });
});

describe('currencySubtract', () => {
  it('should subtract decimals witout rounding issues', () => {
    expect(currencySubtract(1.2, 0.1)).toBe(1.1);
    expect(currencySubtract(0.3, 0.2)).toBe(.1);
    expect(currencySubtract(0.3, 0.29)).toBe(.01);
    expect(currencySubtract(0.3, 0.291)).toBe(0);
    expect(currencySubtract(1.99, 0.9)).toBe(1.09);
    expect(currencySubtract(1.99, 1.9)).toBe(.09);
    expect(currencySubtract(1.99, 2)).toBe(-0.01);
    expect(currencySubtract(2000, 16.35)).toBe(1983.65);
  });
});

describe('currencyMultiply', () => {
  it('should multiply decimals witout rounding issues', () => {
    expect(currencyMultiply(8.3, 0.13)).toBe(1.07);
  });
  it('should round results to 2 digits after dot', () => {
    expect(currencyMultiply(0.11, 0.09)).toBe(0);
  });
});

describe('currencyDivide', () => {
  it('should divide decimals up to 2 digits after dot, rounding up', () => {
    expect(currencyDivide(0.1, 3)).toBe(0.04);
  });
  it('should divide integers', () => {
    expect(currencyDivide(1000, 3)).toBe(333.34);
  });
  it('should round result up', () => {
    expect(currencyDivide(0.05, 1.1171312071)).toBe(.05);
  });
});
