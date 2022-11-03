const { default: mongoose } = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    id: { type: Number, require: true },
    title: { type: String, require: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
