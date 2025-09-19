import { toast } from "react-toastify";

export const gradeService = {
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
          {"field": {"Name": "course_id_c"}}, 
          {"field": {"Name": "assignment_id_c"}}, 
          {"field": {"Name": "score_c"}}, 
          {"field": {"Name": "max_score_c"}}, 
          {"field": {"Name": "category_c"}}, 
          {"field": {"Name": "weight_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(grade => ({
        Id: grade.Id,
        course_id_c: grade.course_id_c?.Id || grade.course_id_c,
        assignment_id_c: grade.assignment_id_c,
        score_c: grade.score_c,
        max_score_c: grade.max_score_c,
        category_c: grade.category_c,
        weight_c: grade.weight_c
      })) || [];
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
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
          {"field": {"Name": "course_id_c"}}, 
          {"field": {"Name": "assignment_id_c"}}, 
          {"field": {"Name": "score_c"}}, 
          {"field": {"Name": "max_score_c"}}, 
          {"field": {"Name": "category_c"}}, 
          {"field": {"Name": "weight_c"}}
        ]
      };

      const response = await apperClient.getRecordById("grade_c", parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      const grade = response.data;
      return {
        Id: grade.Id,
        course_id_c: grade.course_id_c?.Id || grade.course_id_c,
        assignment_id_c: grade.assignment_id_c,
        score_c: grade.score_c,
        max_score_c: grade.max_score_c,
        category_c: grade.category_c,
        weight_c: grade.weight_c
      };
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByCourse(courseId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}}, 
          {"field": {"Name": "course_id_c"}}, 
          {"field": {"Name": "assignment_id_c"}}, 
          {"field": {"Name": "score_c"}}, 
          {"field": {"Name": "max_score_c"}}, 
          {"field": {"Name": "category_c"}}, 
          {"field": {"Name": "weight_c"}}
        ],
        where: [
          {"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [parseInt(courseId)]}
        ]
      };

      const response = await apperClient.fetchRecords("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(grade => ({
        Id: grade.Id,
        course_id_c: grade.course_id_c?.Id || grade.course_id_c,
        assignment_id_c: grade.assignment_id_c,
        score_c: grade.score_c,
        max_score_c: grade.max_score_c,
        category_c: grade.category_c,
        weight_c: grade.weight_c
      })) || [];
    } catch (error) {
      console.error("Error fetching grades by course:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: gradeData.Name || `Grade for ${gradeData.category_c}`,
          course_id_c: parseInt(gradeData.course_id_c),
          assignment_id_c: gradeData.assignment_id_c,
          score_c: parseFloat(gradeData.score_c),
          max_score_c: parseFloat(gradeData.max_score_c),
          category_c: gradeData.category_c,
          weight_c: parseFloat(gradeData.weight_c)
        }]
      };

      const response = await apperClient.createRecord("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const successful = response.results?.filter(r => r.success);
      const failed = response.results?.filter(r => !r.success);
      
      if (failed?.length > 0) {
        console.error(`Failed to create ${failed.length} grades:${JSON.stringify(failed)}`);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      return successful?.[0]?.data || null;
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: gradeData.Name,
          course_id_c: parseInt(gradeData.course_id_c),
          assignment_id_c: gradeData.assignment_id_c,
          score_c: parseFloat(gradeData.score_c),
          max_score_c: parseFloat(gradeData.max_score_c),
          category_c: gradeData.category_c,
          weight_c: parseFloat(gradeData.weight_c)
        }]
      };

      const response = await apperClient.updateRecord("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const successful = response.results?.filter(r => r.success);
      const failed = response.results?.filter(r => !r.success);
      
      if (failed?.length > 0) {
        console.error(`Failed to update ${failed.length} grades:${JSON.stringify(failed)}`);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      return successful?.[0]?.data || null;
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord("grade_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      const successful = response.results?.filter(r => r.success);
      const failed = response.results?.filter(r => !r.success);
      
      if (failed?.length > 0) {
        console.error(`Failed to delete ${failed.length} grades:${JSON.stringify(failed)}`);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }

      return successful?.length === 1;
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      return false;
    }
  }
};