import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick, title, subtitle, rightContent }) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            )}
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {rightContent && (
          <div className="flex items-center gap-2">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;