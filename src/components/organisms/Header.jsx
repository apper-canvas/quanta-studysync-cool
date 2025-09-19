import React, { useContext } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";
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

<div className="flex items-center gap-2">
          {rightContent}
          <LogoutButton />
        </div>
      </div>
    </header>
);
};

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      className="ml-2"
    >
      <ApperIcon name="LogOut" size={16} className="mr-1" />
      Logout
    </Button>
  );
};

export default Header;