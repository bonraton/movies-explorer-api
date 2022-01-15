const {
  MONGO_SERVER = 'mongodb://localhost:27017/moviesdb',
  PORT = 4000,
  JWT_SECRET = 'strong-key',
} = process.env;

module.exports = { MONGO_SERVER, PORT, JWT_SECRET };
