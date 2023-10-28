// Filters Schema
const mongoose = require('mongoose');

const filterOptionSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

const filterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  options: [filterOptionSchema],
});

const Filter = mongoose.model('Filter', filterSchema);

module.exports = Filter;
