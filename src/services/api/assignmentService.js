import { toast } from "react-toastify";

export const assignmentService = {
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
          {"field": {"Name": "title_c"}}, 
          {"field": {"Name": "due_date_c"}}, 
          {"field": {"Name": "priority_c"}}, 
          {"field": {"Name": "type_c"}}, 
          {"field": {"Name": "description_c"}}, 
          {"field": {"Name": "completed_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data?.map(assignment => ({
        Id: assignment.Id,
        course_id_c: assignment.course_id_c?.Id || assignment.course_id_c,
        title_c: assignment.title_c,
        due_date_c: assignment.due_date_c,
        priority_c: assignment.priority_c,
        type_c: assignment.type_c,
        description_c: assignment.description_c,
        completed_c: assignment.completed_c
      })) || [];
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
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
          {"field": {"Name": "title_c"}}, 
          {"field": {"Name": "due_date_c"}}, 
          {"field": {"Name": "priority_c"}}, 
          {"field": {"Name": "type_c"}}, 
          {"field": {"Name": "description_c"}}, 
          {"field": {"Name": "completed_c"}}
        ]
      };

      const response = await apperClient.getRecordById("assignment_c", parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      const assignment = response.data;
      return {
        Id: assignment.Id,
        course_id_c: assignment.course_id_c?.Id || assignment.course_id_c,
        title_c: assignment.title_c,
        due_date_c: assignment.due_date_c,
        priority_c: assignment.priority_c,
        type_c: assignment.type_c,
        description_c: assignment.description_c,
        completed_c: assignment.completed_c
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
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
          {"field": {"Name": "title_c"}}, 
          {"field": {"Name": "due_date_c"}}, 
          {"field": {"Name": "priority_c"}}, 
          {"field": {"Name": "type_c"}}, 
          {"field": {"Name": "description_c"}}, 
          {"field": {"Name": "completed_c"}}
        ],
        where: [
          {"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [parseInt(courseId)]}
        ]
      };

      const response = await apperClient.fetchRecords("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(assignment => ({
        Id: assignment.Id,
        course_id_c: assignment.course_id_c?.Id || assignment.course_id_c,
        title_c: assignment.title_c,
        due_date_c: assignment.due_date_c,
        priority_c: assignment.priority_c,
        type_c: assignment.type_c,
        description_c: assignment.description_c,
        completed_c: assignment.completed_c
      })) || [];
    } catch (error) {
      console.error("Error fetching assignments by course:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: assignmentData.title_c || assignmentData.Name,
          course_id_c: parseInt(assignmentData.course_id_c),
          title_c: assignmentData.title_c,
          due_date_c: assignmentData.due_date_c,
          priority_c: assignmentData.priority_c,
          type_c: assignmentData.type_c,
          description_c: assignmentData.description_c,
          completed_c: assignmentData.completed_c || false
        }]
      };

      const response = await apperClient.createRecord("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const successful = response.results?.filter(r => r.success);
      const failed = response.results?.filter(r => !r.success);
      
      if (failed?.length > 0) {
        console.error(`Failed to create ${failed.length} assignments:${JSON.stringify(failed)}`);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      return successful?.[0]?.data || null;
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: assignmentData.title_c || assignmentData.Name,
          course_id_c: parseInt(assignmentData.course_id_c),
          title_c: assignmentData.title_c,
          due_date_c: assignmentData.due_date_c,
          priority_c: assignmentData.priority_c,
          type_c: assignmentData.type_c,
          description_c: assignmentData.description_c,
          completed_c: assignmentData.completed_c
        }]
      };

      const response = await apperClient.updateRecord("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const successful = response.results?.filter(r => r.success);
      const failed = response.results?.filter(r => !r.success);
      
      if (failed?.length > 0) {
        console.error(`Failed to update ${failed.length} assignments:${JSON.stringify(failed)}`);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      return successful?.[0]?.data || null;
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord("assignment_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      const successful = response.results?.filter(r => r.success);
      const failed = response.results?.filter(r => !r.success);
      
      if (failed?.length > 0) {
        console.error(`Failed to delete ${failed.length} assignments:${JSON.stringify(failed)}`);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }

      return successful?.length === 1;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      return false;
    }
  },

  async toggleComplete(id) {
    try {
      // First get the current assignment
      const currentAssignment = await this.getById(id);
      if (!currentAssignment) {
        throw new Error("Assignment not found");
      }

      // Update with toggled completion status
      const updated = await this.update(id, {
        ...currentAssignment,
        completed_c: !currentAssignment.completed_c
      });

      return updated;
    } catch (error) {
      console.error("Error toggling assignment completion:", error?.response?.data?.message || error);
      return null;
    }
  }
};