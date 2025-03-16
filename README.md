# Real-time Chat Application

A modern real-time chat application built with React, Node.js, and Socket.IO.

## Features

- Real-time messaging
- User presence tracking
- Modern Material-UI interface
- Responsive design
- TypeScript support

## Setup

1. Install dependencies for both server and client:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

2. Create a `.env` file in the root directory:
```
PORT=5000
NODE_ENV=development
```

3. Start the development servers:

In one terminal (for the backend):
```bash
npm run dev
```

In another terminal (for the frontend):
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     - `NODE_ENV`: `production`
     - `PORT`: `5000`

4. Update the `SOCKET_SERVER` URL in `client/src/App.tsx` with your Render deployment URL

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Material-UI
  - Socket.IO Client

- Backend:
  - Node.js
  - Express
  - Socket.IO
  - TypeScript

## License

ISC 