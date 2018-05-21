const express = require('express');
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
const passport = require('passport');

//mongo db
var db = 'mongodb://localhost:27017/fcc-night';

const app = express();

//set up view engine
app.set('view engine', 'ejs');

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//set up routes
app.use('/auth', authRoutes);

//create the home route
app.get('/', (req, res) => {
    res.render('home')
})

//connect to mongo
mongoose.connect(db, (err) => {
    if (err) {
        console.log(err);
    }
});

//mongoose connection events
mongoose.connection.on('connected', function() {
    console.log('successfully opened a connection to ' + db);
});

mongoose.connection.on('disconnected', function() {
    console.log('successfully disconnected connection from ' + db)
});

mongoose.connection.on('error', function() {
    console.log('error has occured connection to ' + db);
});

//listening port
app.listen(3000, () => {
    console.log('listening on port 3000')
})