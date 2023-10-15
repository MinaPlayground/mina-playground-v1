# Mina Playground Interactive Learning Platform

Welcome to Mina Playground, an innovative interactive learning platform that allows you to follow step-by-step tutorials, run zkApps and Smart Contracts directly in your browser, and even manage and deploy projects online. Whether you're new to Mina or an experienced developer, this platform provides an immersive environment to enhance your skills and understanding of Mina's ecosystem.

## Features

- **Interactive Tutorials**: Learn Mina concepts and development techniques through various tutorial modes:
  - **Unit Test Mode**: Create tutorials that involve passing specific unit tests. Define tutorials with the following properties:
    - `name` (string): The name of the tutorial.
    - `type` (string): "unit" indicating the tutorial mode.
    - `options` (object): Additional options for the tutorial:
      - `focus` (array): An array of elements to focus on during the tutorial.
      - `highlight` (string): A specific element to highlight during the tutorial.
      - `base` (boolean): Indicates if the tutorial is a foundational one.
  - **Theoretical Mode**: Display tutorial content without interactivity. Define tutorials with the following properties:
    - `name` (string): The name of the tutorial.
    - `type` (string): "theory" indicating the tutorial mode.
  - **Playground Mode**: Create tutorials where you can experiment with code and run it instantly by clicking the "run" button. Define tutorials with the following properties:
    - `name` (string): The name of the tutorial.
    - `type` (string): "playground" indicating the tutorial mode.
    - `options` (object): Additional options for the tutorial:
      - `focus` (array): An array of elements to focus on during the tutorial.
      - `highlight` (string): A specific element to highlight during the tutorial.
      - `base` (boolean): Indicates if the tutorial is a foundational one.

- **Run zkApps and Smart Contracts**: Experience the power of Mina by running zkApps and Smart Contracts directly within the platform. Gain hands-on experience with Mina's privacy-focused technology.

- **Online Project Management**: Manage and edit your Mina projects online. Collaborate with others, make changes, and deploy Smart Contracts seamlessly.

## Getting Started

1. **Explore Tutorials**: Browse through a range of tutorials available in different modes: Unit, Theoretical, and Playground. Choose the mode that suits your learning style.

2. **Interactive Learning**: Engage with tutorials by following guided steps, running code snippets, and solving challenges. Choose from tutorials of varying complexity.

3. **Experiment with zkApps**: Dive into the world of zkApps and see firsthand how zero-knowledge proofs can revolutionize privacy in blockchain applications.

4. **Manage Projects**: Create, edit, and manage your Mina projects directly in the Playground. Easily deploy Smart Contracts and track your project's progress.

## Architecture

**Build tutorials script:**
![build-tutorials](https://github.com/devarend/mina-playground/assets/116919663/5e259db9-0ca5-4ff1-8649-abdde89f9b9e)


## Feedback and Support

Have questions, feedback, or need assistance? Reach out to us through [discord](https://discord.gg/PmFq7jYPVP) or create an issue on this GitHub repository.

Start your journey in the Mina Playground and enhance your understanding of Mina's technology in an interactive and engaging way. Happy learning and developing!
