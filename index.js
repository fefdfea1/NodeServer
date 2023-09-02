const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const whitelist = [
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:5173",
];

let corsOptions = {
  origin: whitelist,
};
app.use(cors(corsOptions));

app.use("/public", express.static("public"));
const uri = `${process.env.DB_URL}`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
client.connect();

app.listen(8080, function () {
  console.log("listening on 8080");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
//이미지 배열
app.get("/api/offices/ImgList", async function (req, res) {
  const database = client.db("practiceDataBase");
  const data = database.collection("ImgList");
  const getAllData = await data.find().toArray();
  res.json(getAllData);
});
//빈 이미지 배열
app.get("/api/offices/emptyImgList", async function (req, res) {
  const data = [];
  res.json(data);
});

app.get("/api/offices/:officeId", async function (req, res) {
  const officeId = req.url.slice(-1);
  const database = client.db("practiceDataBase");
  const data = database.collection("practice");
  const query = { id: Number(officeId) };
  const movie = await data.findOne(query);
  // Ensures that the client will close when you finish/error
  res.json(movie);
});
client.close();
