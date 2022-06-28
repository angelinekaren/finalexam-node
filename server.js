const app = require("./app");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const { MONGO_USERNAME, MONGO_PASSWORD, DB_NAME } = process.env;

const url = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.sekfz.mongodb.net/?retryWrites=true&w=majority`;

const hostname = "localhost";

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: DB_NAME,
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

connectDB();
const db = mongoose.connection;
db.once("open", () => {
  console.log("mongoose is connected...");
  server.listen(PORT, () => {
    console.log(`Server running at http://${hostname}:${PORT}/`);
  });
});
