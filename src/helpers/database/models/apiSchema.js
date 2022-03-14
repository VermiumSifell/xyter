const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema(
  {
    guildId: {
      type: mongoose.SchemaTypes.Decimal128,
      required: true,
      unique: false,
      index: true,
    },
    url: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: false,
      index: true,
      default: 'https://bg.zyner.org/api/',
    },
    token: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: false,
      index: true,
      default: 'your_token',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('api', apiSchema);
