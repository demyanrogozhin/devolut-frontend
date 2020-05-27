import React from 'react';

import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import { NumericInput } from './NumericInput';
import { CurrenciesMenu, MenuItem } from './CurrenciesMenu';

interface CurrencySelectInputProps {
  id: string,
  error?: boolean,
  currency: string,
  amount?: string,
  label?: string,
  helper?: string, // rate or balance
  currencies?: MenuItem[]
  onChange: (amount: string) => void,
  onCurrencySet: (code: string) => void,
  onBlur: () => void
}

export default function CurrencySelectInput(props: CurrencySelectInputProps) {
  const {
    id,
    amount,
    helper,
    label,
    error,
    onBlur,
    onChange,
    onCurrencySet,
    currency,
    currencies
  } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (code: string) => {
    onCurrencySet(code);
    setAnchorEl(null);
  };

  const helperTextId = helper && `${id}-helper-text`;
  const inputLabelId = label && `${id}-label`;

  return (
    <Paper elevation={0} >

      <FormControl error={error}>
        <InputLabel id={helperTextId} htmlFor={id} shrink>{label}</InputLabel>

        <NumericInput
          id={id}
          value={amount || ''}
          currency={currency}
          onCurrencyClick={handleMenuOpen}
          onChange={onChange}
          onBlur={onBlur}
          />

        <React.Fragment>
          {
            helper
              ? <FormHelperText id={helperTextId}>{helper}</FormHelperText>
              : null
          }
        </React.Fragment>

        {(currencies && currencies.length)
          ? <CurrenciesMenu
              onClose={handleMenuClose}
              anchorEl={anchorEl}
              open={menuOpen}
              currencies={currencies}
              currency={currency}
              onClick={handleMenuItemClick}
            />
          : null
        }
      </FormControl>
    </Paper>
  );

}
