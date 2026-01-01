# 🏁 Chain Game: A Word Association Game

A web game where players solve word chains by guessing the middle links. Built with a focus on smooth UI/UX, persistent data, and polished animations.

[**[Live Demo Link](https://heyitstan.github.io/chain-game/)**]

## 🚀 Key Features

* **Dynamic Game Logic:** Uses a shuffle algorithm (Fisher-Yates style) to ensure players experience different word chains every session.
* **High Score Persistence:** Integrated the **Web Storage API (localStorage)** to save and display the player's "Personal Best" time across browser sessions.
* **Responsive UX/UI:** * **Mobile-First Design:** Implemented modern CSS units like `svh` and flexbox to handle mobile keyboards and varying screen sizes.
    * **Visual Feedback:** Custom CSS keyframe animations for incorrect guesses (shake) and low-time warnings (pulse).
* **Juice & Polish:** Integrated the **Canvas Confetti API** for a celebratory win state and used **CSS variables** for easy theme management.

## 🛠️ Technical Stack

* **HTML5** for semantic structure.
* **CSS3** for custom animations, variables, and responsive layouts.
* **Vanilla JavaScript** for state management, timer logic, and DOM manipulation.
* **GitHub Pages** for automated CI/CD deployment.

## 🧠 What I Learned

During this project, I tackled several common web development challenges:
1.  **Scope & State:** Managing global variables and ensuring the game state resets correctly without a full page reload.
2.  **Third-Party Integration:** Learning how to successfully implement a CDN-based library (Confetti) into a custom function.

---
*Created as a portfolio project to demonstrate proficiency in Frontend Development.*
