# Study Shelf Server

This is the server-side application for the Study Shelf project.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/jubayerahmmad/study-shelf-server.git
   cd study-shelf-server
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables. Example:

   ```env
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/study-shelf
   ```

4. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints

### Books

- `GET /allBooks`: Retrieve a list of all books
- `POST /add-book`: Add a new book
- `GET /allBooks/:id`: Retrieve details of a specific book
- `PATCH /allBooks/:id`: Update details of a specific book
- `DELETE /allBooks/:id`: Delete a specific book

## Dependencies

- `cookie-parser`: ^1.4.7
- `cors`: ^2.8.5
- `dotenv`: ^16.4.7
- `express`: ^4.21.2
- `jsonwebtoken`: ^9.0.2
- `mongodb`: ^6.12.0

## Scripts

- `dev`: Starts the server with nodemon for development
