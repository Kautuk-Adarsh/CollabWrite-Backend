const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  versions: [
    {
      content: String,
      title: String,
      editedAt: { type: Date, default: Date.now },
      editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }
  ]
}, { timestamps: true });


module.exports = mongoose.model('Document', DocumentSchema);
