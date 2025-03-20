# KaibanJS: The JavaScript Framework for AI

AI workflows are the future of software development, but building robust, multi-agent systems in JavaScript can be challenging. That’s why we created [KaibanJS](https://github.com/kaiban-ai/KaibanJS), an open-source framework designed to make integrating AI agents into JavaScript applications straightforward, flexible, and powerful.

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

Here’s a basic example of how to use **Kaiban Board** in your project:

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
