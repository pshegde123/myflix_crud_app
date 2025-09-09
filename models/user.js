const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  details:{
    type: String,
  },  
  notes:{
    type: String,
  }
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  favoriteMovies: [movieSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;