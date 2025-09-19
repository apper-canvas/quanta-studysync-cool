import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const CourseForm = ({ isOpen, onClose, course, onSave }) => {
const [formData, setFormData] = useState({
    name_c: "",
    instructor_c: "",
    credits_c: "",
    color_c: "#4f46e5",
    semester_c: "Fall 2024",
    schedule_c: []
  });

  const [scheduleEntry, setScheduleEntry] = useState({
    day: "",
    startTime: "",
    endTime: ""
  });

  const days = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" }
  ];

  const colors = [
    "#4f46e5", "#7c3aed", "#dc2626", "#ea580c", 
    "#d97706", "#65a30d", "#059669", "#0891b2"
  ];

  useEffect(() => {
if (course) {
      setFormData({
        name_c: course.name_c || "",
        instructor_c: course.instructor_c || "",
        credits_c: course.credits_c?.toString() || "",
        color_c: course.color_c || "#4f46e5",
        semester_c: course.semester_c || "Fall 2024",
        schedule_c: course.schedule_c || []
      });
    } else {
      setFormData({
        name: "",
        instructor: "",
        credits: "",
        color: "#4f46e5",
        semester: "Fall 2024",
        schedule: []
      });
    }
  }, [course, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addScheduleEntry = () => {
    if (!scheduleEntry.day || !scheduleEntry.startTime || !scheduleEntry.endTime) {
      toast.error("Please fill in all schedule fields");
      return;
    }

    const startMinutes = timeToMinutes(scheduleEntry.startTime);
    const endMinutes = timeToMinutes(scheduleEntry.endTime);

    if (endMinutes <= startMinutes) {
      toast.error("End time must be after start time");
      return;
    }

    const newEntry = {
      day: parseInt(scheduleEntry.day),
      time: startMinutes,
      endTime: endMinutes,
      display: `${getDayName(parseInt(scheduleEntry.day))} ${scheduleEntry.startTime}-${scheduleEntry.endTime}`
    };

    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, newEntry]
    }));

    setScheduleEntry({ day: "", startTime: "", endTime: "" });
  };

  const removeScheduleEntry = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getDayName = (dayNum) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[dayNum];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Course name is required");
      return;
    }
    
    if (!formData.instructor.trim()) {
      toast.error("Instructor name is required");
      return;
    }

    if (!formData.credits || parseInt(formData.credits) <= 0) {
      toast.error("Valid credits number is required");
      return;
    }

    const courseData = {
...formData,
      credits_c: parseInt(formData.credits_c),
      Id: course?.Id
    };

    onSave(courseData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={course ? "Edit Course" : "Add Course"} size="lg">
      <form onSubmit={handleSubmit}>
        <Modal.Content>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Course Name"
value={formData.name_c}
                onChange={(e) => handleInputChange("name_c", e.target.value)}
                placeholder="e.g., Introduction to Psychology"
                required
              />
              
              <FormField
                label="Instructor"
value={formData.instructor_c}
                onChange={(e) => handleInputChange("instructor_c", e.target.value)}
                placeholder="e.g., Dr. Smith"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Credits"
type="number"
                value={formData.credits_c}
                onChange={(e) => handleInputChange("credits", e.target.value)}
                min="1"
                max="6"
                required
              />
              
              <FormField
                label="Semester"
value={formData.semester_c}
                onChange={(e) => handleInputChange("semester_c", e.target.value)}
                placeholder="e.g., Fall 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Course Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
onClick={() => handleInputChange("color_c", color)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color ? "border-slate-900 scale-110" : "border-slate-200"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Schedule
              </label>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <FormField
                    type="select"
                    label="Day"
                    value={scheduleEntry.day}
                    onChange={(e) => setScheduleEntry(prev => ({ ...prev, day: e.target.value }))}
                    options={[{ value: "", label: "Select Day" }, ...days]}
                  />
                  
                  <FormField
                    label="Start Time"
                    type="time"
                    value={scheduleEntry.startTime}
                    onChange={(e) => setScheduleEntry(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                  
                  <FormField
                    label="End Time"
                    type="time"
                    value={scheduleEntry.endTime}
                    onChange={(e) => setScheduleEntry(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                  
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={addScheduleEntry}
                      className="w-full"
                      size="md"
                    >
                      <ApperIcon name="Plus" size={16} className="mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
                
                {formData.schedule.length > 0 && (
                  <div className="space-y-2">
                    {formData.schedule.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                        <span className="text-sm">{entry.display}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeScheduleEntry(index)}
                          className="text-error hover:text-error"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Content>

        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {course ? "Update Course" : "Add Course"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CourseForm;