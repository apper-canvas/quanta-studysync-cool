import { toast } from "react-toastify";

export const courseService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}}, 
          {"field": {"Name": "instructor_c"}}, 
          {"field": {"Name": "credits_c"}}, 
          {"field": {"Name": "color_c"}}, 
          {"field": {"Name": "semester_c"}}, 
          {"field": {"Name": "schedule_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords("course_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(course => ({
        Id: course.Id,
        name_c: course.name_c,
        instructor_c: course.instructor_c,
        credits_c: course.credits_c,
        color_c: course.color_c,
        semester_c: course.semester_c,
schedule_c: course.schedule_c && course.schedule_c !== 'undefined' ? 
          (() => {
            try {
              return JSON.parse(course.schedule_c);
            } catch (e) {
              console.warn('Invalid schedule JSON:', course.schedule_c);
              return [];
            }
          })() : []
      })) || [];
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}}, 
          {"field": {"Name": "instructor_c"}}, 
          {"field": {"Name": "credits_c"}}, 
          {"field": {"Name": "color_c"}}, 
          {"field": {"Name": "semester_c"}}, 
          {"field": {"Name": "schedule_c"}}
        ]
      };

      const response = await apperClient.getRecordById("course_c", parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      const course = response.data;
      return {
        Id: course.Id,
        name_c: course.name_c,
        instructor_c: course.instructor_c,
        credits_c: course.credits_c,
        color_c: course.color_c,
semester_c: course.semester_c || 'Not Specified',
        schedule_c: course.schedule_c && course.schedule_c !== 'undefined' ? 
          (() => {
            try {
              return JSON.parse(course.schedule_c);
            } catch (e) {
              console.warn('Invalid schedule JSON:', course.schedule_c);
              return [];
            }
          })() : []
      };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: courseData.name_c || courseData.Name,
          name_c: courseData.name_c,
          instructor_c: courseData.instructor_c,
          credits_c: parseInt(courseData.credits_c),
          color_c: courseData.color_c,
          semester_c: courseData.semester_c,
          schedule_c: JSON.stringify(courseData.schedule_c || [])
        }]
      };

      const response = await apperClient.createRecord("course_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const successful = response.results?.filter(r => r.success);
      const failed = response.results?.filter(r => !r.success);
      
      if (failed?.length > 0) {
        console.error(`Failed to create ${failed.length} courses:${JSON.stringify(failed)}`);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      return successful?.[0]?.data || null;
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: courseData.name_c || courseData.Name,
          name_c: courseData.name_c,
          instructor_c: courseData.instructor_c,
          credits_c: parseInt(courseData.credits_c),
          color_c: courseData.color_c,
          semester_c: courseData.semester_c,
          schedule_c: JSON.stringify(courseData.schedule_c || [])
        }]
      };

      const response = await apperClient.updateRecord("course_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const successful = response.results?.filter(r => r.success);
      const failed = response.results?.filter(r => !r.success);
      
      if (failed?.length > 0) {
        console.error(`Failed to update ${failed.length} courses:${JSON.stringify(failed)}`);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      return successful?.[0]?.data || null;
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("course_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      const successful = response.results?.filter(r => r.success);
      const failed = response.results?.filter(r => !r.success);
      
      if (failed?.length > 0) {
        console.error(`Failed to delete ${failed.length} courses:${JSON.stringify(failed)}`);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }

      return successful?.length === 1;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      return false;
    }
  }
};