require('dotenv').config()
const express = require('express')
// loggers and error checkers
const morgan = require('morgan')
const helmet = require('helmet')
// cors
const cors = require('cors')
// const { CLIENT_ORIGIN } = require('./config');
// config file
const { NODE_ENV } = require('./config')
const app = express()
// endpoints
const campsiteRouter = require('./campsites/campsites-router');
const revRouter = require('./reviews/reviews-router');
const authRouter = require('./auth/auth-router');
const resRouter = require('./reset-password/reset-router');
const usersRouter = require('./users/users-router');

// logger
app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
}))

// logger and cors
app.use(cors());

app.use(helmet())
// endpoints
app.use('/api/campsites', campsiteRouter);
app.use('/api/reviews', revRouter);
app.use('/api/auth', authRouter);
app.use('/api/reset', resRouter);
app.use('/api/users', usersRouter);
// /api/users/new-user
// catch all error handler
app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: 'Server error', 
        message: "error something went wrong", 
        errorMessage: error }
        // remove this when running
        console.log(error, 'something went wrong');
        res.json({
            error: error,
            message: "something went wrong"
                    })
    } else {
        console.error(error)
        response = { error: error.message, object: error }
    }
    res.status(500).json(response)
})

module.exports = app
