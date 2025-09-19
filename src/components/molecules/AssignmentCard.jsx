import React from "react";
import { format, isAfter, differenceInDays } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const AssignmentCard = ({ assignment, course, onToggleComplete, onEdit, onDelete }) => {
  const dueDate = new Date(assignment.dueDate);
  const now = new Date();
  const isOverdue = isAfter(now, dueDate) && !assignment.completed;
  const daysUntilDue = differenceInDays(dueDate, now);
  
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const getDueDateInfo = () => {
    if (assignment.completed) return null;
    
    if (isOverdue) {
      return { text: "Overdue", color: "error" };
    } else if (daysUntilDue === 0) {
      return { text: "Due Today", color: "warning" };
    } else if (daysUntilDue === 1) {
      return { text: "Due Tomorrow", color: "warning" };
    } else if (daysUntilDue <= 3) {
      return { text: `${daysUntilDue} days left`, color: "warning" };
    }
    
    return null;
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <Card hover className={`${assignment.completed ? "opacity-70" : ""}`}>
      <Card.Content>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => onToggleComplete(assignment.Id)}
              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                assignment.completed 
                  ? "bg-success border-success text-white" 
                  : "border-slate-300 hover:border-primary"
              }`}
            >
              {assignment.completed && <ApperIcon name="Check" size={12} />}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium mb-1 ${
                assignment.completed ? "text-slate-500 line-through" : "text-slate-900"
              }`}>
                {assignment.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span style={{ color: course.color }} className="font-medium">
                  {course.name}
                </span>
                <span>•</span>
                <span>{format(dueDate, "MMM d, yyyy")}</span>
                <span>•</span>
                <Badge variant={getPriorityColor(assignment.priority)} size="sm">
                  {assignment.priority}
                </Badge>
              </div>
              {assignment.description && (
                <p className="text-sm text-slate-600 mb-2">{assignment.description}</p>
              )}
              {dueDateInfo && (
                <Badge variant={dueDateInfo.color} size="sm">
                  <ApperIcon name="Clock" size={12} className="mr-1" />
                  {dueDateInfo.text}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(assignment)}
            >
              <ApperIcon name="Edit2" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(assignment.Id)}
              className="text-error hover:text-error"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default AssignmentCard;