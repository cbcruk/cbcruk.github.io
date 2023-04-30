import { toast } from 'react-hot-toast'

export function toastError(message?: string) {
  toast.error(message || '에러가 발생했습니다.')
}
