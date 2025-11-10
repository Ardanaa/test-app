import { reactive } from 'vue'

type ConfirmOptions = {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

type ConfirmState = {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  // resolve function for the pending promise
  _resolve: ((value: boolean) => void) | null
}

export const confirmState = reactive<ConfirmState>({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  _resolve: null,
})

export function useConfirm() {
  const open = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      confirmState.title = options.title ?? 'Are you sure?'
      confirmState.message = options.message
      confirmState.confirmText = options.confirmText ?? 'Confirm'
      confirmState.cancelText = options.cancelText ?? 'Cancel'
      confirmState._resolve = resolve
      confirmState.isOpen = true
    })
  }

  const resolve = (value: boolean) => {
    if (confirmState._resolve) confirmState._resolve(value)
    // reset state
    confirmState.isOpen = false
    confirmState._resolve = null
    confirmState.title = ''
    confirmState.message = ''
  }

  return { open, resolve }
}


