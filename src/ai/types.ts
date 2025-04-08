/**
 * Types for the AI interaction layer
 */

/**
 * Response from an AI service
 */
export interface AIResponse {
  /** Main content of the AI response */
  content: string;
  /** Optional suggestions for next steps */
  suggestions?: string[];
  /** Optional files to be created or modified */
  files?: AIFile[];
}

/**
 * File to be created or modified by AI
 */
export interface AIFile {
  /** Path to the file relative to project root */
  path: string;
  /** Content of the file */
  content: string;
}

/**
 * Options for AI interaction
 */
export interface AIInteractionOptions {
  /** Project root directory */
  projectRoot: string;
  /** Model to use for AI interaction */
  model?: string;
  /** Maximum tokens to generate */
  maxTokens?: number;
  /** Temperature for response generation */
  temperature?: number;
}

/**
 * Task interface for AI implementation
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Title of the task */
  title: string;
  /** Detailed description of the task */
  description: string;
  /** Priority of the task (high, medium, low) */
  priority: 'high' | 'medium' | 'low';
  /** Status of the task */
  status: 'todo' | 'in-progress' | 'completed';
}
