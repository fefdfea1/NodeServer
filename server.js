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

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      // 만일 whitelist 배열에 origin인자가 있을 경우
      callback(null, true); // cors 허용
    } else {
      callback(new Error("Not Allowed Origin!")); // cors 비허용
    }
  },
};

app.use(cors(corsOptions));

app.use("/static", express.static(__dirname + "/static"));
const uri = `${process.env.DB_URL}`;
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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

app.listen(8080, function () {
  console.log("listening on 8080");
});

app.get("/", function (요청, 응답) {
  응답.send("접속완료");
});

app.get("/api/offices/:officeId", async function (요청, 응답) {
  const officeId = 요청.url.slice(-1);
  await client.connect();
  const database = client.db("practiceDataBase");
  const movies = database.collection("practice");
  const query = { id: Number(officeId) };
  const movie = await movies.findOne(query);
  // Ensures that the client will close when you finish/error
  응답.json(movie);
  await client.close();
});
