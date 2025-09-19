import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Modal = ({ isOpen, onClose, children, title, size = "md", className }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "bg-white rounded-lg shadow-xl border border-slate-200 w-full",
                sizes[size],
                className
              )}
            >
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="p-2"
                  >
                    <ApperIcon name="X" size={18} />
                  </Button>
                </div>
              )}
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const ModalContent = ({ children, className, ...props }) => {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
};

const ModalFooter = ({ children, className, ...props }) => {
  return (
    <div className={cn("px-6 py-4 border-t border-slate-200 flex justify-end gap-2", className)} {...props}>
      {children}
    </div>
  );
};

Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;