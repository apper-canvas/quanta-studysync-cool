import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "FileText" },
    { name: "Grades", href: "/grades", icon: "Award" },
    { name: "Schedule", href: "/schedule", icon: "Calendar" }
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.href}
      onClick={() => onClose && onClose()}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
            : "text-slate-700 hover:bg-slate-100 hover:text-primary"
        }`
      }
    >
      <ApperIcon name={item.icon} size={20} className="mr-3" />
      {item.name}
    </NavLink>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50">
      <div className="flex flex-col flex-1 bg-white border-r border-slate-200 shadow-sm">
        <div className="flex items-center px-6 py-8 border-b border-slate-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" size={20} className="text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                StudySync
              </h1>
              <p className="text-xs text-slate-500">Student Management</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 lg:hidden"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-8 border-b border-slate-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={20} className="text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  StudySync
                </h1>
                <p className="text-xs text-slate-500">Student Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;