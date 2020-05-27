import React from 'react';

import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import CurrencyExchange from './CurrencyExchange';
import './App.css';

function App(): React.ReactElement {
  return (
    <React.Fragment>

      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' >Currency Exchange</Typography>
        </Toolbar>
      </AppBar>

     <Container component='main' maxWidth='md'>

       <Typography variant='body1' color='textSecondary' component='p'>
         Currency Exchange component made with React, Redux and Material UI.
       </Typography>

       <CurrencyExchange />

     </Container>

    </React.Fragment>
  );
}

export default App;
