import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", size = "sm", className, ...props }) => {
  const variants = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-md",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning border border-warning/20",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;