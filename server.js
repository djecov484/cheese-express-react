// DEPENDENCIES
////////////////////////////////
require("dotenv").config();
// pull PORT from .env, give default value of 3000
const { PORT = 3000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const mongoose = require("mongoose")


//Database
// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
mongoose.connection
.on("open", () => console.log("Connected to Mongo"))
.on("close", () => console.log("Disconnected from Mongo"))
.on("error", (error) => console.log(error))

//Models
const CheeseSchema = new mongoose.Schema({
  name: String,
  countryOfOrigin: String,
  image: String 

}) 

const Cheese = mongoose.model("Cheese", CheeseSchema)


//Midleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
  res.send("hello world");
});
// INDEX ROUTE
app.get("/cheese", async (req, res) => {
  try {
    // send all people
    res.json(await Cheese.find({}));
  } catch (error) {
    //send error
    res.status(400).json({error});
  }
});

//  CREATE ROUTE
app.post("/cheese", async (req, res) => {
  try {
    // send all people
    res.json(await Cheese.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json({error});
  }
});

// Update route 

app.put("/cheese/:id", async (req, res) => {
  try {
      res.json(
          await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true})
      )
  } catch (error){
      res.status(400).json({error})
  }
})

// Delete route
app.delete("/cheese/:id", async (req, res) => {
    try {
      res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json({ error });
    }
  });

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));