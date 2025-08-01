<!-- # Kaiban Board: Visualize Your AI Agent Teams -->

<p align="center">
  <a href="https://www.kaibanjs.com/#playground">  
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://res.cloudinary.com/dnno8pxyy/image/upload/v1724533982/icon_htfer2.png">
      <img src="https://res.cloudinary.com/dnno8pxyy/image/upload/v1724533982/icon_htfer2.png" height="128">
    </picture>
    <h1 align="center">Kaiban Board</h1>
    <h3 align="center">The Visual Interface for Managing AI Agent Teams</h3>
  </a>
</p>

<p align="center">
  <a href="https://github.com/kaiban-ai/kaiban-board">
    <img src="https://img.shields.io/github/stars/kaiban-ai/kaiban-board.svg?style=social" alt="Star on GitHub">
  </a>
  <a href="https://github.com/kaiban-ai/kaiban-board/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license">
  </a>
  <a href="https://www.npmjs.com/package/kaiban-board">
    <img src="https://img.shields.io/npm/v/kaiban-board.svg?style=flat" alt="npm version">
  </a>
  <a href="https://github.com/kaiban-ai/kaiban-board/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
  </a>
</p>

---

## Kanban for AI Agents? 🤖📋

**Kaiban Board** is an experimental UI designed to help you **visualize, manage, and share** your AI agent teams in a Kanban-style interface. Built on top of [KaibanJS](https://github.com/kaiban-ai/KaibanJS), it provides a powerful way to:

- 🔨 Create and manage AI agent teams visually
- 📊 Track tasks and workflows in real-time
- 🤝 Collaborate with your AI agents
- 🎯 Monitor progress and performance
- 🔍 Debug and optimize your AI workflows

[![Quick Start Video](https://github.com/user-attachments/assets/5dd06a39-5e51-4e9c-a5ef-552c3003bfbb)](https://youtu.be/NFpqFEl-URY?si=_JCkJuprRxqD0Uo 'Quick Start Video')

## Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Local Development
1. Clone the repository:
```bash
git clone https://github.com/kaiban-ai/kaiban-board.git
cd kaiban-board
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your API keys.

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

### Testing with Storybook

Storybook provides an isolated environment to develop and test the Kaiban Board component:

1. Start Storybook:
```bash
npm run storybook
# or
yarn storybook
```

2. Open your browser and navigate to `http://localhost:6006`


## Manual Installation and Usage

If you prefer to set up Kaiban Board manually follow these steps:

<details style="margin-bottom:10px;">
  <summary><b style="color:black;">1. Install Kaiban Board via npm:</b></summary>

```bash
npm install kaiban-board
```

</details>

<details style="margin-bottom:10px;">
  <summary><b style="color:black;">2. Import Kaiban Board in your JavaScript file:</b></summary>

```jsx
// Using ES6 import syntax for NextJS, React, etc.
import KaibanBoard from 'kaiban-board';
import 'kaiban-board/dist/index.css';
```

</details>

<details style="margin-bottom:10px;">
  <summary><b style="color:black;">3. Basic Usage Example</b></summary>

```jsx
const teams = [
  // Define your teams and tasks here
];

const uiSettings = {
  //showWelcomeInfo: false
};

function App() {
  return (
    <div>
      <KaibanBoard teams={teams} uiSettings={uiSettings} />
    </div>
  );
}

export default App;
```

</details>

## Web Component Usage

Kaiban Board is also available as a Web Component, making it framework-agnostic and easy to integrate into any web application.

<details style="margin-bottom:10px;">
  <summary><b style="color:black;">1. Using the Web Component</b></summary>

```html
<!DOCTYPE html>
<html>
<head>
  <title>Kaiban Board Web Component</title>
</head>
<body>
  <!-- Add the Kaiban Board element -->
  <kaiban-board
    theme="dark"
    primary-color="#3B82F6"
    show-basic-examples="true"
    show-ai-examples="true"
  ></kaiban-board>

  <!-- Load the Web Component -->
  <script type="module" src="./node_modules/kaiban-board/dist/kaiban-board-element.js"></script>
</body>
</html>
```

</details>

<details style="margin-bottom:10px;">
  <summary><b style="color:black;">2. Theme Customization</b></summary>

The Web Component supports extensive theming through attributes and CSS variables:

```html
<kaiban-board
  theme="light"
  primary-color="#6366F1"
  secondary-color="#10B981"
  background-color="#F3F4F6"
  font-family="Inter, sans-serif"
  border-radius="12px"
  card-shadow="0 4px 6px rgba(0, 0, 0, 0.1)"
></kaiban-board>
```

You can also use CSS custom properties:

```html
<kaiban-board css-variables='{"--kb-header-height": "60px", "--kb-sidebar-width": "280px"}'></kaiban-board>
```

</details>

<details style="margin-bottom:10px;">
  <summary><b style="color:black;">3. Menu Configuration</b></summary>

Control which menu items are visible:

```html
<kaiban-board
  show-basic-examples="true"
  show-ai-examples="false"
  show-orchestration-examples="true"
  show-chatbot="false"
  show-example-teams="true"
  show-share-option="true"
  show-settings-option="true"
  show-fullscreen="true"
></kaiban-board>
```

Or use JavaScript to control menus programmatically:

```javascript
const board = document.querySelector('kaiban-board');

// Show/hide specific menus
board.showMenu('basic', true);
board.showMenu('ai', false);

// Hide all example menus
board.hideAllMenus();

// Configure multiple settings at once
board.setMenuConfig({
  showBasicExamplesMenu: true,
  showAIPoweredExamplesMenu: false,
  showChatBotMenu: false
});
```

</details>

## Viewer Mode (External Data Integration)

Viewer mode allows you to use Kaiban Board as a read-only viewer for external KaibanJS workflows. This is perfect for monitoring AI agent progress from external systems.

<details style="margin-bottom:10px;">
  <summary><b style="color:black;">1. Basic Viewer Mode Setup</b></summary>

```html
<kaiban-board
  id="kaibanViewer"
  viewer-mode="true"
  show-setup-team="false"
  disable-workflow-controls="true"
  initial-tab="1"
></kaiban-board>

<script type="module">
  const board = document.getElementById('kaibanViewer');
  
  // Set initial team data
  board.setTeamData({
    teams: [{
      name: 'AI Support Team',
      agents: [
        {
          id: 'agent-1',
          name: 'Support Manager',
          role: 'Team Lead',
          status: 'idle'
        }
      ],
      tasks: [
        {
          id: 'task-1',
          title: 'Process support tickets',
          assignedTo: 'Support Manager',
          status: 'todo'
        }
      ]
    }]
  });
</script>
```

</details>

<details style="margin-bottom:10px;">
  <summary><b style="color:black;">2. External Updates and Integration</b></summary>

Update task status, agent status, and workflow progress from external sources:

```javascript
// Update task status
board.updateTaskStatus('task-1', 'doing');
board.updateTaskStatus('task-1', 'done');

// Update agent status
board.updateAgentStatus('agent-1', 'working');
board.updateAgentStatus('agent-1', 'thinking');

// Set workflow status
board.setWorkflowStatus('RUNNING');
board.setWorkflowStatus('FINISHED');

// Add workflow logs
board.addWorkflowLog({
  message: 'Processing customer request',
  logType: 'TaskUpdate',
  level: 'info',
  timestamp: Date.now()
});

// Batch updates for efficiency
board.batchUpdate({
  tasks: [
    { id: 'task-1', status: 'done' },
    { id: 'task-2', status: 'doing' }
  ],
  workflowStatus: 'RUNNING',
  workflowLogs: [
    { message: 'Batch update completed', level: 'success' }
  ]
});
```

</details>

<details style="margin-bottom:10px;">
  <summary><b style="color:black;">3. Integration with External KaibanJS</b></summary>

Connect Kaiban Board viewer to an external KaibanJS instance:

```javascript
import { Team } from 'kaibanjs';

// Your external KaibanJS team
const externalTeam = new Team({
  name: 'External AI Team',
  agents: [...],
  tasks: [...]
});

// Connect to Kaiban Board viewer
const board = document.querySelector('kaiban-board');

// Sync events from KaibanJS to the viewer
externalTeam.on('workflow:start', () => {
  board.setWorkflowStatus('RUNNING');
});

externalTeam.on('task:statusChange', (task) => {
  board.updateTaskStatus(task.id, task.status);
});

externalTeam.on('workflow:log', (log) => {
  board.addWorkflowLog(log);
});

externalTeam.on('agent:statusChange', (agent) => {
  board.updateAgentStatus(agent.id, agent.status);
});

externalTeam.on('workflow:complete', (results) => {
  board.setWorkflowStatus('FINISHED');
});

// Start the external workflow
externalTeam.start();
```

</details>

<details style="margin-bottom:10px;">
  <summary><b style="color:black;">4. Viewer Mode Attributes</b></summary>

| Attribute | Description | Default |
|-----------|-------------|---------|
| `viewer-mode` | Enable viewer mode | `false` |
| `show-setup-team` | Show/hide Setup Team tab | `true` |
| `show-results-tab` | Show/hide Results tab | `true` |
| `disable-workflow-controls` | Disable start/stop workflow buttons | `false` |
| `initial-tab` | Initial tab to display (0-2) | `0` |
| `read-only` | Make the board read-only | `false` |

</details>

<details style="margin-bottom:10px;">
  <summary><b style="color:black;">5. Full Example: Monitoring Dashboard</b></summary>

Create a monitoring dashboard for multiple AI teams:

```html
<!DOCTYPE html>
<html>
<head>
  <title>AI Team Monitoring Dashboard</title>
  <style>
    .dashboard {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 20px;
    }
    kaiban-board {
      height: 500px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="dashboard">
    <!-- Customer Support Team -->
    <kaiban-board
      id="supportTeam"
      viewer-mode="true"
      theme="light"
      primary-color="#10B981"
    ></kaiban-board>

    <!-- Development Team -->
    <kaiban-board
      id="devTeam"
      viewer-mode="true"
      theme="dark"
      primary-color="#6366F1"
    ></kaiban-board>
  </div>

  <script type="module">
    // Import your KaibanJS teams
    import { supportTeam, devTeam } from './teams.js';
    
    // Connect viewers to teams
    const supportBoard = document.getElementById('supportTeam');
    const devBoard = document.getElementById('devTeam');
    
    // Set up real-time synchronization
    supportTeam.on('update', (data) => {
      supportBoard.batchUpdate(data);
    });
    
    devTeam.on('update', (data) => {
      devBoard.batchUpdate(data);
    });
    
    // Start monitoring
    supportTeam.startMonitoring();
    devTeam.startMonitoring();
  </script>
</body>
</html>
```

</details>

## Community and Support

Join the [Discord community](https://www.kaibanjs.com/discord) to connect with other developers and get support. [Follow us](https://x.com/kaibanjs) on Twitter for the latest updates.

## Contributing

We welcome contributions from the community. Please read the [contributing guidelines](https://github.com/kaiban-ai/kaiban-board/blob/main/CONTRIBUTING.md) before submitting pull requests.

### Development Process
1. Fork the repo and create your branch from `main`
2. Make your changes and test them thoroughly
3. Ensure your code lints (`npm run lint`)
4. Issue a pull request

### Pull Request Process
1. Update the README.md with details of changes if needed
2. Update the .env.example if you've added new environment variables
3. The PR will be merged once you have the sign-off of at least one maintainer

### Code Style
- Use Prettier for code formatting
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic

## License

Kaiban Board is MIT licensed. See the [LICENSE](LICENSE.md) file for the complete license text.

For any questions or support, feel free to:
- Open an issue on GitHub
- Join our community discussions
- Contribute to the project
