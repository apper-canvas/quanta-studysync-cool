import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { gradeService } from "@/services/api/gradeService";
import { courseService } from "@/services/api/courseService";

const Grades = ({ onMenuClick }) => {
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [gradesData, coursesData] = await Promise.all([
        gradeService.getAll(),
        courseService.getAll()
      ]);
      setGrades(gradesData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const getLetterGrade = (score) => {
    if (score >= 97) return "A+";
    if (score >= 93) return "A";
    if (score >= 90) return "A-";
    if (score >= 87) return "B+";
    if (score >= 83) return "B";
    if (score >= 80) return "B-";
    if (score >= 77) return "C+";
    if (score >= 73) return "C";
    if (score >= 70) return "C-";
    if (score >= 67) return "D+";
    if (score >= 65) return "D";
    return "F";
  };

  const getGradeColor = (score) => {
    if (score >= 90) return "success";
    if (score >= 80) return "info";
    if (score >= 70) return "warning";
    return "error";
  };

  const calculateCourseGrade = (courseId) => {
const courseGrades = grades.filter(g => g.course_id_c === courseId);
    if (courseGrades.length === 0) return null;
    
    // Group by category and calculate weighted average
    const categories = {};
courseGrades.forEach(grade => {
      if (!categories[grade.category_c]) {
        categories[grade.category_c] = [];
      }
      categories[grade.category_c].push(grade);
    });

    let totalWeightedScore = 0;
    let totalWeight = 0;

    Object.keys(categories).forEach(category => {
      const categoryGrades = categories[category];
const categoryAvg = categoryGrades.reduce((sum, g) => 
        sum + (g.score_c / g.max_score_c * 100), 0) / categoryGrades.length;
      
const weight = categoryGrades[0].weight_c;
      totalWeightedScore += categoryAvg * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  };

  const calculateOverallGPA = () => {
    if (courses.length === 0) return "4.0";
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
const courseGrade = calculateCourseGrade(course.Id);
      if (courseGrade !== null) {
        const gpa = scoreToGPA(courseGrade);
        totalPoints += gpa * course.credits_c;
        totalCredits += course.credits_c;
      }
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "4.00";
  };

  const courseOptions = [
    { value: "all", label: "All Courses" },
    ...courses.map(course => ({
value: course.Id.toString(),
      label: course.name_c
    }))
  ];

const filteredGrades = selectedCourse === "all" 
    ? grades 
    : grades.filter(g => g.course_id_c.toString() === selectedCourse);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <Header 
        onMenuClick={onMenuClick}
        title="Grades"
        subtitle="Track your academic performance and GPA"
      />

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Content className="text-center p-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              {calculateOverallGPA()}
            </div>
            <p className="text-slate-600">Overall GPA</p>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="text-center p-6">
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {courses.length}
            </div>
            <p className="text-slate-600">Active Courses</p>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Content className="text-center p-6">
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {grades.length}
            </div>
            <p className="text-slate-600">Recorded Grades</p>
          </Card.Content>
        </Card>
      </div>

      {/* Course Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <Select
          label="Filter by Course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          options={courseOptions}
        />
      </div>

      {/* Course Grades */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses
.filter(course => selectedCourse === "all" || course.Id.toString() === selectedCourse)
            .map(course => {
              const courseGrades = grades.filter(g => g.course_id_c === course.Id);
              const courseAverage = calculateCourseGrade(course.Id);
              
              return (
                <Card key={course.Id} hover>
                  <Card.Header 
                    className="border-l-4"
                    style={{ borderLeftColor: course.color }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
{course.name_c}
                        </h3>
                        <p className="text-sm text-slate-600">{course.instructor_c}</p>
                      </div>
                      {courseAverage !== null && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">
                            {courseAverage.toFixed(1)}%
                          </div>
                          <Badge variant={getGradeColor(courseAverage)}>
                            {getLetterGrade(courseAverage)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Card.Header>
                  
                  <Card.Content>
                    {courseGrades.length > 0 ? (
                      <div className="space-y-3">
{courseGrades.map(grade => {
                          const percentage = (grade.score_c / grade.max_score_c) * 100;
                          return (
                            <div key={grade.Id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div>
<div className="font-medium text-slate-900">
                                  {grade.category_c}
                                </div>
                                <div className="text-sm text-slate-600">
                                  Weight: {(grade.weight_c * 100)}%
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-slate-900">
                                  {grade.score}/{grade.maxScore}
                                </div>
                                <Badge variant={getGradeColor(percentage)} size="sm">
                                  {percentage.toFixed(1)}%
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-500">
                        <ApperIcon name="FileText" size={32} className="mx-auto mb-2" />
                        <p>No grades recorded yet</p>
                      </div>
                    )}
                  </Card.Content>
                </Card>
              );
            })}
        </div>
      ) : (
        <Empty
          title="No courses found"
          description="Add some courses to start tracking your grades"
          icon="Award"
          actionLabel="Add Course"
          onAction={() => window.location.hash = "/courses"}
        />
      )}
    </div>
  );
};

export default Grades;