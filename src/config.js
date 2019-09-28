module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
 
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://ratemycampsite@localhost/ratemycampsite',
    // remember to make a secret in the env
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret', 
    JWT_EXPIRY: process.env.JWT_EXPIRY || '20s',
    // email stuff for nodemailer
    EMAIL: process.env.EMAIL || 'ratemycampsite@gmail.com',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
}
