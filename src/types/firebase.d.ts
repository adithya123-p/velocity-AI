// Firebase SDK ambient module declarations for TypeScript
declare module 'firebase/app' {
  export interface FirebaseApp {
    name: string;
    options: Record<string, unknown>;
  }
  export function initializeApp(config: Record<string, unknown>): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export function getApp(): FirebaseApp;
}

declare module 'firebase/firestore/lite' {
  export interface Firestore {
    type: string;
    app: unknown;
  }
  export function getFirestore(app?: unknown): Firestore;
  export function doc(firestore: Firestore, ...pathSegments: string[]): unknown;
  export function getDoc(docRef: unknown): Promise<{
    exists(): boolean;
    data(): Record<string, unknown> | undefined;
  }>;
  export function setDoc(docRef: unknown, data: Record<string, unknown>, options?: { merge?: boolean }): Promise<void>;
  export function collection(firestore: Firestore, ...pathSegments: string[]): unknown;
}

declare module 'firebase/auth' {
  export interface Auth {
    currentUser: unknown;
  }
  export function getAuth(app?: unknown): Auth;
}

declare module 'firebase/analytics' {
  export function getAnalytics(app?: unknown): unknown;
}
