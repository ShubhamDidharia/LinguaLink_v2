# DuoClick

DuoClick is a modern, real-time language exchange and messaging platform designed to connect users based on the languages they know and the languages they wish to learn. Built with a robust full-stack architecture, it provides a seamless and interactive experience for users to match, converse, and learn together.

## Features

*   **Real-Time Messaging:** Powered by WebSockets (Socket.io) for instant, chronological chat experiences with typing indicators and online status tracking.
*   **User Matching:** Connects users based on their native languages and learning goals.
*   **AI Integration:** Utilizes Google's Generative AI for enhanced language assistance and smart features.
*   **Secure Authentication:** Implements JSON Web Tokens (JWT) and robust password hashing (bcrypt) for secure user sessions and data protection.
*   **Modern User Interface:** Built with React, Vite, and Tailwind CSS for a responsive, fluid, and highly accessible user experience.
*   **Automated Services:** Background task scheduling for notifications and maintenance via node-cron.

## Technology Stack

### Frontend
*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS, PostCSS
*   **State Management & Routing:** React Router v6
*   **Real-time Communication:** Socket.io-client
*   **HTTP Client:** Axios
*   **Icons:** Lucide React

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB with Mongoose ODM
*   **Real-time Communication:** Socket.io
*   **Authentication:** JSON Web Tokens (JWT), bcryptjs
*   **AI Services:** Google Generative AI (@google/generative-ai)
*   **Email Services:** Nodemailer

## Prerequisites

Ensure you have the following installed on your local development machine:

*   Node.js (v18.x or later recommended)
*   npm (v9.x or later)
*   MongoDB (Local instance or MongoDB Atlas URL)

## Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/ShubhamDidharia/LinguaLink_v2.git
cd LinguaLink_v2
```

### 2. Backend Setup

Navigate to the backend directory, install dependencies, and configure your environment variables.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on the provided `.env.example`:

```bash
cp .env.example .env
```

Ensure you configure the following essential environment variables in `backend/.env`:
*   `MONGO_URI`: Your MongoDB connection string.
*   `PORT`: The port for the backend server (default: 8000).
*   `JWT_SECRET`: Secret key for token generation.
*   Google API keys and email configuration if utilizing those services.

Start the backend development server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and install the required dependencies.

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## Architecture Overview

The application follows a standard client-server architecture. The React frontend communicates with the Node/Express backend via RESTful APIs for standard CRUD operations and authentication, while utilizing WebSockets for real-time, bi-directional communication necessary for the chat functionality.

## Contributing

Contributions are welcome. Please ensure that you follow the existing coding style and submit pull requests for any new features or bug fixes. For significant changes, please open an issue first to discuss what you would like to change.

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
