const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  documents: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Document"
    }
  ]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
