import { UserProfile } from '../types';

const STORAGE_KEY_CURRENT_USER = 'mind4_current_user_email';
const STORAGE_KEY_USERS_DB = 'mind4_users_db';
const AUTH_KEY = 'mind4_is_authenticated';

// Load the users DB from localStorage
function getUsersDB(): Record<string, UserProfile> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USERS_DB);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to load users DB:', err);
  }
  return {};
}

// Save the users DB to localStorage
function saveUsersDB(db: Record<string, UserProfile>) {
  try {
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(db));
  } catch (err) {
    console.error('Failed to save users DB:', err);
  }
}

// Register a new user with empty profile
export function registerUser(email: string): UserProfile {
  const db = getUsersDB();
  if (db[email]) {
    throw new Error('Email sudah terdaftar');
  }
  
  const newUser: UserProfile = {
    id: 'usr-' + Date.now(),
    name: '',
    birthDate: '',
    position: '',
    photoUrl: '',
    email: email,
    employeeId: '',
    department: '',
    phoneNumber: '',
    joinDate: '',
    bio: '',
  };
  
  db[email] = newUser;
  saveUsersDB(db);
  return newUser;
}

export function getUserByEmail(email: string): UserProfile | null {
  const db = getUsersDB();
  return db[email] || null;
}

export function getSavedUserProfile(): UserProfile {
  try {
    const email = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (email) {
      const user = getUserByEmail(email);
      if (user) return user;
    }
  } catch (err) {
    console.error('Failed to load current user:', err);
  }
  return {
    id: '',
    name: '',
    birthDate: '',
    position: '',
    photoUrl: '',
    email: '',
    employeeId: '',
    department: '',
    phoneNumber: '',
    joinDate: '',
    bio: '',
  };
}

export function saveUserProfile(user: UserProfile): void {
  try {
    const db = getUsersDB();
    db[user.email] = user;
    saveUsersDB(db);
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, user.email);
  } catch (err) {
    console.error('Failed to save user profile to localStorage:', err);
  }
}

export function getSavedAuthState(): boolean {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved !== null) {
      return saved === 'true';
    }
  } catch (err) {
    console.error('Failed to load auth state:', err);
  }
  return false;
}

export function saveAuthState(isAuthenticated: boolean, email?: string): void {
  try {
    localStorage.setItem(AUTH_KEY, String(isAuthenticated));
    if (!isAuthenticated) {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    } else if (email) {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, email);
    }
  } catch (err) {
    console.error('Failed to save auth state:', err);
  }
}
