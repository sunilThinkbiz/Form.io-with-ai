🧠 AI-Powered Form Builder (React + Form.io + Gemini)
This project is a drag-and-drop form builder that lets users:

✅ Build forms visually using Form.io components

🤖 Use AI (Gemini) to generate/update form fields based on natural language prompts

💾 Save form schema to a backend (MongoDB via Node.js)

👀 Preview and test the form instantly

📸 Features
Drag & drop form components from a palette

Live preview of the form as you build

AI-assisted form generation using natural language prompts

Save the generated form schema to backend

Easily extendable and modular

🛠️ Tech Stack
Frontend: React, TypeScript, Form.io (@formio/react), Axios

AI Prompting: Gemini API

Backend: Node.js + Express (for API routes)

Database: MongoDB (to save form schema)

🧩 Folder Structure (Frontend)
src/
│
├── components/
│   ├── FormBuilder.tsx          # Main builder interface
│   └── GeminiFormGenerator.tsx  # AI prompt chat interface
│
├── App.tsx
└── index.tsx
🚀 How to Run
1. Clone the Repo
git clone https://github.com/your-username/ai-form-builder.git
cd ai-form-builder
2. Install Dependencies
npm install
3. Start the Frontend
npm start
App will run at: http://localhost:3000

4. Start the Backend (if applicable)
Ensure you have Node.js + MongoDB setup.

cd backend
npm install
npm run dev
Backend API will run at: http://localhost:5000

⚙️ Backend API Endpoints
POST /api/forms/save → Save generated form schema

POST /api/gemini-generate/save-ai-form → Generate form schema from AI using a prompt

✨ How It Works
🎯 Drag & Drop
Choose a field (TextField, Email, Number, etc.) from the palette

Drop it in the builder area

Live preview appears on the right

🤖 AI Prompt
Type prompts like:

"Create a form with name, email, and date of birth"

"Add phone number and submit button"

Gemini will return a valid Form.io schema and update your builder

💾 Save Schema
Click “Save Form Schema” to persist the form in your backend database

📦 Available Components
TextField, TextArea, Number, Email, Password, Phone Number

Checkbox, Radio, Select

Button, DateTime, Panel, Columns, FieldSet

Static HTML & Content blocks

🧪 Example Prompt
“Create a user registration form with name, email, password, and submit button”

🧠 Gemini will convert this into structured form JSON using Form.io components.