import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, trend, trendDirection, color = "primary", className }) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    error: "text-error bg-error/10",
    info: "text-info bg-info/10"
  };

  return (
    <Card hover className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trendDirection === "up" ? "text-success" : 
              trendDirection === "down" ? "text-error" : 
              "text-slate-600"
            }`}>
              {trendDirection === "up" && <ApperIcon name="TrendingUp" size={16} className="mr-1" />}
              {trendDirection === "down" && <ApperIcon name="TrendingDown" size={16} className="mr-1" />}
              {trend}
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <ApperIcon name={icon} size={24} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;