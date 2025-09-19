import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-error/10 to-error/5 p-6 rounded-full mb-6">
        <ApperIcon name="AlertCircle" size={48} className="text-error" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-slate-600 text-center mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2">
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;