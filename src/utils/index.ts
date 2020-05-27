const valRegex = /^([0-9])*(?:\.[0-9]{0,2})?$/;

export const parseAmount = (amount: string): number | null => {
  if(!amount.length){
    return 0;
  }
  const parsed = parseFloat(amount);
  if( isNaN(parsed) ){
    return null;
  }
  if( !amount.match(valRegex) ){
    return null;
  }
  return Math.round(parsed*100)/100;
};

/// Safe add numbers with 2 digits in decimal part:
/// work-around rounding error in floats
/// eg 1.001 + 2.002 = 3.00 (round to 2 digits after dot)
export const currencyAdd = (amount: number, delta: number): number => {
  return Math.floor(( amount * 100 ) + ( delta * 100 ) ) / 100;
};
/// Safe substract numbers with 2 digits in decimal part
export const currencySubtract = (amount: number, delta: number): number => {
  return ((((( amount * 1000 ) | 0 ) // take till 3 digit after dot, drop float
      - ( delta * 1000 | 0) )        // same for second argument and subtract
    / 10 ) | 0)                      // drop one insignificant digit, leave two
    / 100;                           // cents to fractional part
};


/// Safe multiply and divide numbers: work-around rounding error in floats
export const currencyMultiply = (amount: number, rate: number): number => {
  return Math.floor( amount * rate * 100 ) / 100;
};

export const currencyDivide = (amount: number, rate: number): number => {
  return Math.ceil( amount / rate * 100 ) / 100;
};
