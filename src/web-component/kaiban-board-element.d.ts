/// <reference types="react" />

export interface KaibanBoardUISettings {
  showFullScreen?: boolean;
  showExampleMenu?: boolean;
  showShareOption?: boolean;
  showSettingsOption?: boolean;
  showExampleTeams?: boolean;
  maximizeConfig?: {
    isActive?: boolean;
    scrollPosition?: number;
  };
  isPreviewMode?: boolean;
  showSimpleShareOption?: boolean;
  showWelcomeInfo?: boolean;
  selectedTab?: number;
}

export interface KaibanBoardKeys {
  [key: string]: string;
}

export interface KaibanBoardProject {
  name?: string;
  description?: string;
  [key: string]: any;
}

export interface KaibanBoardTeam {
  id?: string;
  name?: string;
  agents?: any[];
  [key: string]: any;
}

export interface KaibanBoardDefaultEnvVars {
  [key: string]: string;
}

export interface KaibanBoardExternalDataStore {
  [key: string]: any;
}

// Event detail types
export interface TeamDataUpdateDetail {
  externalData: any;
}

export interface TaskStatusUpdateDetail {
  externalData: any;
}

export interface WorkflowLogAddDetail {
  externalData: any;
}

export interface WorkflowStatusUpdateDetail {
  externalData: any;
}

export interface AgentStatusUpdateDetail {
  externalData: any;
}

export interface BatchUpdateDetail {
  externalData: any;
}

export interface CodeChangeDetail {
  code: string;
}

export interface TeamChangeDetail {
  team: KaibanBoardTeam;
}

export interface ProjectChangeDetail {
  project: KaibanBoardProject;
}

// Custom element event map
interface KaibanBoardEventMap {
  'team-data-update': CustomEvent<TeamDataUpdateDetail>;
  'task-status-update': CustomEvent<TaskStatusUpdateDetail>;
  'workflow-log-add': CustomEvent<WorkflowLogAddDetail>;
  'workflow-status-update': CustomEvent<WorkflowStatusUpdateDetail>;
  'agent-status-update': CustomEvent<AgentStatusUpdateDetail>;
  'batch-update': CustomEvent<BatchUpdateDetail>;
  'code-change': CustomEvent<CodeChangeDetail>;
  'team-change': CustomEvent<TeamChangeDetail>;
  'project-change': CustomEvent<ProjectChangeDetail>;
}

// Augment the HTMLElementTagNameMap
declare global {
  interface HTMLElementTagNameMap {
    'kaiban-board': KaibanBoardElement;
  }
}

// Custom element class definition
export declare class KaibanBoardElement extends HTMLElement {
  // Properties (attributes)
  uiSettings?: KaibanBoardUISettings | string;
  code?: string;
  keys?: KaibanBoardKeys | string;
  project?: KaibanBoardProject | string;
  teams?: KaibanBoardTeam[] | string;
  defaultEnvVars?: KaibanBoardDefaultEnvVars | string;
  exampleTeams?: KaibanBoardTeam[] | string;
  isWebComponent?: boolean;
  externalDataStore?: KaibanBoardExternalDataStore | string;

  // Event listeners
  addEventListener<K extends keyof KaibanBoardEventMap>(
    type: K,
    listener: (this: KaibanBoardElement, ev: KaibanBoardEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof KaibanBoardEventMap>(
    type: K,
    listener: (this: KaibanBoardElement, ev: KaibanBoardEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

// Export the element as default
export default KaibanBoardElement;