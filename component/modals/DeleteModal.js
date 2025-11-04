import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

function DeleteModal({
  open,
  title = 'حذف',
  bodyText = 'اگر از اجرای عملیات حذف مطمین هستید، بر روی دکمه حذف کلیک کنید.',
  onClose,
  onDelete,
  loading,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>{bodyText}</DialogContent>

      <DialogActions>
        <div className='flex w-full gap-8 justify-end'>
          <Button onClick={onClose}>انصراف</Button>
          <LoadingButton
            loading={loading}
            onClick={() => {
              onDelete()
              onClose()
            }}
          >
            حذف
          </LoadingButton>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteModal
