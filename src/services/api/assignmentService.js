import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const assignmentService = {
  async getAll() {
    await delay(300);
    return [...assignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === parseInt(id));
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  },

  async getByCourse(courseId) {
    await delay(250);
    return assignments.filter(a => a.courseId === parseInt(courseId));
  },

  async create(assignmentData) {
    await delay(400);
    const maxId = assignments.length > 0 ? Math.max(...assignments.map(a => a.Id)) : 0;
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay(400);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments[index] = { ...assignments[index], ...assignmentData, Id: parseInt(id) };
    return { ...assignments[index] };
  },

  async delete(id) {
    await delay(300);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments.splice(index, 1);
    return true;
  },

  async toggleComplete(id) {
    await delay(200);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    assignments[index].completed = !assignments[index].completed;
    return { ...assignments[index] };
  }
};