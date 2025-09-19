import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isToday, isTomorrow, isThisWeek, format, parseISO, isAfter } from "date-fns";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";

const Dashboard = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [coursesData, assignmentsData, gradesData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ]);
      
      setCourses(coursesData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate stats
  const totalCourses = courses.length;
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.completed).length;
  const pendingAssignments = totalAssignments - completedAssignments;
  const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  // Calculate GPA
  const calculateGPA = () => {
    if (grades.length === 0) return "4.0";
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
      const courseGrades = grades.filter(g => g.courseId === course.Id);
      if (courseGrades.length > 0) {
        const avgScore = courseGrades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / courseGrades.length;
        const gpa = scoreToGPA(avgScore);
        totalPoints += gpa * course.credits;
        totalCredits += course.credits;
      }
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(1) : "4.0";
  };

  const scoreToGPA = (score) => {
    if (score >= 97) return 4.0;
    if (score >= 93) return 3.7;
    if (score >= 90) return 3.3;
    if (score >= 87) return 3.0;
    if (score >= 83) return 2.7;
    if (score >= 80) return 2.3;
    if (score >= 77) return 2.0;
    if (score >= 73) return 1.7;
    if (score >= 70) return 1.3;
    if (score >= 67) return 1.0;
    return 0.0;
  };

  // Get upcoming assignments
  const upcomingAssignments = assignments
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Get today's schedule
  const getTodaysSchedule = () => {
    const today = new Date().getDay();
    const scheduleItems = [];
    
    courses.forEach(course => {
      if (course.schedule) {
        course.schedule.forEach(schedule => {
          if (schedule.day === today) {
            scheduleItems.push({
              course: course.name,
              time: schedule.display.split(" ")[1],
              color: course.color
            });
          }
        });
      }
    });
    
    return scheduleItems.sort((a, b) => a.time.localeCompare(b.time));
  };

  const todaySchedule = getTodaysSchedule();

  const getAssignmentDueInfo = (assignment) => {
    const dueDate = parseISO(assignment.dueDate);
    const now = new Date();
    
    if (isAfter(now, dueDate)) {
      return { text: "Overdue", color: "error" };
    } else if (isToday(dueDate)) {
      return { text: "Due Today", color: "warning" };
    } else if (isTomorrow(dueDate)) {
      return { text: "Due Tomorrow", color: "warning" };
    } else if (isThisWeek(dueDate)) {
      return { text: format(dueDate, "EEE"), color: "info" };
    }
    
    return { text: format(dueDate, "MMM d"), color: "default" };
  };

  return (
    <div className="space-y-6">
      <Header 
        onMenuClick={onMenuClick}
        title="Dashboard"
        subtitle="Welcome back! Here's your academic overview"
        rightContent={
          <Button
            onClick={() => navigate("/assignments")}
            size="sm"
          >
            <ApperIcon name="Plus" size={16} className="mr-1" />
            Add Assignment
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current GPA"
          value={calculateGPA()}
          icon="Award"
          color="primary"
          trend={`${completionRate}% completion rate`}
          trendDirection={completionRate >= 75 ? "up" : completionRate >= 50 ? "neutral" : "down"}
        />
        <StatCard
          title="Active Courses"
          value={totalCourses}
          icon="BookOpen"
          color="success"
        />
        <StatCard
          title="Pending Assignments"
          value={pendingAssignments}
          icon="FileText"
          color="warning"
          trend={pendingAssignments <= 5 ? "Manageable workload" : "Heavy workload"}
        />
        <StatCard
          title="Completed Tasks"
          value={completedAssignments}
          icon="CheckCircle"
          color="info"
          trend={`${completionRate}% complete`}
          trendDirection="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Upcoming Assignments</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/assignments")}
              >
                View All
                <ApperIcon name="ArrowRight" size={16} className="ml-1" />
              </Button>
            </div>
          </Card.Header>
          <Card.Content className="space-y-3">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map(assignment => {
                const course = courses.find(c => c.Id === assignment.courseId);
                const dueInfo = getAssignmentDueInfo(assignment);
                
                return (
                  <div key={assignment.Id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 truncate">
                        {assignment.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span 
                          className="text-xs font-medium px-2 py-1 rounded"
                          style={{ 
                            backgroundColor: `${course?.color}20`,
                            color: course?.color 
                          }}
                        >
                          {course?.name}
                        </span>
                        <Badge variant={dueInfo.color} size="sm">
                          {dueInfo.text}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-slate-500">
                <ApperIcon name="CheckCircle" size={32} className="mx-auto mb-2 text-success" />
                <p>All caught up! No pending assignments.</p>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Today's Schedule</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/schedule")}
              >
                Full Schedule
                <ApperIcon name="ArrowRight" size={16} className="ml-1" />
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            {todaySchedule.length > 0 ? (
              <div className="space-y-3">
                {todaySchedule.map((item, index) => (
                  <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{item.course}</h4>
                      <p className="text-sm text-slate-600">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500">
                <ApperIcon name="Calendar" size={32} className="mx-auto mb-2" />
                <p>No classes scheduled for today.</p>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/courses")}
              className="flex items-center justify-center py-6"
            >
              <ApperIcon name="BookOpen" size={24} className="mr-2" />
              <div className="text-left">
                <div className="font-medium">Manage Courses</div>
                <div className="text-sm text-slate-500">Add or edit courses</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate("/assignments")}
              className="flex items-center justify-center py-6"
            >
              <ApperIcon name="FileText" size={24} className="mr-2" />
              <div className="text-left">
                <div className="font-medium">Add Assignment</div>
                <div className="text-sm text-slate-500">Track new tasks</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate("/grades")}
              className="flex items-center justify-center py-6"
            >
              <ApperIcon name="Award" size={24} className="mr-2" />
              <div className="text-left">
                <div className="font-medium">View Grades</div>
                <div className="text-sm text-slate-500">Check your progress</div>
              </div>
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Dashboard;