import React, { useState, useEffect } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";

const Schedule = ({ onMenuClick }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  const formatTime = (hour) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const getClassesForDay = (dayIndex) => {
    const classes = [];
    courses.forEach(course => {
      if (course.schedule) {
        course.schedule.forEach(schedule => {
          if (schedule.day === dayIndex) {
            classes.push({
              course: course.name,
              instructor: course.instructor,
              startTime: schedule.time,
              endTime: schedule.endTime,
              color: course.color,
              display: schedule.display
            });
          }
        });
      }
    });
    return classes.sort((a, b) => a.startTime - b.startTime);
  };

  const getTodaysClasses = () => {
    const today = new Date().getDay();
    return getClassesForDay(today);
  };

  const navigateWeek = (direction) => {
    setCurrentWeek(prev => addDays(prev, direction * 7));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  const todaysClasses = getTodaysClasses();
  const hasSchedule = courses.some(course => course.schedule && course.schedule.length > 0);

  return (
    <div className="space-y-6">
      <Header 
        onMenuClick={onMenuClick}
        title="Schedule"
        subtitle={`Week of ${format(weekStart, "MMM d, yyyy")}`}
        rightContent={
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigateWeek(-1)}
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={goToCurrentWeek}
            >
              Today
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigateWeek(1)}
            >
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          </div>
        }
      />

      {/* Today's Classes Quick View */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-slate-900">Today's Classes</h3>
        </Card.Header>
        <Card.Content>
          {todaysClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todaysClasses.map((classItem, index) => (
                <div key={index} className="p-4 rounded-lg border-l-4 bg-slate-50" style={{ borderLeftColor: classItem.color }}>
                  <h4 className="font-semibold text-slate-900">{classItem.course}</h4>
                  <p className="text-sm text-slate-600 mb-1">{classItem.instructor}</p>
                  <p className="text-sm font-medium" style={{ color: classItem.color }}>
                    {minutesToTime(classItem.startTime)} - {minutesToTime(classItem.endTime)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500">
              <ApperIcon name="Calendar" size={32} className="mx-auto mb-2" />
              <p>No classes scheduled for today</p>
            </div>
          )}
        </Card.Content>
      </Card>

      {hasSchedule ? (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-slate-900">Weekly Schedule</h3>
          </Card.Header>
          <Card.Content className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Days Header */}
                <div className="grid grid-cols-8 border-b border-slate-200">
                  <div className="p-4 text-sm font-medium text-slate-600">Time</div>
                  {weekDays.map((day, index) => (
                    <div key={index} className="p-4 text-center border-l border-slate-200">
                      <div className="text-sm font-medium text-slate-900">
                        {dayNames[day.getDay()]}
                      </div>
                      <div className="text-xs text-slate-600">
                        {format(day, "MMM d")}
                      </div>
                      {isSameDay(day, new Date()) && (
                        <div className="w-2 h-2 bg-primary rounded-full mx-auto mt-1"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Schedule Grid */}
                <div className="relative">
                  {timeSlots.map(hour => (
                    <div key={hour} className="grid grid-cols-8 border-b border-slate-100 min-h-[60px]">
                      <div className="p-4 text-sm text-slate-600 border-r border-slate-200">
                        {formatTime(hour)}
                      </div>
                      {weekDays.map((day, dayIndex) => {
                        const classes = getClassesForDay(day.getDay());
                        const classInHour = classes.find(c => {
                          const startHour = Math.floor(c.startTime / 60);
                          const endHour = Math.floor(c.endTime / 60);
                          return hour >= startHour && hour < endHour;
                        });

                        return (
                          <div key={dayIndex} className="border-l border-slate-200 relative">
                            {classInHour && hour === Math.floor(classInHour.startTime / 60) && (
                              <div
                                className="absolute inset-x-1 rounded p-2 text-white text-xs font-medium shadow-sm"
                                style={{
                                  backgroundColor: classInHour.color,
                                  height: `${Math.max(((classInHour.endTime - classInHour.startTime) / 60) * 60, 40)}px`,
                                  top: `${((classInHour.startTime % 60) / 60) * 60}px`
                                }}
                              >
                                <div className="font-semibold truncate">{classInHour.course}</div>
                                <div className="truncate opacity-90">{classInHour.instructor}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      ) : (
        <Empty
          title="No schedule available"
          description="Add courses with schedule information to see your weekly timetable"
          icon="Calendar"
          actionLabel="Add Course"
          onAction={() => window.location.hash = "/courses"}
        />
      )}

      {/* Schedule Summary */}
      {hasSchedule && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-slate-900">This Week's Summary</h3>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {weekDays.map((day, index) => {
                const classes = getClassesForDay(day.getDay());
                const totalHours = classes.reduce((sum, c) => sum + ((c.endTime - c.startTime) / 60), 0);
                
                return (
                  <div key={index} className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm font-medium text-slate-900">
                      {dayNames[day.getDay()]}
                    </div>
                    <div className="text-xs text-slate-600 mb-2">
                      {format(day, "MMM d")}
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {classes.length}
                    </div>
                    <div className="text-xs text-slate-600">
                      {classes.length === 1 ? "class" : "classes"}
                    </div>
                    {totalHours > 0 && (
                      <div className="text-xs text-slate-500 mt-1">
                        {totalHours.toFixed(1)}h total
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default Schedule;