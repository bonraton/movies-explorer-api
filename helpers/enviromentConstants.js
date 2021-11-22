const { MONGO_SERVER = 'mongodb://localhost:27017/moviesdb', PORT = 3000 } = process.env;

module.exports = { MONGO_SERVER, PORT };
