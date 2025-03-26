const express = require('express');
const connectDB = require('./database/database');
const app = express();

app.use(express.json());

connectDB();

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});