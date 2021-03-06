
const resetServices = {
    // check user from db
    getUsernameWithEmail(db, email) {
        return db('users')
            .where({email})
            .first()
    },
    // check user from db
    getUserWithUserName(db, user_name) {
        return db('users')
            .where({ user_name })
            .first()
    },
    // finds the user with the token given
    getUserWithTokens(db, resetpasswordtoken){
            return db('users')
                .where({
                    resetpasswordtoken: resetpasswordtoken,
                })
                .first()
    },
    updateUserInfo(db, id, updateUser) {
        return db.from('users')
            .where('id', id)
            .update(updateUser)
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },


}

module.exports = resetServices;