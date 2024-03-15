// Import necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

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
const TestimonialSchema = new mongoose.Schema({
  t_id: Number,
  t_name: String,
  t_role: String,
  t_date: String,
  t_city: String,
  t_address: String,
  t_gender: String,
  t_mail: String,
  active_status: Boolean
});

const TestimonialModel = mongoose.model('Testimonial', TestimonialSchema);

app.post('/testimonials/create', (req:any, res:any) => {
  const { t_id,t_name, t_role, t_date, t_city, t_address, t_gender, t_mail, active_status } = req.body;

  const newTestimonial = new TestimonialModel({
    t_id,
    t_name,
    t_role,
    t_date,
    t_city,
    t_address,
    t_gender,
    t_mail,
    active_status
  });

  newTestimonial.save()
    .then(() => {
      res.status(201).json({ message: 'Testimonial added successfully' });
    })
    .catch((error:any) => {
      console.error('Error saving testimonial:', error);
      res.status(500).json({ error: 'Error saving testimonial' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
