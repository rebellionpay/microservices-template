export interface ApplicationOptions {
  /**
   * Nest application name.
   */
  name: string;
  /**
   * Nest application author.
   */
  author?: string;
  /**
   * Nest application description.
   */
  description?: string;
  /**
   * Nest application license type
   */
  license?: string;
  /**
   * Nest application destination directory
   */
  directory?: string;
  /**
   * Messaging transport
   */
  transport: 'NATS';
  /**
   * Pure or hybrid application
   */
  pure: boolean;
  /**
   * Nest application version.
   */
  version?: string;
  /**
   * Application language.
   */
  language?: string;
  /**
   * The used package manager.
   */
  packageManager?: 'npm' | 'yarn' | 'undefined';
  /**
   * Nest included production dependencies (comma separated values).
   */
  dependencies?: string;
  /**
   * Nest included development dependencies (comma separated values).
   */
  devDependencies?: string;
  /**
   * Wheter to use persistence or not
   */
  persistence?: boolean;
  /**
   * Database type to use
   */
  persistenceDB?: 'mongodb' | 'postgresql' | 'mysql' | 'other';
}
