
const reviewService = {
    // get all reviews by id
    getById(db, id){
        return db.from('reviews')
            .select('*')
            .where('id', id)
            
    },
    // insert to db
    insertReview(db, newReview){
        return db.insert(newReview)
            .into('reviews')
            .returning('*')
            .then(rows => {
                return rows[0];
            })
    },
    update(db, id, updatedRev){
        return db.from('reviews')
            .where('id', id)
            .update(updatedRev);
    },
    deleteRev(db, id){
        return db('campsites')
            .where({ id })
            .delete();
    }
}

module.exports = reviewService;