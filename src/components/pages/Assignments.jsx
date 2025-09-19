import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import AssignmentForm from "@/components/organisms/AssignmentForm";
import AssignmentCard from "@/components/molecules/AssignmentCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";

const Assignments = ({ onMenuClick }) => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setShowForm(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleSaveAssignment = async (assignmentData) => {
    try {
      if (editingAssignment) {
        await assignmentService.update(editingAssignment.Id, assignmentData);
        setAssignments(prev => prev.map(a => 
          a.Id === editingAssignment.Id ? { ...assignmentData, Id: editingAssignment.Id } : a
        ));
        toast.success("Assignment updated successfully");
      } else {
        const newAssignment = await assignmentService.create(assignmentData);
        setAssignments(prev => [...prev, newAssignment]);
        toast.success("Assignment added successfully");
      }
      setShowForm(false);
      setEditingAssignment(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentService.delete(assignmentId);
        setAssignments(prev => prev.filter(a => a.Id !== assignmentId));
        toast.success("Assignment deleted successfully");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleToggleComplete = async (assignmentId) => {
    try {
      const updatedAssignment = await assignmentService.toggleComplete(assignmentId);
      setAssignments(prev => prev.map(a => 
        a.Id === assignmentId ? updatedAssignment : a
      ));
      toast.success(updatedAssignment.completed ? "Assignment completed!" : "Assignment marked as pending");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const statusOptions = [
    { value: "all", label: "All Assignments" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" }
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" }
  ];

  const sortOptions = [
    { value: "dueDate", label: "Due Date" },
    { value: "title", label: "Title" },
    { value: "priority", label: "Priority" },
    { value: "course", label: "Course" }
  ];

  const courseOptions = [
    { value: "all", label: "All Courses" },
    ...courses.map(course => ({
      value: course.Id.toString(),
      label: course.name
    }))
  ];

  const filteredAndSortedAssignments = assignments
    .filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "completed" && assignment.completed) ||
        (statusFilter === "pending" && !assignment.completed);
      const matchesCourse = courseFilter === "all" || assignment.courseId.toString() === courseFilter;
      const matchesPriority = priorityFilter === "all" || assignment.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesCourse && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "title":
          return a.title.localeCompare(b.title);
        case "priority":
          const priorityOrder = { "high": 3, "medium": 2, "low": 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "course":
          const courseA = courses.find(c => c.Id === a.courseId)?.name || "";
          const courseB = courses.find(c => c.Id === b.courseId)?.name || "";
          return courseA.localeCompare(courseB);
        default:
          return 0;
      }
    });

  const pendingCount = assignments.filter(a => !a.completed).length;
  const completedCount = assignments.filter(a => a.completed).length;

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <Header 
        onMenuClick={onMenuClick}
        title="Assignments"
        subtitle={`${pendingCount} pending • ${completedCount} completed`}
        rightContent={
          <Button onClick={handleAddAssignment}>
            <ApperIcon name="Plus" size={16} className="mr-1" />
            Add Assignment
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200 text-center">
          <div className="text-2xl font-bold text-slate-900">{assignments.length}</div>
          <div className="text-sm text-slate-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200 text-center">
          <div className="text-2xl font-bold text-warning">{pendingCount}</div>
          <div className="text-sm text-slate-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200 text-center">
          <div className="text-2xl font-bold text-success">{completedCount}</div>
          <div className="text-sm text-slate-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200 text-center">
          <div className="text-2xl font-bold text-primary">
            {assignments.length > 0 ? Math.round((completedCount / assignments.length) * 100) : 0}%
          </div>
          <div className="text-sm text-slate-600">Complete</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search assignments..."
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
          
          <Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            options={courseOptions}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={priorityOptions}
          />
          
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[{ value: "", label: "Sort by..." }, ...sortOptions]}
          />
        </div>
      </div>

      {/* Assignments List */}
      {filteredAndSortedAssignments.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSortedAssignments.map(assignment => {
            const course = courses.find(c => c.Id === assignment.courseId);
            return (
              <AssignmentCard
                key={assignment.Id}
                assignment={assignment}
                course={course || { name: "Unknown Course", color: "#6b7280" }}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditAssignment}
                onDelete={handleDeleteAssignment}
              />
            );
          })}
        </div>
      ) : (
        <Empty
          title={searchQuery || statusFilter !== "all" || courseFilter !== "all" || priorityFilter !== "all" ? 
            "No assignments found" : "No assignments yet"}
          description={searchQuery || statusFilter !== "all" || courseFilter !== "all" || priorityFilter !== "all" ? 
            "Try adjusting your filters" : 
            "Start organizing your coursework by adding your first assignment"}
          icon="FileText"
          actionLabel="Add Assignment"
          onAction={handleAddAssignment}
        />
      )}

      <AssignmentForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingAssignment(null);
        }}
        assignment={editingAssignment}
        courses={courses}
        onSave={handleSaveAssignment}
      />
    </div>
  );
};

export default Assignments;