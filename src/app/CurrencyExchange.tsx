import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import CurrencyFromField from 'features/exchange/CurrencyFromField';
import TxNotification from 'features/transaction/TxNotification';
import CurrencyToField from 'features/exchange/CurrencyToField';
import ExchangeButton from 'features/exchange/ExchangeButton';
import RatesWidget from 'features/rates/RatesWidget';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center'
  }
}));

export default function CurrencyExchange() {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Grid container spacing={2}>
        <Grid item xs={12}>

          <RatesWidget />

        </Grid>
        <Grid item xs={12} sm={6}>

          <CurrencyFromField />

        </Grid>
        <Grid item xs={12} sm={6}>

          <CurrencyToField />

        </Grid>
        <Grid item xs={12}>

          <ExchangeButton />

        </Grid>
      </Grid>

      <TxNotification />

    </Paper>
  );
}
