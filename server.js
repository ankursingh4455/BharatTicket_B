require('dotenv').config()
const dbConnection = require('./config/db.js');
const authRoutes = require("./routes/authRoutes.js");
const trainTicketRoutes = require('./routes/trainTicketRoutes');
const cors = require('cors')

dbConnection(); // Establish database connection

const express = require("express");
const app = express()
const port = process.env.PORT || 5220

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.send('The backend is live')
})

app.use("/auth", authRoutes);
app.use('/train-tickets', trainTicketRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})