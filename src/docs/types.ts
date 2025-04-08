import { Task } from '../ai/types.js';
import { Change } from '../context/index.js';

/**
 * Options for the documentation generator
 */
export interface DocGeneratorOptions {
  /** Project root directory */
  projectRoot: string;
  /** Project name */
  projectName: string;
  /** Project description */
  description: string;
}

/**
 * Template variables for document generation
 */
export interface TemplateVariables {
  /** Project name */
  projectName: string;
  /** Project description */
  description: string;
  /** Current date */
  date: string;
  /** Additional custom variables */
  [key: string]: string | number | boolean | object;
}