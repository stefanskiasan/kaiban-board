# KaibanJS: The JavaScript Framework for AI

AI workflows are the future of software development, but building robust, multi-agent systems in JavaScript can be challenging. That's why we created [KaibanJS](https://github.com/kaiban-ai/KaibanJS), an open-source framework designed to make integrating AI agents into JavaScript applications straightforward, flexible, and powerful.

With [KaibanJS](https://github.com/kaiban-ai/KaibanJS), you have the freedom to build AI-powered systems without being tied down by specific platforms or ecosystems. It's built from the ground up for JavaScript developers, with the MIT License, allowing you to freely use, modify, and deploy it wherever you need.

---

## Kaiban Board: An Experimental Visualizer for Your AI Agents

While KaibanJS provides the framework to build your AI workflows, visualizing those workflows can be time-consuming and complex. To address this, we developed **Kaiban Board**—an experimental UI designed to help you **visualize, manage, and share** your AI agent teams in a Kanban-style interface.

### Kaiban Board UI License

We believe in the power of open source and community-driven development. That's why Kaiban Board is completely open source under the MIT license. You can use it, modify it, and deploy it however you want, whether locally or on your own infrastructure.

This means you have:
- Complete freedom to modify and customize the code
- Full control over your data and where you host it
- The ability to contribute back to the project
- No restrictions on commercial or personal use

> We're committed to keeping Kaiban Board open source and free for everyone to use and improve.

---

## How to Use it

To get started with the **Kaiban Board**, follow these steps:

### Install Kaiban Board

```bash
npm install kaiban-board
```

### Usage Example

Here's a basic example of how to use **Kaiban Board** in your project:

```jsx
import 'kaiban-board/dist/index.css';  // Import the minified CSS
import KaibanBoard from 'kaiban-board';  // Import the minified JS

const teams = [
  // Define your teams and tasks here
];

const uiSettings = {
  //showWelcomeInfo: false,
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

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Local Development
1. Clone the repository:
```bash
git clone https://github.com/your-username/kaiban-board.git
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
Edit `.env.local` and add your API keys (see [Supported Integrations](#supported-integrations) for required keys).

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open Storybook (optional):
```bash
npm run storybook
# or
yarn storybook
```

### Building for Production
```bash
npm run build
# or
yarn build
```

## Contributing

We love your input! We want to make contributing to Kaiban Board as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

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

## Supported Integrations

Kaiban Board integrates with various AI and development tools. Here's a list of supported integrations and how to obtain their API keys:

### AI Services
- **OpenAI** 
  - Used for: Core AI capabilities and text generation
  - Get key from: [OpenAI Platform](https://platform.openai.com/account/api-keys)
  - Environment variable: `VITE_OPENAI_API_KEY` or `NEXT_PUBLIC_OPENAI_API_KEY`

- **Tavily**
  - Used for: Advanced web search capabilities
  - Get key from: [Tavily](https://tavily.com)
  - Environment variable: `VITE_TAVILY_API_KEY` or `NEXT_PUBLIC_TAVILY_API_KEY`

- **Serper**
  - Used for: Real-time search results
  - Get key from: [Serper.dev](https://serper.dev)
  - Environment variable: `VITE_SERPER_API_KEY` or `NEXT_PUBLIC_SERPER_API_KEY`

- **Exa**
  - Used for: Enhanced search capabilities
  - Get key from: [Exa.ai](https://exa.ai)
  - Environment variable: `VITE_EXA_API_KEY` or `NEXT_PUBLIC_EXA_API_KEY`

- **Wolfram Alpha**
  - Used for: Mathematical and scientific computations
  - Get key from: [Wolfram Developer Portal](https://developer.wolframalpha.com)
  - Environment variable: `VITE_WOLFRAM_APP_ID` or `NEXT_PUBLIC_WOLFRAM_APP_ID`

### Infrastructure
- **Firebase**
  - Used for: Data storage and sharing capabilities
  - Setup: Create a project at [Firebase Console](https://console.firebase.google.com)
  - Required variables:
    ```
    VITE_FIREBASE_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN
    VITE_FIREBASE_PROJECT_ID
    VITE_FIREBASE_STORAGE_BUCKET
    VITE_FIREBASE_MESSAGING_SENDER_ID
    VITE_FIREBASE_APP_ID
    VITE_FIREBASE_MEASUREMENT_ID
    ```

### Optional Services
- **Firecrawl**
  - Used for: Enhanced web crawling capabilities
  - Environment variable: `VITE_FIRECRAWL_API_KEY` or `NEXT_PUBLIC_FIRECRAWL_API_KEY`

---

## Feedback and Future Development

We're in the **early stages** of **Kaiban Board's** development, and your feedback is essential in helping us shape its future. As an open-source project, we welcome contributions from the community, whether it's bug reports, feature requests, or pull requests.

If you have suggestions or run into issues, please open an issue on our GitHub repository. We're committed to ensuring Kaiban Board evolves based on community feedback and needs.

---

## License

Both **KaibanJS** (the framework) and **Kaiban Board** (the visualizer) are licensed under the **MIT License**, giving you full freedom to:

- Use the software for any purpose
- Study how the software works and modify it
- Redistribute the software
- Make and distribute modifications to the software

This applies to both personal and commercial projects. See the [LICENSE](LICENSE.md) file for the complete license text.

For any questions or support, feel free to:
- Open an issue on GitHub
- Join our community discussions
- Contribute to the project
