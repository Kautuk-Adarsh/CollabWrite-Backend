const express= require('express');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const Logger = require('./Middleware/Logger');
const HealthCheck = require('./Routes/HealthCheck');
const AuthRoute = require('./Routes/AuthRoute');
const DocRoute = require('./Routes/DocRoute')
const UserRoute = require('./Routes/UserRoute');
const session = require('express-session');
const passport = require('./config/passport');

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
}));

app.use(Logger);
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(cookieParser(process.env.SESSION_SECRET)); 

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/health',HealthCheck);
app.use('/auth',AuthRoute);
app.use('/docs',DocRoute)
app.use('/user',UserRoute)

module.exports = app;
