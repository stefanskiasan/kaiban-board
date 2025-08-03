import React from 'react';
import ReactDOM from 'react-dom/client';
import reactToWebComponent from 'react-to-webcomponent';
import KaibanBoard, { defaultWebComponentUiSettings } from '../components/KaibanBoard';

// Runtime checks for external dependencies
function checkKaibanJSDependencies() {
  const missing = [];
  
  if (typeof window !== 'undefined') {
    if (!window.KaibanJS) {
      missing.push('KaibanJS');
    }
    if (!window.KaibanJSTools) {
      missing.push('@kaibanjs/tools');
    }
  }
  
  if (missing.length > 0) {
    console.warn(
      `🚨 KaibanBoard Web Component: Missing dependencies: ${missing.join(', ')}\n` +
      'Please load them from CDN before the web component:\n' +
      '<script src="https://unpkg.com/kaibanjs@latest/dist/kaibanjs.umd.js"></script>\n' +
      '<script src="https://unpkg.com/@kaibanjs/tools@latest/dist/tools.umd.js"></script>'
    );
    return false;
  }
  
  return true;
}

// Enhanced KaibanBoard wrapper with dependency checking
const KaibanBoardWithDependencyCheck = (props) => {
  const [hasDependencies, setHasDependencies] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    const checkDeps = () => {
      if (checkKaibanJSDependencies()) {
        setHasDependencies(true);
        setError(null);
      } else {
        setHasDependencies(false);
        setError('Missing KaibanJS dependencies. Please load from CDN first.');
      }
    };
    
    // Check immediately
    checkDeps();
    
    // Also check after a short delay in case scripts are loading
    const timeoutId = setTimeout(checkDeps, 1000);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  if (error) {
    return React.createElement('div', {
      style: {
        padding: '20px',
        background: '#fee',
        border: '1px solid #fcc',
        borderRadius: '8px',
        color: '#d63384',
        fontFamily: 'Arial, sans-serif'
      }
    }, [
      React.createElement('h3', { key: 'title', style: { margin: '0 0 10px 0' } }, '⚠️ Missing Dependencies'),
      React.createElement('p', { key: 'message', style: { margin: '0 0 10px 0' } }, error),
      React.createElement('pre', { 
        key: 'code', 
        style: { 
          background: '#f8f9fa', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto'
        } 
      }, 
      '<!-- Add before kaiban-board element -->\n' +
      '<script src="https://unpkg.com/kaibanjs@latest/dist/kaibanjs.umd.js"></script>\n' +
      '<script src="https://unpkg.com/@kaibanjs/tools@latest/dist/tools.umd.js"></script>'
      )
    ]);
  }
  
  if (!hasDependencies) {
    return React.createElement('div', {
      style: {
        padding: '20px',
        background: '#e3f2fd',
        border: '1px solid #bbdefb',
        borderRadius: '8px',
        color: '#1976d2',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }
    }, '🔄 Loading KaibanJS dependencies...');
  }
  
  return React.createElement(KaibanBoard, props);
};

// Create the Web Component class with dependency checking
const KaibanBoardElement = reactToWebComponent(KaibanBoardWithDependencyCheck, React, ReactDOM, {
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