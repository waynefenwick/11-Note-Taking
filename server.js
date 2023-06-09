const express = require('express');
const path = require('path');
const cors = require('cors');
const routes = require('./public/routes/routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Set the public folder as a static directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Use the routes defined in the separate file
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

