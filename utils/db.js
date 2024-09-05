const mongoose = require('mongoose');

async function dbconnect() {
  await mongoose.connect(process.env.DB_URL);
}

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Token: {
    type: String,
    required: true,
  },
});

const Token = mongoose.model('token', TokenSchema);

module.exports = {
  dbconnect,
  Token,
};
