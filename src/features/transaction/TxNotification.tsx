import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';

import { RootState } from 'app/rootReducer';
import { idle, selectRejectinReason } from 'features/transaction/transactionSlice';

export default function TxNotification() {
  const dispatch = useDispatch();
  const tx = useSelector((state: RootState) => state.transaction.tx);
  const confirmed = useSelector((state: RootState) =>
    state.transaction.status === 'CONFIRMED' );
  const rejected = useSelector((state: RootState) =>
    state.transaction.status === 'REJECTED' );
  const rejectedReason = useSelector(selectRejectinReason);
  const open = confirmed || !!rejected;
  const handleClose = () => dispatch(idle());
  return ( 
    (tx && confirmed) || rejected
     ? <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={handleClose}
        message={ (tx && confirmed)
          ? `You received ${tx.put.toFixed(2)} ${tx.to}`
          : (rejectedReason || 'Rejected: unknown reason') }
      />
      : null
  );
}
