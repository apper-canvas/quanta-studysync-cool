import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "Get started by adding your first item", 
  icon = "FileText",
  actionLabel = "Add Item",
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-full mb-6">
        <ApperIcon name={icon} size={48} className="text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-600 text-center mb-6 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;