import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function MuiAlertDialog({
  open,
  title = "Title Message", 
  description = "Dialog description", 
  btn1 = "Disagree", 
  btn2 = "Agree",
  btn1Func = undefined,
  btn2Func = undefined,
  }) {
  return (
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {btn1Func && <Button onClick={btn1Func}>{btn1}</Button>}
          {btn2Func && 
          <Button onClick={btn2Func} autoFocus>
              {btn2}
          </Button> }
        </DialogActions>
      </Dialog>
  );
}
