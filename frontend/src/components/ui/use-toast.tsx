"use client"

import * as React from "react"
import { Toast, ToastProps } from "@/components/ui/toast"

type ToastActionElement = React.ReactElement

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  function toast(props: ToastProps) {
    setToasts((prevToasts) => [...prevToasts, { ...props, id: Math.random().toString() }])
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast !== props))
    }, 5000)

    return {
      id: Math.random().toString(),
      dismiss: () => setToasts((prevToasts) => prevToasts.filter((toast) => toast !== props)),
      update: (newProps: ToastProps) => {
        setToasts((prevToasts) => 
          prevToasts.map((toast) => toast === props ? { ...toast, ...newProps } : toast)
        )
      }
    }
  }

  return {
    toast,
    toasts,
    dismiss: (toastId?: string) => {
      setToasts((prevToasts) => 
        prevToasts.filter((toast) => toast.id !== toastId)
      )
    },
  }
}

export { type ToastActionElement }

export const toast = (props: ToastProps) => {
  // This is just a stub for direct imports
  // The actual implementation is in the hook above
  console.warn('Using toast() directly is not recommended. Use useToast() hook instead.')
  
  return {
    id: Math.random().toString(),
    dismiss: () => {},
    update: (props: ToastProps) => {}
  }
}
