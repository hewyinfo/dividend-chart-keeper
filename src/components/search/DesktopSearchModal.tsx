
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SearchModalContent, { SearchModalContentProps } from "./SearchModalContent";

interface DesktopSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentProps: SearchModalContentProps;
}

const DesktopSearchModal = ({ isOpen, onClose, contentProps }: DesktopSearchModalProps) => (
  <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>Search for Dividend Stock</DialogTitle>
      </DialogHeader>
      <SearchModalContent {...contentProps} />
    </DialogContent>
  </Dialog>
);

export default DesktopSearchModal;
