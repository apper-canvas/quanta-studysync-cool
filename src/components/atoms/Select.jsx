import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  label,
  options = [],
  className,
  error,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200",
          error && "border-error focus:ring-error focus:border-error",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;