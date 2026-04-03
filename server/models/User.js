const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  phone: { type: String },
  postalCode: { type: String },
  address1: { type: String },
  address2: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
