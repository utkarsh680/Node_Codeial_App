const express = require('express');
const multer = require('multer');
const cookieParser = require('cookie-parser')
const app = express();
const port = 8000;

// for managing ejs layout
const expressLayouts = require('express-ejs-layouts')

const db = require('./config/mongoose')

//use for session cookie
const session = require('express-session');
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require('./config/passport-googleAuth2-strategy');
const passportGithub = require('./config/passport-github2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(
    sassMiddleware({
        src: './assets/scss',
        dest: './assets/css',
        debug: false,
        outputStyle: 'expanded',
        prefix: '/css'
    })
)


app.use(express.urlencoded());
app.use(cookieParser());
// for static files
app.use(express.static('./assets'));

//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(expressLayouts);

// extract sttyle and scrips from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true)


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views')
// Configure multer to handle image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });
app.use(session({
    name: 'codeial',

    //todo change the secret befor deployment in productino mode
    secret: 'ututututut',
    saveUninitialized:false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl:'mongodb://127.0.0.1/Users',
        autoRemove: 'disabled'
    }, function(err){
        console.log(err || 'connect mongodb setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//for notification flash
app.use(flash());
app.use(customMware.setFlash);
//use express router
app.use('/', require('./routes'))

app.listen(port, function(err){
    if (err) {
        console.log(`Error in running the server: , ${err}`);
    }
    console.log(`server is runnig on port: ${port}`)
})