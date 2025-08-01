# KaibanBoard Web Component Usage Guide

This guide demonstrates how to use the KaibanBoard as a web component in vanilla HTML/JavaScript projects.

## Installation

### Option 1: Using the NPM Package

```bash
npm install kaiban-board
```

Then import the web component:

```javascript
import 'kaiban-board/web-component';
// CSS is included in the component
```

### Option 2: Using CDN (Standalone)

```html
<!-- Include the web component bundle -->
<script src="https://unpkg.com/kaiban-board/dist/kaiban-board-element.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/kaiban-board/dist/kaiban-board-element.css">
```

## Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <title>KaibanBoard Web Component Example</title>
</head>
<body>
  <!-- Use the kaiban-board element -->
  <kaiban-board 
    id="myKaibanBoard"
    code="console.log('Hello from KaibanBoard!');"
    is-web-component="true">
  </kaiban-board>

  <script>
    // Get reference to the element
    const kaibanBoard = document.getElementById('myKaibanBoard');
    
    // Listen to events
    kaibanBoard.addEventListener('code-change', (event) => {
      console.log('Code changed:', event.detail.code);
    });
  </script>
</body>
</html>
```

## Attributes and Properties

All properties can be set as attributes (kebab-case) or properties (camelCase):

### String Attributes

- `code` - The code content for the editor

### Boolean Attributes

- `is-web-component` - Set to "true" to enable web component mode

### JSON Attributes

These attributes accept JSON strings:

- `ui-settings` - UI configuration options
- `keys` - API keys configuration
- `project` - Project metadata
- `teams` - Team configurations
- `default-env-vars` - Default environment variables
- `example-teams` - Example team configurations
- `external-data-store` - External data store configuration

### Example with JSON Attributes

```html
<kaiban-board
  code="// Your code here"
  ui-settings='{"showFullScreen": true, "showExampleMenu": false}'
  keys='{"openai": "sk-..."}'
  project='{"name": "My Project", "description": "A cool project"}'
  teams='[{"id": "1", "name": "Team Alpha"}]'
  is-web-component="true">
</kaiban-board>
```

## Setting Properties via JavaScript

```javascript
const kaibanBoard = document.querySelector('kaiban-board');

// Set simple properties
kaibanBoard.code = 'console.log("Hello World!");';
kaibanBoard.isWebComponent = true;

// Set complex properties (objects/arrays)
kaibanBoard.uiSettings = {
  showFullScreen: true,
  showExampleMenu: false,
  showShareOption: true,
  isPreviewMode: false
};

kaibanBoard.teams = [
  {
    id: '1',
    name: 'Development Team',
    agents: [
      { name: 'Agent 1', role: 'Developer' },
      { name: 'Agent 2', role: 'Tester' }
    ]
  }
];

kaibanBoard.project = {
  name: 'My AI Project',
  description: 'Building an awesome AI application'
};
```

## Events

The KaibanBoard web component dispatches several custom events:

### Team and Workflow Events

```javascript
// Team data updates
kaibanBoard.addEventListener('team-data-update', (event) => {
  console.log('Team data updated:', event.detail.externalData);
});

// Task status updates
kaibanBoard.addEventListener('task-status-update', (event) => {
  console.log('Task status updated:', event.detail.externalData);
});

// Workflow log additions
kaibanBoard.addEventListener('workflow-log-add', (event) => {
  console.log('Workflow log added:', event.detail.externalData);
});

// Workflow status updates
kaibanBoard.addEventListener('workflow-status-update', (event) => {
  console.log('Workflow status updated:', event.detail.externalData);
});

// Agent status updates
kaibanBoard.addEventListener('agent-status-update', (event) => {
  console.log('Agent status updated:', event.detail.externalData);
});

// Batch updates
kaibanBoard.addEventListener('batch-update', (event) => {
  console.log('Batch update:', event.detail.externalData);
});
```

### Output Events

```javascript
// Code changes
kaibanBoard.addEventListener('code-change', (event) => {
  console.log('Code changed:', event.detail.code);
});

// Team changes
kaibanBoard.addEventListener('team-change', (event) => {
  console.log('Team changed:', event.detail.team);
});

// Project changes
kaibanBoard.addEventListener('project-change', (event) => {
  console.log('Project changed:', event.detail.project);
});
```

## Advanced Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Advanced KaibanBoard Example</title>
  <style>
    kaiban-board {
      display: block;
      width: 100%;
      height: 600px;
    }
  </style>
</head>
<body>
  <h1>KaibanBoard Web Component Demo</h1>
  
  <kaiban-board id="kaibanBoard"></kaiban-board>

  <script>
    // Get the element
    const board = document.getElementById('kaibanBoard');
    
    // Configure the board
    board.isWebComponent = true;
    
    board.uiSettings = {
      showFullScreen: true,
      showExampleMenu: true,
      showShareOption: false,
      showSettingsOption: true,
      isPreviewMode: false,
      showWelcomeInfo: true
    };
    
    board.code = `
