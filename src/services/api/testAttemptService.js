import testAttemptsData from '../mockData/testAttempts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TestAttemptService {
  constructor() {
    this.testAttempts = [...testAttemptsData];
  }

  async getAll() {
    await delay(300);
    return [...this.testAttempts];
  }

  async getById(id) {
    await delay(200);
    const attempt = this.testAttempts.find(t => t.Id === parseInt(id, 10));
    return attempt ? { ...attempt } : null;
  }

  async getUserAttempts(userId) {
    await delay(300);
    return this.testAttempts
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  }

  async create(attempt) {
    await delay(300);
    const newAttempt = {
      ...attempt,
      Id: Math.max(...this.testAttempts.map(t => t.Id)) + 1,
      completedAt: new Date().toISOString()
    };
    this.testAttempts.push(newAttempt);
    return { ...newAttempt };
  }

  async update(id, data) {
    await delay(300);
    const index = this.testAttempts.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Test attempt not found');
    
    const updatedAttempt = { ...this.testAttempts[index], ...data };
    this.testAttempts[index] = updatedAttempt;
    return { ...updatedAttempt };
  }

  async delete(id) {
    await delay(300);
    const index = this.testAttempts.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) throw new Error('Test attempt not found');
    
    this.testAttempts.splice(index, 1);
    return { success: true };
  }
}

export default new TestAttemptService();