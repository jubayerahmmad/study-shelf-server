require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@study-shelf-a11.8pqpo.mongodb.net/?retryWrites=true&w=majority&appName=Study-Shelf-A11`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // collections
    const allBooksCollection = client.db("study-shelf").collection("allBooks");
    const borrowedBooksCollection = client
      .db("study-shelf")
      .collection("borrowedBooks");

    // Generate JWT
    app.post("/jwt", (req, res) => {
      const email = req.body;
      const token = jwt.sign(email, process.env.SECRET_KEY, {
        expiresIn: "365d",
      });
      console.log(token);
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // clear cookie from browser upon logout
    app.post("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    //BOOKS RELATED APIS

    // post a book
    app.post("/add-book", async (req, res) => {
      const newBook = req.body;
      const result = await allBooksCollection.insertOne(newBook);
      res.send(result);
    });

    // get all books
    app.get("/allBooks", async (req, res) => {
      const books = await allBooksCollection.find({}).toArray();
      res.send(books);
    });

    // get specific book by id
    app.get("/allBooks/:id", async (req, res) => {
      const id = req.params.id;
      const book = await allBooksCollection.findOne({ _id: new ObjectId(id) });
      res.send(book);
    });

    // get books by category
    app.get("/books/:category", async (req, res) => {
      const category = req.params.category;
      // console.log(category);
      const book = await allBooksCollection.find({ category }).toArray();
      res.send(book);
    });

    // update data of a book
    app.patch("/allBooks/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      // console.log(updatedData);

      const query = { _id: new ObjectId(id) };
      const updatedBook = {
        $set: {
          image: updatedData.image,
          name: updatedData.name,
          authorName: updatedData.authorName,
          category: updatedData.categorySelect,
          rating: updatedData.rating,
        },
      };
      const result = await allBooksCollection.updateOne(query, updatedBook);
      res.send(result);
    });

    // borrowed books api
    app.post("/borrowedBooks", async (req, res) => {
      // save data in borrowedBooks collection
      const borrowedBook = req.body;

      // prevent duplicate borrowing
      const query = {
        bookId: borrowedBook?.bookId,
        email: borrowedBook?.email,
      };
      const isExist = await borrowedBooksCollection.findOne(query);
      if (isExist) {
        return res.status(400).send("Book already borrowed!");
      }

      // decrese the quantity of the book in allBooks collection
      const filter = { _id: new ObjectId(borrowedBook.bookId) };
      const quantity = { $inc: { quantity: -1 } };
      const updatedBookQuantity = await allBooksCollection.updateOne(
        filter,
        quantity
      );

      const result = await borrowedBooksCollection.insertOne(borrowedBook);
      res.send(result);
    });

    // delete borrowed book by id
    app.delete("/borrowedBooks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      // increase the quantity of the book in allBooks collection
      const book = await borrowedBooksCollection.findOne(query);
      const filter = { _id: new ObjectId(book.bookId) };
      const quantity = { $inc: { quantity: 1 } };
      const updatedBookQuantity = await allBooksCollection.updateOne(
        filter,
        quantity
      );

      const result = await borrowedBooksCollection.deleteOne(query);
      res.send(result);
    });

    // get borrowed books by email
    app.get("/borrowedBooks/:email", async (req, res) => {
      const email = req.params.email;
      const books = await borrowedBooksCollection.find({ email }).toArray();
      res.send(books);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Library server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
