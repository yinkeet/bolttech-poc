import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export interface ConfirmationDialogProps {
  title: string;
  message: string;
  open?: boolean;
  onOpenChange?: (status: boolean) => void;
  onAction?: (confirm: boolean) => void;
}

export function ConfirmationDialog({ title, message, open, onOpenChange, onAction }: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            <pre className="whitespace-pre-wrap">{message}</pre>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            if (onAction) onAction(false)
          }}>Close</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            if (onAction) onAction(true)
          }}>Ok</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}