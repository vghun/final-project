import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Backend Node.js is running on port: ${PORT}`);
});
