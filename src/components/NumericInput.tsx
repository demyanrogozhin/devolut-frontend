import React from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export interface NumericInputProps {
  id: string,
  value: string,
  currency: string,
  onCurrencyClick?: React.MouseEventHandler,
  onFocus?: React.FocusEventHandler,
  onBlur?: React.FocusEventHandler,
  onChange?: ( _: string ) => void,
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  input: {
    paddingRight: '2px',
    textAlign: 'right'
  }
}));

const keysRegex = /[.0-9]/;

export function NumericInput (props: NumericInputProps) {
  const {id, value, currency, onCurrencyClick, onBlur, onChange} = props;
  const classes = useStyles();
  const currencyButton = props.currency
    ? <InputAdornment position='start' >
        <Button onClick={onCurrencyClick}>{currency}</Button>
      </InputAdornment>
    : null;

  const handleKeyPress:React.KeyboardEventHandler = e => {
    if (!e.key.match(keysRegex)) {
      e.preventDefault();
    }
  };

  const handleChange:React.ChangeEventHandler<HTMLInputElement> = (e)=>{
    const inputString = e.target.value;
    onChange && onChange(inputString);
  };

  return(
    <Input
      id={id}
      classes={{input: classes.input}}
      startAdornment={currencyButton}
      value={value}
      onBlur={onBlur}
      onChange={handleChange}
      onKeyPress={handleKeyPress} />
  );
}
