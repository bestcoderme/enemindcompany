import { UserProfile, UserRole } from '../../types';

const USERS_DB_KEY = 'enemind_users_db';
const CURRENT_USER_KEY = 'enemind_current_user';

export const DEFAULT_STUDENT_USER: UserProfile = {
  name: 'Alex Kimani',
  email: 'alex.kimani@students.uonbi.ac.ke',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  roles: ['STUDENT'],
  provider: 'google',
  phoneNumber: '+254 712 345 678',
  whatsappNumber: '+254 712 345 678',
  university: {
    id: 'uon',
    name: 'University of Nairobi',
    shortName: 'UoN',
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    category: 'University',
    code: 'UON',
    logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&auto=format&fit=crop&q=80',
    type: 'public',
  },
  course: {
    id: 'uon-eng-elec',
    code: 'F17',
    name: 'B.Sc. Electrical & Information Engineering',
    category: 'Engineering & Technology',
    years: 5,
  },
  subscription: {
    trialStartDate: new Date().toISOString(),
    isEneHubPaid: true,
    isFindLocalUnlocked: true,
    hasFindLocalGoogleSheet: false,
    transactions: [],
  },
  isProfileComplete: true,
};

export const authService = {
  getCurrentUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem('genz_current_user');
      if (stored) {
        return JSON.parse(stored) as UserProfile;
      }
      return null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: UserProfile): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    // Backwards compatibility
    localStorage.setItem('genz_current_user', JSON.stringify(user));
  },

  getAllUsers(): UserProfile[] {
    try {
      const stored = localStorage.getItem(USERS_DB_KEY) || localStorage.getItem('genz_users_db');
      if (!stored) return [];
      return JSON.parse(stored) as UserProfile[];
    } catch {
      return [];
    }
  },

  saveUser(user: UserProfile): void {
    if (!user) return;
    localStorage.removeItem('enemind_logged_out');
    const users = this.getAllUsers();
    const targetEmail = (user.email || '').toLowerCase().trim();
    const existingIndex = users.findIndex(
      (u) => (u?.email || '').toLowerCase().trim() === targetEmail
    );
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    localStorage.setItem('genz_users_db', JSON.stringify(users));
    this.setCurrentUser(user);
  },

  updateRoles(email: string, roles: UserRole[]): UserProfile | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    const currentEmail = (user.email || '').toLowerCase().trim();
    const targetEmail = (email || '').toLowerCase().trim();
    if (currentEmail !== targetEmail) return null;
    user.roles = roles;
    this.saveUser(user);
    return user;
  },

  hasRole(user: UserProfile | null, role: UserRole): boolean {
    if (!user) return false;
    if (user.roles?.includes('ENEMIND_ADMIN')) return true;
    return Boolean(user.roles?.includes(role));
  },

  logout(): void {
    localStorage.setItem('enemind_logged_out', 'true');
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem('genz_current_user');
  }
};
