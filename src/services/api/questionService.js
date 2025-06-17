import questionsData from '../mockData/questions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class QuestionService {
  constructor() {
    this.questions = [...questionsData];
  }

  async getAll() {
    await delay(300);
    return [...this.questions];
  }

  async getById(id) {
    await delay(200);
    const question = this.questions.find(q => q.Id === parseInt(id, 10));
    return question ? { ...question } : null;
  }

  async getBySubject(subject, count = 30) {
    await delay(400);
    const subjectQuestions = this.questions.filter(q => 
      q.subject.toLowerCase() === subject.toLowerCase()
    );
    
    // Shuffle and take requested count
    const shuffled = [...subjectQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async getBySubjectAndChapter(subject, chapter, count = 30) {
    await delay(400);
    const filteredQuestions = this.questions.filter(q => 
      q.subject.toLowerCase() === subject.toLowerCase() &&
      q.chapter.toLowerCase() === chapter.toLowerCase()
    );
    
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async create(question) {
    await delay(300);
    const newQuestion = {
      ...question,
      Id: Math.max(...this.questions.map(q => q.Id)) + 1
    };
    this.questions.push(newQuestion);
    return { ...newQuestion };
  }

  async update(id, data) {
    await delay(300);
    const index = this.questions.findIndex(q => q.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Question not found');
    
    const updatedQuestion = { ...this.questions[index], ...data };
    this.questions[index] = updatedQuestion;
    return { ...updatedQuestion };
  }

  async delete(id) {
    await delay(300);
    const index = this.questions.findIndex(q => q.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Question not found');
    
    this.questions.splice(index, 1);
    return { success: true };
  }
}

export default new QuestionService();