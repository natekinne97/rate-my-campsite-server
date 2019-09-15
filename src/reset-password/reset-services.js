const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const resetServices = {
    // check user from db
    getUsernameWithEmail(db, email) {
        // insert your db here
        return db('users')
            .where({ email })
            .first()
    },


}

module.exports = resetServices;