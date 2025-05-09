// lib/toast.tsx
"use client"

import { toast } from "sonner"
import { CheckCircle, XCircle, Loader2, Info } from "lucide-react"
import { ReactNode } from "react"

type ToastType = "success" | "error" | "loading" | "info"

export function showToast({
  title,
  description,
  type = "info",
}: {
  title: string
  description?: string
  type?: ToastType
}) {
  const content: ReactNode = (
    <div className="flex items-start gap-3">
      {type === "success" && <CheckCircle className="mt-1 h-5 w-5 text-green-500" />}
      {type === "error" && <XCircle className="mt-1 h-5 w-5 text-red-500" />}
      {type === "loading" && <Loader2 className="mt-1 h-5 w-5 animate-spin text-blue-500" />}
      {type === "info" && <Info className="mt-1 h-5 w-5 text-gray-500" />}
      <div>
        <p className="font-semibold">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )

  const options = {
    duration: type === "loading" ? Infinity : 4000,
  }

  switch (type) {
    case "success":
      toast.success(content, options)
      break
    case "error":
      toast.error(content, options)
      break
    case "loading":
      toast.loading(content, options)
      break
    case "info":
    default:
      toast(content, options) // this is the base/default toast
  }
}
