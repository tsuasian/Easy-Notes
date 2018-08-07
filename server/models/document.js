const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE_URI)

const DocumentSchema = new mongoose.Schema({
  owner: {
    ref: 'User',
    type: mongoose.Schema.ObjectId
  },
  collaborators: [{
    ref: 'User',
    type: mongoose.Schema.ObjectId
  }],
  name: String,
  rawState: String,
  shareURI: String,
  createDate: Date,
  lastSaved: Date
});

const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document;
