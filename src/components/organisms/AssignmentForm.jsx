import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const AssignmentForm = ({ isOpen, onClose, assignment, courses, onSave }) => {
const [formData, setFormData] = useState({
    title_c: "",
    course_id_c: "",
    due_date_c: "",
    priority_c: "medium",
    type_c: "Assignment",
    description_c: "",
    completed_c: false
  });

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  const typeOptions = [
    { value: "Assignment", label: "Assignment" },
    { value: "Quiz", label: "Quiz" },
    { value: "Exam", label: "Exam" },
    { value: "Project", label: "Project" },
    { value: "Lab", label: "Lab" },
    { value: "Essay", label: "Essay" }
  ];

  useEffect(() => {
if (assignment) {
      setFormData({
        title_c: assignment.title_c || "",
        course_id_c: assignment.course_id_c?.toString() || "",
        due_date_c: assignment.due_date_c ? format(new Date(assignment.due_date_c), "yyyy-MM-dd") : "",
        priority_c: assignment.priority_c || "medium",
        type_c: assignment.type_c || "Assignment",
        description_c: assignment.description_c || "",
        completed_c: assignment.completed_c || false
      });
    } else {
      setFormData({
        title: "",
        courseId: "",
        dueDate: "",
        priority: "medium",
        type: "Assignment",
        description: "",
        completed: false
      });
    }
  }, [assignment, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Assignment title is required");
      return;
    }
    
    if (!formData.courseId) {
      toast.error("Please select a course");
      return;
    }

    if (!formData.dueDate) {
      toast.error("Due date is required");
      return;
    }

    const assignmentData = {
      ...formData,
course_id_c: parseInt(formData.course_id_c),
      due_date_c: new Date(formData.due_date_c).toISOString(),
      Id: assignment?.Id
    };

    onSave(assignmentData);
  };

  const courseOptions = [
    { value: "", label: "Select a course" },
    ...courses.map(course => ({
value: course.Id.toString(),
      label: course.name_c
    }))
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={assignment ? "Edit Assignment" : "Add Assignment"} size="lg">
      <form onSubmit={handleSubmit}>
        <Modal.Content>
          <div className="space-y-6">
            <FormField
              label="Assignment Title"
value={formData.title_c}
              onChange={(e) => handleInputChange("title_c", e.target.value)}
              placeholder="e.g., Chapter 5 Reading Assignment"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                type="select"
                label="Course"
value={formData.course_id_c}
                onChange={(e) => handleInputChange("course_id_c", e.target.value)}
                options={courseOptions}
                required
              />
              
              <FormField
                label="Due Date"
type="date"
                value={formData.due_date_c}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                type="select"
label="Priority"
                value={formData.priority_c}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                options={priorityOptions}
              />
              
              <FormField
                type="select"
label="Type"
                value={formData.type_c}
                onChange={(e) => handleInputChange("type", e.target.value)}
                options={typeOptions}
              />
            </div>

            <FormField
label="Description (Optional)"
              value={formData.description_c}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Additional details about the assignment..."
            />

            {assignment && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="completed"
checked={formData.completed_c}
                  onChange={(e) => handleInputChange("completed_c", e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="completed" className="text-sm font-medium text-slate-700">
                  Mark as completed
                </label>
              </div>
            )}
          </div>
        </Modal.Content>

        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {assignment ? "Update Assignment" : "Add Assignment"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AssignmentForm;