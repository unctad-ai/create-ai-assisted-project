import { Task } from '../ai/types.js';

/**
 * Options for the workflow manager
 */
export interface WorkflowOptions {
  /** Project root directory */
  projectRoot: string;
  /** Workflow mode */
  mode: 'plan' | 'dev' | 'review';
}

/**
 * Session state for the workflow
 */
export interface SessionState {
  /** Current task being worked on */
  currentTask?: Task;
  /** Current phase of the workflow */
  phase: 'planning' | 'development' | 'review';
  /** Start time of the session */
  startTime: number;
  /** List of changes made during the session */
  changes: SessionChange[];
}

/**
 * Change made during a session
 */
export interface SessionChange {
  /** Type of change */
  type: 'file' | 'task' | 'doc';
  /** Path of the changed file or task ID */
  path: string;
  /** Description of the change */
  description: string;
  /** Timestamp of the change */
  timestamp: number;
}
