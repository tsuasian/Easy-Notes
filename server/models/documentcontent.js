const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGOOSE_URI)

const DocumentContentSchema = new mongoose.Schema({
  documentId: {
    ref: 'Document',
    type: mongoose.Schema.ObjectId
  },
  editorState: Object,
});

const DocumentContent = mongoose.model('Document', DocumentContentSchema);

module.exports = DocumentContent;
