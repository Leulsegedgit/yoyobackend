const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sync the database
db.sequelize.sync();

// Routes
require("./routes/formData.routes")(app);
// Import and start polling for updates
const { getUpdates } = require("./bot");

// Set port and listen for requests
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  getUpdates(); // Start polling for updates when the server starts
});
