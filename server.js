const app = require('./routes/app');

const PORT = process.env.PORT || 3001;

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Middle ware in this file
