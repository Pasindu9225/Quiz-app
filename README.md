Quiz Platform
A web-based quiz platform where users can register, create quiz sessions, and publish them for others to answer. The platform allows seamless interaction between quiz creators and participants to test their knowledge and improve.

🚀 Technologies Used
Frontend:
Next.js: React framework for building server-rendered and statically generated web applications.

ShadcnUI & HyperUI: Utility-first components for building beautiful UIs.

TailwindCSS: Utility-first CSS framework for rapid UI design.

Lucide: A set of open-source icons for modern UI development.

Axios: Promise-based HTTP client for making API requests.

Backend:
Express.js: A web application framework for Node.js.

Bcrypt: A library to hash passwords for secure user authentication.

JSON Web Token (JWT): A compact and self-contained method for securely transmitting information between parties.

MongoDB: A NoSQL database for storing data related to users, sessions, quizzes, and answers.

Nodemon: A utility that monitors for any changes in your source and automatically restarts the server.

🛠️ Features
User Registration and Authentication: Users can sign up, log in, and authenticate with JWT tokens.

Create Quiz Sessions: Users can create new quiz sessions, add questions, and publish them.

Take Quizzes: Users can access published quizzes, answer questions, and view results.

Quiz Management: Admins or creators can edit, delete, or manage quizzes and sessions.


Getting Started
1. Clone the repository
      git clone https://github.com/your-username/quiz-platform.git

2. Install Dependencies
    For Frontend (Next.js):
       cd frontend
       npm install

    For Backend (Express.js):
       cd backend
       npm install

3. Environment Variables
      Create a .env file in the root of both the frontend and backend directories with the following variables:

  Backend:
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      PORT=5000

  Frontend:
      NEXT_PUBLIC_API_URL=http://localhost:5000


4. Running the Project
   To run the backend:
     cd backend
     npm run dev
   
  To run the frontend:
     cd frontend
     npm run dev

Your app will be live at http://localhost:3000.

🔧 API Endpoints
Authentication
POST /api/auth/register - Register a new user.

POST /api/auth/login - Login a user and return JWT.

Quiz Session Management
POST /api/sessions/create-session - Create a new quiz session.

GET /api/sessions/:sessionId - Get a specific quiz session.

GET /api/sessions/:sessionId/quizzes - Get all quizzes within a session.

POST /api/sessions/submit-answer - Submit an answer for a quiz.

Quiz Management
POST /api/quizzes - Create a new quiz for a session.

GET /api/quizzes/:quizId - Get details for a specific quiz.

PUT /api/quizzes/:quizId - Edit a quiz.

DELETE /api/quizzes/:quizId - Delete a quiz.

💡 Future Improvements
Real-time leaderboard for quiz participants.

User profiles with performance statistics.

Timer functionality for quizzes.

👨‍💻 Contributing
Fork the repository

Create a new branch (git checkout -b feature-branch)

Commit your changes (git commit -m 'Add feature')

Push to the branch (git push origin feature-branch)

Create a new Pull Request















   







