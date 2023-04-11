import { toast } from 'react-hot-toast'

export function toastError(message) {
  toast.error(message || '에러가 발생했습니다.')
}
