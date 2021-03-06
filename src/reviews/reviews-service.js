const xss = require('xss');

const reviewService = {
    // get all reviews by id
    getById(db, id){
        return db.raw(`select reviews.id, reviews.text, reviews.rating, reviews.date_created, 
        users.user_name from reviews, users 
        where (reviews.user_id = users.id and reviews.campsite_id = ${id});`)
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
    },
    serializeReviews(site) {
        
        return {
            id: site.id,
            text: xss(site.text),
            rating: site.rating,
            date_created: site.date_created,
            author: xss(site.user_name)
        }
    },
}

module.exports = reviewService;