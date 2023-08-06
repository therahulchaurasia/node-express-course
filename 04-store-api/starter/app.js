require("dotenv").config();
// async errors

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

const notFundMiddleWare = require("./middleware/not-found");
const errorMiddleWare = require("./middleware/error-handler");

// middleware
app.use(express.json());

// routes

app.get("/", (req, res) => {
  res.send("<h1>Store API</h1> <a href='/api/v1/products'>Products</a>");
});

app.use("/api/v1/products", productsRouter);

// Products routes

app.use(notFundMiddleWare);
app.use(errorMiddleWare);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    // connect db
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log("Server is listening on PORT " + PORT + "...");
    });
  } catch (error) {}
};

start();
