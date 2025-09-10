# DJS01: Vanilla JS Podcast App

## Overview

### The Design

You will design and build a responsive web application that allows users to **browse podcast shows** on a landing page and **view detailed information** in a modal.

### Key objective and Requirements

The application should display clear, concise previews of podcast shows and offer additional information through a modal pop-up, **all without navigating away from the page**.

Your app should showcase clean code architecture and strong UI/UX design while following JavaScript best practices.

---

## Implemention of Core Objectives and Usecases

### 1. Landing Page – Podcast Previews

- Display a list of podcast shows on the landing page.
- Each podcast preview must include:
  - Cover image
  - Show title
  - Number of seasons
  - Genre names
  - Last updated date (in a human-readable format)

### 2. Modal View – Show Details

- When a user clicks on a podcast preview, open a modal.
- The modal should include:
  - Larger cover image
  - Podcast title
  - Description of the show
  - Genre tags
  - Last updated date (readable format)
  - List of season titles
  - Number of episodes in each season
- Include a clear and accessible way to **close the modal**.

### 3. Code Architecture & Best Practices

- Use **object-oriented programming (OOP)** where appropriate.
- Apply **functional programming principles** to ensure modularity and predictability.
- Follow **SOLID design principles** for clean, maintainable code.
- Abstract repeated logic into **reusable functions or classes**.
- Add **JSDoc comments** for major functions and modules.

---

## Technical Requirements and Implementation

- I Used **HTML, Tailwind css, and  Vanilla JavaScript**.
- No page reloads: Use JavaScript to handle modal behaviour and data rendering.
- All UI states (modal open/close, hover effects, etc.) work smoothly.
- All data is displayed in a **readable and accessible format**.

---

## Design & UX Goals

### Figma Design Link
- I the used provided wireframe in the wireframe reference images folder for guidance on how to build the UI structure to implement my Prototype.
  - ![alt text](<wireframe reference images/desktop view/desktop_modal_view.png>)
- I designed a visually appealing UI Prototype with clear layout and hierarchy using Figma.
  - Check updated : [Figma design Link](https://www.figma.com/design/5vvqOdJYHcn6BMR8QZ5WPA/Prototyping-in-Figma?node-id=3833-2013&t=Ym4md3F2PlKb4uD4-0)
- Use a consistent **colour scheme, typography, spacing, and sizing**.
- Accessibility considerations (contrast, font readability, responsive buttons).
- App should be fully **responsive** on desktop, tablet, and mobile.

---

## Deliverables Outcome

A fully functional **dynamic Podcast app** where Poscast shows appear correctly, and users can **open a modal to view** Podcast details. The project will follow **clean, well-documented, and maintainable code practices**, ensuring a professional and scalable implementation.


## To-Do list
1. Open / Close Sidebar menu (All views)
2. Create Different Pages for all of the listed items in the menu
  - Home Page: 
    - Filter by: Genre (Alphabetical order: A-Z)
    - Filter by: Recently Updated (Most recent: Ascending, Olde: Descending order)
  - Library Page: Everything that is there.
  - Popular Page:
    - Filter by: Most Popular (Count of likes)
    - Filter by: Most Popular Genre
  - Genre Page:
    - Filter by: Genre (Alphabetical order: A-Z)
  - Recently Added page:
    - Show Recently added per Week?
    - Show Recently added per Month?
  - Recommended Page:
    - Show Recommended shows
3. Resume Podcast menu (later stage - Do figure it out)
4. Close Sidebar menu functionality
5. Light-mode / Dark-mode toggle functionality
6. Player Functionality