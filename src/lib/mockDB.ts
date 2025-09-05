// Mock database service for demo purposes
export interface MockUser {
  id: string;
  email: string;
  name: string;
  safetyScore: number;
  createdAt: string;
}

export interface MockReport {
  id: string;
  userId: string;
  type: string;
  severity: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface MockSafetyTip {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

class MockDatabase {
  private users: MockUser[] = [
    {
      id: '1',
      email: 'demo@hershield.com',
      name: 'Sarah Mwangi',
      safetyScore: 89,
      createdAt: new Date().toISOString()
    }
  ];

  private reports: MockReport[] = [
    {
      id: '1',
      userId: '1',
      type: 'harassment',
      severity: 'medium',
      description: 'Receiving unwanted messages on social media',
      status: 'reviewed',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  private safetyTips: MockSafetyTip[] = [
    {
      id: '1',
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your accounts',
      category: 'security',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Review Privacy Settings',
      description: 'Regularly check your social media privacy settings',
      category: 'privacy',
      priority: 'medium'
    }
  ];

  // User operations
  async getUser(id: string): Promise<MockUser | null> {
    await this.delay(200); // Simulate network delay
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(email: string, name: string): Promise<MockUser> {
    await this.delay(500);
    const user: MockUser = {
      id: Date.now().toString(),
      email,
      name,
      safetyScore: 75,
      createdAt: new Date().toISOString()
    };
    this.users.push(user);
    return user;
  }

  // Report operations
  async createReport(userId: string, type: string, severity: string, description: string): Promise<MockReport> {
    await this.delay(800);
    const report: MockReport = {
      id: Date.now().toString(),
      userId,
      type,
      severity,
      description,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.reports.push(report);
    return report;
  }

  async getUserReports(userId: string): Promise<MockReport[]> {
    await this.delay(300);
    return this.reports.filter(report => report.userId === userId);
  }

  // Safety tips
  async getSafetyTips(): Promise<MockSafetyTip[]> {
    await this.delay(200);
    return this.safetyTips;
  }

  // Statistics
  async getStats() {
    await this.delay(400);
    return {
      totalUsers: this.users.length,
      totalReports: this.reports.length,
      resolvedReports: this.reports.filter(r => r.status === 'resolved').length,
      activeThreats: Math.floor(Math.random() * 5) + 1
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockDB = new MockDatabase();
