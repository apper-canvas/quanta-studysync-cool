import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CourseCard = ({ course, onEdit, onDelete, onViewAssignments }) => {
  const getNextClass = () => {
    if (!course.schedule || course.schedule.length === 0) return null;
    
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Find next class
    for (let i = 0; i < 7; i++) {
      const checkDay = (currentDay + i) % 7;
      const daySchedule = course.schedule.find(s => s.day === checkDay);
      
      if (daySchedule && (i > 0 || daySchedule.time > currentTime)) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const hours = Math.floor(daySchedule.time / 60);
        const minutes = daySchedule.time % 60;
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        return `${days[checkDay]} ${timeStr}`;
      }
    }
    
    return null;
  };

  const nextClass = getNextClass();

  return (
    <Card hover className="overflow-hidden">
      <div 
        className="h-2 bg-gradient-to-r"
        style={{ 
          background: `linear-gradient(90deg, ${course.color}40, ${course.color})` 
        }}
      />
      <Card.Content className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {course.name}
            </h3>
            <p className="text-slate-600 text-sm mb-2">{course.instructor}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center">
                <ApperIcon name="BookOpen" size={16} className="mr-1" />
                {course.credits} credits
              </span>
              {nextClass && (
                <span className="flex items-center">
                  <ApperIcon name="Clock" size={16} className="mr-1" />
                  Next: {nextClass}
                </span>
              )}
            </div>
          </div>
          <Badge variant="secondary">{course.semester}</Badge>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewAssignments(course.Id)}
            className="flex-1"
          >
            <ApperIcon name="FileText" size={16} className="mr-1" />
            Assignments
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(course)}
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(course.Id)}
            className="text-error hover:text-error"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default CourseCard;