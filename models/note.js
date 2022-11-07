const { default: mongoose } = require('mongoose')

const noteSchema = new mongoose.Schema(
    {
        title: { type: String, require: true },
        copy: { type: String, require: true },
        email: { type: String, require: true },
    },
    { timestamps: true }
)

module.exports = mongoose.model('notes', noteSchema, 'notes')
