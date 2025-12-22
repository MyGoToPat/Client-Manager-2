import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteDirectiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  directiveName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteDirectiveDialog({
  open,
  onOpenChange,
  directiveName,
  onConfirm,
  isLoading = false,
}: DeleteDirectiveDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle data-testid="text-delete-title">Delete Directive</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{directiveName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} data-testid="button-cancel-delete">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground"
            data-testid="button-confirm-delete"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
