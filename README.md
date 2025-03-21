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
