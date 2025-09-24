# Ulala

A gamified task management app that turns your daily to-dos into an engaging story-based experience.

## Features

- 📖 **Story Mode**: AI-powered task recommendations based on your life goals
- 🎯 **Smart Tasks**: Create and complete tasks with category-based rewards
- 📊 **Activity Tracking**: Visual calendar showing your story completion history
- 🎁 **Reward System**: Earn points and badges for completing tasks
- 🌙 **Dark Mode**: Full light/dark theme support with localStorage persistence
- 📱 **Mobile First**: Responsive design optimized for mobile devices

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (Deploy the `build/client/` directory)
npm run build
```

## Project Structure

```
app/
├── routes/          # Page routes
├── components/      # Reusable components
├── assets/          # Images and static files
└── app.css          # Global styles with Tailwind v4

docs/               # Design and feature documentation
feature/            # Feature specifications
```

## Tech Stack

- React Router v7 (CSR mode)
- TypeScript
- Tailwind CSS v4
- Microsoft Fluent 2 Design System
- Local Storage for data persistence
