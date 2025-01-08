# Study Shelf Server

This is the server-side application for the Study Shelf project.

## Installation

1. Clone the repository:

```sh
  git clone https://github.com/jubayerahmmad/study-shelf-server.git
  cd study-shelf-server

```

````

2. Install the dependencies:

```sh
npm install

````

````

3. Set up environment variables:
Create a `.env` file in the root directory and add the necessary environment variables. Example:

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/study-shelf
````

4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### Books

- `GET /allBooks`: Retrieve a list of all books
- `POST /add-book`: Add a new book
- `GET /allBooks/:id`: Retrieve details of a specific book
- `PATCH /allBooks/:id`: Update details of a specific book
- `DELETE /allBooks/:id`: Delete a specific book

## Dependencies

- Express: Fast, unopinionated, minimalist web framework for Node.js
- Mongoose: Elegant MongoDB object modeling for Node.js
- dotenv: Loads environment variables from a `.env` file into `process.env`
- body-parser: Node.js body parsing middleware
- cors: Middleware to enable Cross-Origin Resource Sharing

## Scripts

- `start`: Starts the server
- `dev`: Starts the server with nodemon for development
