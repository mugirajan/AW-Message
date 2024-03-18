// Import necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const list =express();

// Configure bodyParser to parse incoming JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

// Define a schema for the data
const ContactSchema = new mongoose.Schema({
  t_id: Number,
  t_name: String,
  t_role: String,
  t_date: String,
  t_city: String,
  t_address: String,
  t_gender: String,
  t_mail: String,
  t_term: String,
  t_dob: String,
  active_status: Boolean
});

const ContactofModel = mongoose.model('Contact', ContactSchema);

app.post('/contacts/create', (req:any, res:any) => {
  const { t_id,t_name,t_term, t_role,t_dob, t_date, t_city, t_address, t_gender, t_mail, active_status } = req.body;

  const newContact = new ContactofModel({
    t_id,
    t_name,
    t_role,
    t_date,
    t_city,
    t_address,
    t_gender,
    t_mail,
    t_dob,
    t_term,
    active_status
  });

  newContact.save()
    .then(() => {
      res.status(201).json({ message: 'Contact added successfully' });
    })
    .catch((error:any) => {
      console.error('Error saving contact:', error);
      res.status(500).json({ error: 'Error saving contact' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/**List Schema */
const ListSchema = new mongoose.Schema({
  c_id: Number,
  c_name: String,
  c_role: String,
  c_date: String,
  c_city: String,
  c_address: String,
  c_gender: String,
  c_mail: String,
  c_selected: String,
  active_status: Boolean,
});

const ListModel = mongoose.model('List', ListSchema);

app.post('/Lists/create', (req:any, res:any) => {
  const { c_id, c_name, c_number,  c_gender, c_mail,c_selected, active_status } = req.body;

  const newList = new ListModel({
    c_id,
    c_name,
    c_number,
    c_selected,
    c_gender,
    c_mail,
    active_status
  });

  newList.save()
    .then(() => {
      res.status(201).json({ message: 'List added successfully' });
    })
    .catch((error:any) => {
      console.error('Error saving List:', error);
      res.status(500).json({ error: 'Error saving List' });
    });
});
// const PORT = 3000;
list.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


