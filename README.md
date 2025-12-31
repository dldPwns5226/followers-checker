# Followers Checker

A web application that helps users understand their follower/following
relationships by uploading and analyzing their social data.

---

## 📌 Project Overview
- **Type**: Team project (Forked repository)
- **Role**: Frontend developer (core contributor)
- **Purpose**:  
  Social platforms provide raw follower data, but it is often difficult
  for users to clearly understand asymmetric relationships.
  This project focuses on making those relationships easy to inspect
  through a simple upload-and-view workflow.

---

## ✨ Key Features
- Upload social data in ZIP format
- Parse and process follower/following information on the client side
- Clearly inspect follower relationships through a structured UI
- Provide guided steps for users unfamiliar with data exports
- Support UI preferences such as theme and language settings

---

## 🙋‍♂️ My Contribution
Still working on this project.. so wait a minute! ⏰

---

## 🛠 Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Processing**: JSZip
- **Tooling**: ESLint, PostCSS

---

## 🧠 Implementation Highlights

### ZIP Upload & Client-Side Data Processing
- Implemented a ZIP upload flow using `JSZip`
- Extracted and parsed exported social data directly in the browser
- Avoided unnecessary server-side processing to keep the workflow lightweight
- Encapsulated parsing logic inside `lib/` to keep UI components clean

### Component-Oriented UI Architecture
- Structured UI into reusable components such as:
  - Header
  - Upload bar
  - Guide steps
  - Settings drawer
- Focused on separation of concerns between layout, logic, and presentation
- Designed components to be easily extendable for future features

### Global State Management
- Used React Context API to manage:
  - Theme (light / dark)
  - Language preferences
- Centralized application settings to avoid prop drilling
- Ensured consistent UI behavior across the application

### Type Safety & Maintainability
- Enabled strict TypeScript configuration
- Defined clear interfaces for parsed data structures
- Focused on predictable data flow to reduce runtime errors

---

## 📂 Project Structure
app/ # App Router pages and layouts
components/ # Reusable UI components
lib/ # Core data processing logic (ZIP parsing)
styles/ # Global styles

---

## ▶️ Getting Started
```bash
npm install
npm run dev
