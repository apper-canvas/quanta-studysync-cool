import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
  async getAll() {
    await delay(300);
    return [...grades];
  },

  async getById(id) {
    await delay(200);
    const grade = grades.find(g => g.Id === parseInt(id));
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  },

  async getByCourse(courseId) {
    await delay(250);
    return grades.filter(g => g.courseId === parseInt(courseId));
  },

  async create(gradeData) {
    await delay(400);
    const maxId = grades.length > 0 ? Math.max(...grades.map(g => g.Id)) : 0;
    const newGrade = {
      ...gradeData,
      Id: maxId + 1
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(400);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades[index] = { ...grades[index], ...gradeData, Id: parseInt(id) };
    return { ...grades[index] };
  },

  async delete(id) {
    await delay(300);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    grades.splice(index, 1);
    return true;
  }
};