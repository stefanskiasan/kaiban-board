# KaibanJS: The JavaScript Framework for AI
Workflows

AI workflows are the future of software development, but building robust, multi-agent systems in JavaScript can be challenging. That’s why we created **KaibanJS**, an open-source framework designed to make integrating AI agents into JavaScript applications straightforward, flexible, and powerful.

With **KaibanJS**, you have the freedom to build AI-powered systems without being tied down by specific platforms or ecosystems. It's built from the ground up for JavaScript developers, with the MIT License, allowing you to freely use, modify, and deploy it wherever you need.

---

## Kaiban Board: An Experimental Visualizer for Your AI Agents

While KaibanJS provides the framework to build your AI workflows, visualizing those workflows can be time-consuming and complex. To address this, we developed **Kaiban Board**—an experimental UI designed to help you **visualize, manage, and share** your AI agent teams in a Kanban-style interface.

### Kaiban Board UI License

We could have easily built a SaaS platform with free and paid tiers, as many others do. But instead, we understand that developers want full control over their AI projects, including how they handle data and where they choose to host their solutions. 

That’s why we’re giving you a **free-to-use and integrate UI** that you can run **locally** or **deploy wherever you choose**. Think of Kaiban Board as being able to run your own Vercel-like infrastructure for AI agents—completely under your own infrastructure. 

> The Kaiban Board is not as huge as Vercel by now... But I just couldn't think of a better comparison. :)

As we continue to experiment with Kaiban Board, we’ll keep refining the distribution based on your feedback and needs. 

This experimental approach gives you the freedom to deploy Kaiban Board on your own terms, without locking you into any specific platform. And to us to figure it out the best way to distribute it. 

Over time, we’ll adjust the distribution strategy based on your input and what works best for everyone.

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
import 'kaibanjs-ui/dist/index.css';  // Import the minified CSS
import KaibanBoard from 'kaiban-board';  // Import the minified JS

const teams = [
  // Define your teams and tasks here
];

const uiSettings = {
  fullScreen: true,
  showExampleMenu: true,
  showShareOption: true,
  showSettingsOption: true,
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

We’re in the **early stages** of **Kaiban Board’s** development, and your feedback is essential in helping us shape the future of both the UI and how we distribute it. As we experiment with this tool, we’ll continue learning and iterating to make it better for developers like you.

If you have suggestions or run into issues, please let us know! We're committed to ensuring Kaiban Board evolves based on community feedback.

---


## License

### KaibanJS (Framework)

**KaibanJS** is licensed under the **MIT License** (One of the most Open Source friendly licenses out there), giving you full freedom to use, modify, and distribute the framework in both personal and commercial projects.

### Kaiban Board (Visualizer)

**Kaiban Board** is licensed under a **custom license**. You can use it for free, even in commercial projects. However, if you want to modify the existing UI in any way, you will need to obtain a separate license.

For inquiries about licensing modifications or extended features, please [contact us](mailto:hello@kaibanjs.com). 

> *We're always open to helping innovative people with great ideas, even if they have limited budgets 😉.*
