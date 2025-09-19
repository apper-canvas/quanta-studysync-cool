import React from "react";
import { cn } from "@/utils/cn";

const Card = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md border border-slate-200/50 transition-all duration-200",
        hover && "hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("px-6 py-4 border-b border-slate-200/50", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("px-6 py-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("px-6 py-4 border-t border-slate-200/50", className)}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;