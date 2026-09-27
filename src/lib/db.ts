import fs from 'fs';
import path from 'path';
import { Goal, UserProfile, AppNotification, RescheduleEvent } from './types';
import { INITIAL_GOALS, INITIAL_PROFILE, INITIAL_NOTIFICATIONS } from './mockData';

export interface DBUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  avatarColor?: string;
  role?: string;
  bio?: string;
}

export interface DBSchema {
  version: string;
  connectedAt: string;
  users: DBUser[];
  goals: Record<string, Goal[]>; // keyed by userId
  profiles: Record<string, UserProfile>; // keyed by userId
  notifications: Record<string, AppNotification[]>; // keyed by userId
  rescheduleEvents: Record<string, RescheduleEvent[]>; // keyed by userId
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'velocity_db.json');

// Initial seed data
const DEFAULT_USER_ID = 'demo-user-1';

function getDefaultDB(): DBSchema {
  return {
    version: '1.0.0',
    connectedAt: new Date().toISOString(),
    users: [
      {
        id: DEFAULT_USER_ID,
        name: 'Alex Rivera',
        email: 'alex.rivera@velocity.ai',
        passwordHash: '1qoo_velocity_demo',
        createdAt: new Date().toISOString(),
        avatarColor: '#6366F1',
        role: 'Full Stack Engineer & AI Enthusiast',
        bio: 'Pushing code and personal velocity forward every day.'
      }
    ],
    goals: {
      [DEFAULT_USER_ID]: [...INITIAL_GOALS]
    },
    profiles: {
      [DEFAULT_USER_ID]: { ...INITIAL_PROFILE }
    },
    notifications: {
      [DEFAULT_USER_ID]: [...INITIAL_NOTIFICATIONS]
    },
    rescheduleEvents: {
      [DEFAULT_USER_ID]: []
    }
  };
}

// In-memory cache + file sync with atomic writes
let memoryDB: DBSchema | null = null;
let writeQueue: Promise<void> = Promise.resolve();

export async function getDB(): Promise<DBSchema> {
  if (memoryDB) {
    return memoryDB;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDB = JSON.parse(content);
      return memoryDB!;
    }
  } catch (err) {
    console.warn('[Database] Error reading database file, initializing defaults:', err);
  }

  memoryDB = getDefaultDB();
  await persistDB(memoryDB);
  return memoryDB;
}

export async function persistDB(db: DBSchema): Promise<void> {
  memoryDB = db;
  // Queue writes sequentially to prevent file corruption
  writeQueue = writeQueue.then(async () => {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('[Database] Failed to write database to disk:', err);
    }
  });
  return writeQueue;
}

export async function getDBStats() {
  const db = await getDB();
  const totalGoals = Object.values(db.goals).reduce((acc, g) => acc + g.length, 0);
  const totalNotifs = Object.values(db.notifications).reduce((acc, n) => acc + n.length, 0);
  const totalEvents = Object.values(db.rescheduleEvents).reduce((acc, e) => acc + e.length, 0);

  return {
    status: 'connected',
    provider: 'Persistent JSON Store (Zero-Config Embedded Database)',
    filePath: DB_FILE,
    connectedSince: db.connectedAt,
    usersCount: db.users.length,
    goalsCount: totalGoals,
    notificationsCount: totalNotifs,
    rescheduleEventsCount: totalEvents,
    lastSync: new Date().toISOString()
  };
}
