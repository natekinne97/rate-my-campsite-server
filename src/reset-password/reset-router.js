const AuthService = require('../auth/auth-service')
const resestServices = require('./reset-services')
const nodemailer = require('nodemailer')
const config = require('../config')
const jsonBodyParser = express.json()
const resRouter = express.Router()

// gets username and email to send for a password reset
// sends email for the password reset
resRouter
    .route('/forgotpassword')
    .post(jsonBodyParser, (req, res, next) => {
        const { user_name, email } = req.body;
        const forgotten = { user_name, emial };
        // check if missing request
        for (const [key, value] of Object.entries(forgotten))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        //  check user name
        resestServices.getUsernameWithEmail(
            req.app.get('db'),
            forgotten.email
        )
            .then(dbUser => {
                if (!dbUser)
                    return res.status(400).json({
                        error: 'username or email not found',
                    })
                if (dbUser.email != forgotten.emial)
                    return res.status(400).json({
                        error: 'username or email not found',
                    })

                // setup token
                const sub = dbUser.user_name
                const payload = { user_id: dbUser.id }
                const token = AuthService.createJwt(sub, payload);
                console.log(token, 'token');
                // not sure whats happening here or if it will work
                dbUser.update({
                    resetPasswordToken: token,
                    resetPasswordExpires: Date.now() + 36000
                })

                // transporter for email verification
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: `${config.EMAIL}`,
                        pass: `${config.EMAIL_PASSWORD}`
                    }
                })

                // the actual email
                const mailOptions = {
                    from: 'ratemysite@gmail.com',
                    to: `${dbUser.emial}`,
                    subject: 'Link to password reset.',
                    text:
                        'You are recieving this email because you (or someone else) has requested a reset of the password of your account' +
                        'Please click the following link, or paste this in your browser to complete the process within 1 hour of revieving this email.' +
                        `http://localhost:3000/reset/${token} \n\n` +
                        'If you did not make this request, please ignore this message.'
                }

                transporter.sendMail(mailOptions, function (err, response) {
                    if (err) {
                        console.log(err, 'error')
                    } else {
                        console.log(success)
                        res.status(200).json('recovery email sent');
                    }
                })

            })
            .catch(next)

    });