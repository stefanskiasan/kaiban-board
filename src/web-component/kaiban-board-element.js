import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';
import KaibanBoard, { defaultWebComponentUiSettings } from '../components/KaibanBoard';

// Create the Web Component class
const KaibanBoardElement = reactToWebComponent(KaibanBoard, React, ReactDOM, {
  // Shadow DOM configuration
  shadow: undefined, // No shadow DOM to allow external styling
  
  // Define prop types for proper type conversion
  props: {
    // JSON props - will be automatically parsed from string attributes
    uiSettings: 'json',
    keys: 'json',
    project: 'json',
    teams: 'json',
    defaultEnvVars: 'json',
    exampleTeams: 'json',
    externalDataStore: 'json',
    
    // String props
    code: 'string',
    
    // Boolean props
    isWebComponent: 'boolean'
  },
  
  // Configure events that should be dispatched
  events: {
    // Team-related events
    onTeamDataUpdate: {
      bubbles: true,
      composed: true
    },
    onTaskStatusUpdate: {
      bubbles: true,
      composed: true
    },
    onWorkflowLogAdd: {
      bubbles: true,
      composed: true
    },
    onWorkflowStatusUpdate: {
      bubbles: true,
      composed: true
    },
    onAgentStatusUpdate: {
      bubbles: true,
      composed: true
    },
    onBatchUpdate: {
      bubbles: true,
      composed: true
    },
    // Output events
    onCodeChange: {
      bubbles: true,
      composed: true
    },
    onTeamChange: {
      bubbles: true,
      composed: true
    },
    onProjectChange: {
      bubbles: true,
      composed: true
    }
  }
});

// Define the custom element
if (!customElements.get('kaiban-board')) {
  customElements.define('kaiban-board', KaibanBoardElement);
}

// Export for ES modules
export default KaibanBoardElement;
export { KaibanBoardElement };