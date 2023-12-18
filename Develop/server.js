const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up session
const sessionStore = new SequelizeStore({
  db: db.sequelize,
});
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

// Set up Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set up static directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up middleware to parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(require('./routes'));

// Sync database and start the server
db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});