// Welcome to KaibanBoard!
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
    `.trim();
    
    board.project = {
      name: 'AI Assistant Project',
      description: 'Building an intelligent assistant',
      version: '1.0.0'
    };
    
    board.teams = [
      {
        id: 'team-1',
        name: 'AI Development Team',
        agents: [
          {
            id: 'agent-1',
            name: 'Code Assistant',
            role: 'Developer',
            capabilities: ['coding', 'debugging']
          },
          {
            id: 'agent-2',
            name: 'Test Assistant',
            role: 'QA Engineer',
            capabilities: ['testing', 'validation']
          }
        ]
      }
    ];
    
    board.keys = {
      openai: 'your-api-key-here',
      anthropic: 'your-api-key-here'
    };
    
    // Set up event listeners
    board.addEventListener('code-change', (event) => {
      console.log('Code updated:', event.detail.code);
      // You could save this to a backend, localStorage, etc.
    });
    
    board.addEventListener('team-change', (event) => {
      console.log('Team configuration changed:', event.detail.team);
    });
    
    board.addEventListener('workflow-status-update', (event) => {
      console.log('Workflow status:', event.detail.externalData);
    });
    
    // Example: Update external data store
    board.externalDataStore = {
      userId: 'user-123',
      sessionId: 'session-456',
      preferences: {
        theme: 'dark',
        autoSave: true
      }
    };
  </script>
</body>
</html>
```

## TypeScript Support

If you're using TypeScript, the web component includes type definitions:

```typescript
import 'kaiban-board/web-component';
import type { KaibanBoardElement } from 'kaiban-board/web-component';

const board = document.querySelector<KaibanBoardElement>('kaiban-board');

if (board) {
  // TypeScript will provide proper type checking
  board.uiSettings = {
    showFullScreen: true,
    showExampleMenu: false
  };
  
  board.addEventListener('code-change', (event) => {
    // event is properly typed as CustomEvent<CodeChangeDetail>
    console.log(event.detail.code);
  });
}
```

## Framework Integration

### Vue.js

```vue
<template>
  <kaiban-board
    :code="code"
    :ui-settings="JSON.stringify(uiSettings)"
    is-web-component="true"
    @code-change="handleCodeChange"
  />
</template>

<script>
import 'kaiban-board/web-component';

export default {
  data() {
    return {
      code: 'console.log("Hello from Vue!");',
      uiSettings: {
        showFullScreen: true
      }
    };
  },
  methods: {
    handleCodeChange(event) {
      console.log('Code changed:', event.detail.code);
    }
  }
};
</script>
```

### Angular

```typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import 'kaiban-board/web-component';
import type { KaibanBoardElement } from 'kaiban-board/web-component';

@Component({
  selector: 'app-kaiban-demo',
  template: `
    <kaiban-board #kaibanBoard
      [attr.code]="code"
      [attr.ui-settings]="uiSettingsJson"
      is-web-component="true"
      (code-change)="onCodeChange($event)"
    ></kaiban-board>
  `
})
export class KaibanDemoComponent implements AfterViewInit {
  @ViewChild('kaibanBoard') kaibanBoardRef!: ElementRef<KaibanBoardElement>;
  
  code = 'console.log("Hello from Angular!");';
  uiSettingsJson = JSON.stringify({ showFullScreen: true });
  
  ngAfterViewInit() {
    const board = this.kaibanBoardRef.nativeElement;
    // Direct property access is also available
    board.uiSettings = { showFullScreen: true };
  }
  
  onCodeChange(event: any) {
    console.log('Code changed:', event.detail.code);
  }
}
```

## Browser Support

The KaibanBoard web component uses Custom Elements v1 and requires:

- Chrome/Edge 54+
- Firefox 63+
- Safari 10.1+

For older browsers, include the Custom Elements polyfill:

```html
<script src="https://unpkg.com/@webcomponents/custom-elements@1.5.0/custom-elements.min.js"></script>
```

## Building from Source

To build the web component from source:

```bash
# Clone the repository
git clone https://github.com/your-org/kaiban-board.git
cd kaiban-board

# Install dependencies
npm install

# Build the web component
npm run build:webcomponent

# Build everything (React component + web component)
npm run build:all
```

The built files will be in the `dist/` directory:
- `kaiban-board-element.js` - UMD build
- `kaiban-board-element.esm.js` - ES Module build
- `kaiban-board-element.min.js` - Minified IIFE build
- `kaiban-board-element.css` - Styles

## Troubleshooting

### Styles not loading
Make sure to include the CSS file if using the JavaScript-only bundle:
```html
<link rel="stylesheet" href="path/to/kaiban-board-element.css">
```

### JSON attributes not parsing
Ensure JSON attributes use single quotes around the attribute value and properly escaped internal quotes:
```html
<!-- Correct -->
<kaiban-board ui-settings='{"key": "value"}'></kaiban-board>

<!-- Also correct (escaped) -->
<kaiban-board ui-settings="{&quot;key&quot;: &quot;value&quot;}"></kaiban-board>
```

### Events not firing
Make sure `is-web-component` is set to `"true"` to enable web component event dispatching:
```html
<kaiban-board is-web-component="true"></kaiban-board>
```