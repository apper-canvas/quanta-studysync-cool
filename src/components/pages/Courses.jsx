import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import CourseForm from "@/components/organisms/CourseForm";
import CourseCard from "@/components/molecules/CourseCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const Courses = ({ onMenuClick }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleSaveCourse = async (courseData) => {
    try {
      if (editingCourse) {
        await courseService.update(editingCourse.Id, courseData);
        setCourses(prev => prev.map(c => 
          c.Id === editingCourse.Id ? { ...courseData, Id: editingCourse.Id } : c
        ));
        toast.success("Course updated successfully");
      } else {
        const newCourse = await courseService.create(courseData);
        setCourses(prev => [...prev, newCourse]);
        toast.success("Course added successfully");
      }
      setShowForm(false);
      setEditingCourse(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? This will also delete all associated assignments.")) {
      try {
        await courseService.delete(courseId);
        setCourses(prev => prev.filter(c => c.Id !== courseId));
        toast.success("Course deleted successfully");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleViewAssignments = (courseId) => {
    // Navigate to assignments with course filter
    window.location.hash = `/assignments?course=${courseId}`;
  };

  const sortOptions = [
    { value: "name", label: "Course Name" },
    { value: "instructor", label: "Instructor" },
    { value: "credits", label: "Credits" },
    { value: "semester", label: "Semester" }
  ];

  const filteredAndSortedCourses = courses
.filter(course => 
      course.name_c.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor_c.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name_c.localeCompare(b.name_c);
        case "instructor":
          return a.instructor_c.localeCompare(b.instructor_c);
        case "credits":
          return b.credits_c - a.credits_c;
        case "semester":
          return a.semester_c.localeCompare(b.semester_c);
        default:
          return 0;
      }
    });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  return (
    <div className="space-y-6">
      <Header 
        onMenuClick={onMenuClick}
        title="Courses"
        subtitle={`${courses.length} courses enrolled`}
        rightContent={
          <Button onClick={handleAddCourse}>
            <ApperIcon name="Plus" size={16} className="mr-1" />
            Add Course
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search courses or instructors..."
          />
          
          <Select
            label=""
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[{ value: "", label: "Sort by..." }, ...sortOptions]}
          />
        </div>
      </div>

      {/* Courses Grid */}
      {filteredAndSortedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCourses.map(course => (
            <CourseCard
              key={course.Id}
              course={course}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              onViewAssignments={handleViewAssignments}
            />
          ))}
        </div>
      ) : (
        <Empty
          title={searchQuery ? "No courses found" : "No courses yet"}
          description={searchQuery ? 
            "Try adjusting your search terms" : 
            "Start building your schedule by adding your first course"
          }
          icon="BookOpen"
          actionLabel="Add Course"
          onAction={handleAddCourse}
        />
      )}

      <CourseForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCourse(null);
        }}
        course={editingCourse}
        onSave={handleSaveCourse}
      />
    </div>
  );
};

export default Courses;