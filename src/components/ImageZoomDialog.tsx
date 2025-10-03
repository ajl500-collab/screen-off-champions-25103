import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageZoomDialogProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageZoomDialog = ({ imageUrl, isOpen, onClose }: ImageZoomDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <img
          src={imageUrl}
          alt="Zoomed image"
          className="w-full h-auto max-h-[90vh] object-contain"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageZoomDialog;
