import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export function DialogBox({
  open,
  onOpenChange,
  children,
  title,
  description,
  size = "md", // sm, md, lg, xl
  footer,
  hideClose = false,
  className,
  closeIcon,
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in 
                     data-[state=closed]:animate-out data-[state=closed]:fade-out-0 
                     data-[state=open]:fade-in-0"
        />

        <DialogPrimitive.Content
          className={cn(
            `fixed left-1/2 top-1/2 z-50 w-full translate-x-[-50%] 
             translate-y-[-50%] border bg-white p-6 shadow-lg duration-200 sm:rounded-lg
             data-[state=open]:animate-in data-[state=closed]:animate-out
             data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
             data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95`,
            sizeClasses[size],
            className
          )}
        >
          {(title || description) && (
            <div className="mb-4">
              {title && (
                <DialogPrimitive.Title className="text-lg font-semibold text-center text-primary">
                  {title}
                </DialogPrimitive.Title>
              )}
              {description && (
                <DialogPrimitive.Description className="text-sm text-gray-500">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
          )}

          <div className="mb-4">{children}</div>

          {footer && <div className="flex justify-end gap-2">{footer}</div>}

          {!hideClose && (
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {closeIcon}
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ✅ Export other Radix Dialog parts for flexibility
export const DialogContent = DialogPrimitive.Content;
export const DialogHeader = DialogPrimitive.Title;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export const DialogFooter = ({ children }) => (
  <div className="flex justify-end gap-2">{children}</div>
);
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const closeIcon = <span className="rounded-full bg-slate-200 p-2 block"><X className="h-4 w-4" /></span>
