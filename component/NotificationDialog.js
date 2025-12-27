import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from '@mui/material';

function NotificationDialog({
  open,
  title = 'پیام',
  message = '',
  severity = 'info',
  onClose,
  confirmText = 'تایید',
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Alert severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NotificationDialog;
