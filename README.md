# Ondrej's notes

![Vercel Deploy](https://deploy-badge.vercel.app/vercel/ondrejs-notes?style=for-the-badge)

A simple note-taking application inspired by [Google Keep](https://keep.google.com/), built with React, TypeScript, and Vite.

> This repository works as a showcase of various development approaches.

## Features

- Create, edit, and delete notes
- Responsive UI
- Fast development with Vite
- Type safety with TypeScript
- Hot Module Replacement (HMR)
- Linting with ESLint
- Notes are being stored in browser local storage

### Editing a note using CKEditor

- [CKEditor](https://ckeditor.com/) (classic editor style) is used to edit notes with following features:
  - Free features
    - Basic text formatting (italics, bold, underline, ...)
    - Typography (Headings, Links, Code Blocks, ...)
    - Lists (Ordered, Unordered, Todo)
    - Find & Replace
  - Premium features
    - Format Painter
    - AI Assistant
    - Export to PDF
    - Multi-level Lists
    - Real-time Collaborative Editing (Co-Authoring)
    - Real-time Collaborative Revision History

> [!TIP]
> Check the [full configuration and it's preview right in the CKEditor builder](https://ckeditor.com/ckeditor-5/builder/?redirect=portal#installation/NodgNARATAdAbDADBSIAsIRQMwkXAVjTTlMQE4jsMo4BGORIgDkzUWbRQgFMA7FIjDA6YIeLFg6AXUg8oAIzwFsEaUA=)
>
> [![CKEditor Configuration](https://img.shields.io/badge/CKEditor%20configuration-8A2BE2?style=for-the-badge)](https://ckeditor.com/ckeditor-5/builder/?redirect=portal#installation/NodgNARATAdAbDADBSIAsIRQMwkXAVjTTlMQE4jsMo4BGORIgDkzUWbRQgFMA7FIjDA6YIeLFg6AXUg8oAIzwFsEaUA=)

![Listing](./assets/listing.png)
![Detail](./assets/detail.png)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [OpenAI API Key](https://platform.openai.com/api-keys)
- CKEditor account with premium features ([Free trial - no credit card required](https://ckeditor.com/docs/trial/latest/index.html))

### Installation

```bash
git clone https://github.com/Simply007/ondrejs-notes.git
cd ondrejs-notes
npm install
# or
yarn install
```

### Prepare environment variables

```bash
cp .env.example .env
```

Set:

- `VITE_AI_API_KEY` from <https://platform.openai.com/api-keys>
- `VITE_CK_EDITOR_LICENSE_KEY` from <https://portal.ckeditor.com> > Subscriptions > License keys
- `VITE_CLOUD_SERVICES_WEBSOCKET_URL` and `VITE_CLOUD_SERVICE_TOKEN_URL` from <https://portal.ckeditor.com> > Subscription > Cloud environment -> View <YOUR ENVIRONMENT> > CKEditor configuration

⚠️ The showcase is ready for development purposes. For production environment, you need to implement the [API Proxy endpoint to API key exchange](https://ckeditor.com/docs/ckeditor5/latest/features/ai-assistant/ai-assistant-integration.html#using-proxy-endpoint).

### Running the App

```bash
npm run dev
# or
yarn dev
```

🎉 The app is be available at  [http://localhost:5173](http://localhost:5173) 🎉

## Linting and Formatting

This project uses ESLint for code linting. To run lint checks:

```bash
npm run lint
# or
yarn lint
```

## Development Tools

### Generating Sample Notes

This project includes a script to generate sample notes for testing and development purposes.

#### Command Line Usage

Generate sample notes using the npm script:

```bash
# Generate 15 sample notes (default) with existing samples
npm run generate-samples

# Generate custom number of notes
node scripts/generateNotes.cjs --count=30 > public/sample-notes.json

# Generate without including existing sample notes
node scripts/generateNotes.cjs --count=20 --no-samples > public/sample-notes.json
```

**Options:**
- `--count=N` - Number of notes to generate (default: 15)
- `--no-samples` - Skip including existing sample notes from `assets/sampleNotes.json`

The generated notes include a mix of:
- **TipTap notes** - Standard notes using TipTap editor
- **CKEditor-only notes** - Notes created directly with CKEditor (no TipTap version)
- **Migrated notes** - Notes that have both TipTap (read-only) and CKEditor versions

#### Debug Mode (UI)

Load sample notes directly from the application interface:

1. Open the app with debug mode enabled:
   ```
   http://localhost:5173?debug=true
   ```

2. Click the orange **🔧 Generate Sample Notes** button in the header

3. Confirm to add sample notes to your browser's local storage

**Note:** The debug button is only visible when `?debug=true` is in the URL query string.

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSimply007%2Fondrejs-notes)

## Tutorials

### Starter for this project

[![AI Vibe-Coding a Google-Keep-Style Notes App | Vite + React + TypeScript → Deploy on Vercel](https://img.youtube.com/vi/V02w3CK8KG4/maxresdefault.jpg)](https://www.youtube.com/watch?v=V02w3CK8KG4&ab_channel=Ond%C5%99ejChrastina "Watch on YouTube")

### CKEditor 5 Integration

[![Add CKEditor 5 to a React Notes App | Rich-Text, AI Assistant & PDF Export (Vite + TS)](https://img.youtube.com/vi/LAGl6orIGRw/maxresdefault.jpg)](https://www.youtube.com/watch?v=LAGl6orIGRw&ab_channel=Ond%C5%99ejChrastina "Watch on YouTube")

### Real-Time Collaboration with CKEditor 5

[![Add Real-Time Collaboration to CKEditor 5 in React | Notes App Tutorial (Vite + TS + Vercel)](https://img.youtube.com/vi/qn4FthLFvK4/maxresdefault.jpg)](https://www.youtube.com/watch?v=qn4FthLFvK4&ab_channel=Ond%C5%99ejChrastina "Watch on YouTube")

## License

This project is licensed under the MIT License.
