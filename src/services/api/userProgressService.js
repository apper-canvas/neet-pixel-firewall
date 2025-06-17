import userProgressData from '../mockData/userProgress.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserProgressService {
  constructor() {
    this.userProgress = [...userProgressData];
  }

  async getAll() {
    await delay(300);
    return [...this.userProgress];
  }

  async getById(id) {
    await delay(200);
    const progress = this.userProgress.find(p => p.Id === parseInt(id, 10));
    return progress ? { ...progress } : null;
  }

  async getByUserId(userId) {
    await delay(300);
    const progress = this.userProgress.find(p => p.userId === userId);
    return progress ? { ...progress } : null;
  }

  async create(progress) {
    await delay(300);
    const newProgress = {
      ...progress,
      Id: Math.max(...this.userProgress.map(p => p.Id)) + 1
    };
    this.userProgress.push(newProgress);
    return { ...newProgress };
  }

  async update(id, data) {
    await delay(300);
    const index = this.userProgress.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) throw new Error('User progress not found');
    
    const updatedProgress = { ...this.userProgress[index], ...data };
    this.userProgress[index] = updatedProgress;
    return { ...updatedProgress };
  }

  async delete(id) {
    await delay(300);
    const index = this.userProgress.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) throw new Error('User progress not found');
    
    this.userProgress.splice(index, 1);
    return { success: true };
  }
}

export default new UserProgressService();