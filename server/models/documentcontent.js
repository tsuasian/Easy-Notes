const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGOOSE_URI)

const DocumentContentSchema = new mongoose.Schema({
  documentId: {
    ref: 'Document',
    type: mongoose.Schema.ObjectId
  },
  editorState: Object,
});

const DocumentContent = mongoose.model('DocumentContent', DocumentContentSchema);

module.exports = DocumentContent;
