const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: '*', // Replace with your frontend URL
    credentials: true
  };
  app.use(cors(corsOptions));
app.use(express.json()); // Add this line to parse JSON request bodies

// MongoDB Connection
mongoose.connect('mongodb+srv://vit-parking:qmtCay8wTNEVS9eU@vit-parking.pbgn8lx.mongodb.net/?retryWrites=true&w=majority&appName=vit-parking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"));

// Define a Schema and Model
const Schema = new mongoose.Schema({
  ready: Boolean,
  data: Array,
});
const FallSem = mongoose.model('FallSem', Schema);

// API to check boolean status and get array field
app.get('/fetchData', async (req, res) => {
  console.log(req.body);
  try {
    const doc = await FallSem.findOne({});
    res.json({
      ready: doc.ready,
      data: doc.data,
    });
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.put('/updateData', async (req, res) => {
    console.log(req.body);
    const { ready, data } = req.body;
    try {
      let doc = await FallSem.findOne({});
      if (doc) {
          doc.ready = ready;
        doc.data = data;
        await doc.save();
        res.status(200).send("Data updated successfully");
      } else {
        // If no document exists, create a new one
        await FallSem.create({ ready, data });
        res.status(201).send("Data created successfully");
      }
    } catch (error) {
        res.status(500).send("Error updating data");
    }
});

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));
// PUT REQUEST
// API to set ready status and data array
// app.post('/setData', async (req, res) => {
//   console.log(req.body);
//   const { ready, data } = req.body;
//   try {
//     let doc = await FallSem.findOne({});
//     if (doc) {
//       doc.ready = ready;
//       doc.data = data;
//       await doc.save();
//     } else {
//       await FallSem.create({ ready, data });
//     }
//     res.status(200).send("Data updated successfully");
//   } catch (error) {
//     res.status(500).send("Error setting data");
//   }
// });
// Update the ready status and data array in the database