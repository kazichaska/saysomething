const path = require('path');
const express = require('express');
const routes = require('./controllers');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3001;

// Cloudinary configuration
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: process.env.DB_PW,
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};
app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and server
// IMPORTANT
// Like earlier, once you turn on the server with 
// sequelize.sync({ force: true }) and confirm the database tables were 
// recreated, switch back to using { force: false } and restart the server 
// one more time just to make sure the changes took hold and you don't 
// accidentally remove data!
//  `sequelize.sync({ force: true })` anytime there is update on 
// the database side and turn it back to false when done
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening!'));
});

