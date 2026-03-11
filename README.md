
# Real-Time Kanban Board

A **real-time collaborative Kanban Board** built with **Next.js, Node.js, MongoDB, and Socket.IO**.
The application allows multiple users to create tasks, move them across columns, and see updates instantly without refreshing the page.

---

## Tech Stack

**Frontend**

* Next.js (App Router)
* React
* Tailwind CSS
* Material UI
* Socket.IO Client
* Axios

**Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* Socket.IO
* JWT Authentication

---

## Architecture Overview

The project follows a **separation of concerns architecture**:

### Frontend

* **Components Layer** – UI elements such as Board, Columns, Task Cards.
* **Services Layer** – API communication using Axios.
* **Hooks & Utils** – Token handling, task helpers.
* **Pages / Routes** – Next.js App Router for page structure.

### Backend

* **Routes** – Define API endpoints.
* **Controllers** – Handle request logic.
* **Services** – Business logic abstraction.
* **Models** – MongoDB schemas.
* **Socket Layer** – Real-time communication.

This structure improves **scalability, maintainability, and testability**.

---

## Key Features

* Real-time task updates using **WebSockets**
* Drag and drop tasks across columns
* Persistent task ordering
* Authentication system (Register / Login)
* Protected dashboard routes
* Task audit history tracking
* Responsive UI with Tailwind + MUI

---

## Conflict Resolution Strategy

To prevent data corruption when multiple users modify the same task:

1. Each task contains a **version field**.
2. When a task update request is sent, the current version is checked.
3. If the version does not match the latest version in the database:
   * The server returns a **409 Conflict error**.
4. The frontend handles this by:
   * Displaying a notification to the user
   * Reloading the latest task data.
This ensures **data consistency across multiple users**.

---

## Real-Time Synchronization

The application uses **Socket.IO** to broadcast updates:

* `taskCreated`
* `taskUpdated`
* `taskMoved`

When one user updates a task, all connected clients receive the update instantly and update their UI without refreshing.

---

## Running the Project Locally

### 1. Clone the Repository

```bash
git clone <repo-url>
cd kanban-board
```

---

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb://127.0.0.1:27017/kanban
JWT_SECRET=your_secret_key
```

Start backend server:

```bash
npm start
```

---

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

Run development server:

```bash
npm run dev
```

---

### 4. Open the Application

```
http://localhost:3000
```

---

## Future Improvements

* Task editing & comments
* User avatars and mentions
* Advanced analytics dashboard
* Role-based access control
* Activity timeline visualization

---

## Author
📄 License
MIT ©Sumit Singh
```
https://sumitsingh0003.vercel.app
```


Developed as a **Full-stack real-time collaboration project** demonstrating modern web application architecture and scalable system design.
