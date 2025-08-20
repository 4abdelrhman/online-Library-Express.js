# Online Library Express.js API
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/4abdelrhman/online-Library-Express.js.git)

This is a backend service for an online library application, built with Node.js and Express.js. It features robust user authentication and role-based access control using Clerk, secure image handling with Cloudinary, and protection against common web threats via Arcjet.

The API allows users to browse, search, borrow, and favorite books. Administrators have additional privileges to add, update, and delete books from the library's database. The search functionality is enhanced by integrating with the public Open Library API to provide a wider range of results.

## Features

-   **User Management**: Secure user authentication and session management handled by Clerk.
-   **Role-Based Access Control**: Differentiates between `user` and `admin` roles, restricting access to certain endpoints.
-   **Book Management (Admin)**: Full CRUD (Create, Read, Update, Delete) functionality for books in the library.
-   **Book Interaction (User)**: Users can borrow/return books and add/remove them from a personal favorites list.
-   **Hybrid Book Search**: Searches for books from both the local database and the external Open Library API.
-   **Cloud Image Storage**: Book cover images are uploaded and managed securely via Cloudinary.
-   **Security**: Integrated with Arcjet for rate limiting, bot detection, and protection against common attacks like SQL injection.
-   **Vercel Ready**: Configured for seamless deployment on Vercel.

## Technologies Used

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: Clerk
-   **Image Hosting**: Cloudinary
-   **Security**: Arcjet
-   **Deployment**: Vercel

## API Endpoints

All endpoints are prefixed with `/api`. Authentication is required for all book-related routes.

| Method | Endpoint                    | Description                                                                                                   | Access     |
| :----- | :-------------------------- | :------------------------------------------------------------------------------------------------------------ | :--------- |
| `GET`  | `/books`                    | Retrieve a list of all books from the local DB and the Open Library API.                                      | User/Admin |
| `GET`  | `/books/search?q={query}`   | Search for books by title or author in the local DB and the Open Library API.                                 | User/Admin |
| `POST` | `/books/borrow/{id}`        | Borrow a book. If the book is already borrowed by the user, this endpoint will "return" it.                   | User       |
| `POST` | `/books/favorite/{id}`      | Add a book to favorites. If the book is already in favorites, it will be removed.                             | User       |
| `POST` | `/books`                    | Add a new book to the database. Requires `title`, `author`, `description`, and `coverURI` in the request body. | Admin      |
| `PUT`  | `/books/{id}`               | Update an existing book's details.                                                                            | Admin      |
| `DELETE`| `/books/{id}`              | Delete a book from the database and its cover image from Cloudinary.                                          | Admin      |

## Setup and Installation

Follow these steps to get the project running on your local machine.

### Prerequisites

-   Node.js (v18 or newer)
-   npm
-   MongoDB instance (local or cloud-based like MongoDB Atlas)
-   Accounts for Clerk, Cloudinary, and Arcjet.

### 1. Clone the Repository

```bash
git clone https://github.com/4abdelrhman/online-library-express.js.git
cd online-library-express.js
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project and add the following variables. Replace the values with your actual keys and credentials.

```env
# MongoDB Connection String
DB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/yourDatabaseName

# Clerk Credentials (from your Clerk dashboard)
CLERK_SECRET_KEY=sk_test_...

# Cloudinary Credentials (from your Cloudinary dashboard)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Arcjet Key (from your Arcjet dashboard)
ARCJET_KEY=aj_...

# Server Port (Optional)
PORT=3000
```

### 4. Run the Application

You can start the server in development mode, which automatically restarts on file changes.

```bash
npm run dev
```

Alternatively, you can run it in production mode.

```bash
npm run start
```

The server will be running on the port specified in your `.env` file or on `http://localhost:3000` by default.
