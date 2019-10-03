const xss = require('xss');

const campsiteServices= {
    // get every campsite with comments
    getAllSites(db, sort){
        return db.from('campsites AS camp')
                .select(
                    'camp.id',
                    'camp.img',
                    'camp.name',
                    'camp.description',
                    'camp.park',
                    'camp.city',
                    'camp.state',
                    db.raw(
                        `count(DISTINCT rev) AS number_of_reviews`,
                    ),
                    db.raw(
                        'coalesce(avg(rev.rating), 0) AS avg_reviews'
                    ),
    
                )
            .leftJoin(
                'reviews AS rev',
                'camp.id',
                'rev.campsite_id',
            ).groupBy(db.raw('1,2, 3, 4, 5, 6, 7'))
            .orderBy(sort || 'number_of_reviews', 'desc');
    },
    getById(db, id){
        return db.from('campsites as camp')
            .select(
                'camp.id',
                'camp.img',
                'camp.name',
                'camp.description',
                'camp.park',
                'camp.city',
                'camp.state',
                db.raw(
                    `count(DISTINCT rev) AS number_of_reviews`,
                ),
                db.raw(
                    'coalesce(avg(rev.rating), 0) AS avg_reviews'
                ),
            )
            .leftOuterJoin(
                'reviews AS rev',
                'camp.id',
                'rev.campsite_id',
            ).groupBy(db.raw('1,2, 3, 4, 5, 6, 7'))
            .where('camp.id', id);
    },
    // insert campsite to db
    insertCampsite(db, newCampsite){
        return db
                .insert(newCampsite)
                .into('campsites')
                .returning('*')
                .then(rows=>{
                    return rows[0];
                })
    },
    update(db, id, updatedSite){
        return db.from('campsites')
            .where('id', id)
            .update(updatedSite);
    },
    deleteCampsite(db, id){
        return db('campsites')
                .where({ id })
                .delete();
    },
    // get reviews for campsite
    getCampsiteReviews(db, campsite_id){
        console.log('type of campsite id', typeof campsite_id);
        
        return db.raw(`select reviews.id, reviews.text, reviews.rating, 
        to_char(reviews.date_created, 'DD-MM-YY'), 
        users.user_name from reviews, users 
        where (reviews.user_id = users.id and reviews.campsite_id = ${campsite_id})`);
        
    },
    serializeReviews(site) {
        return {
            id: site.id,
            text: xss(site.text),
            rating: site.rating,
            date_created: site.to_char,
            author: xss(site.user_name)
        }
    },
    serializeCampsites(site){
       if(typeof site === 'string'){
            site = JSON.parse(site);
            console.log('type of site change: ', typeof site);
            console.log(site, 'id for site attempting');
        };
        if (typeof site.number_of_reviews === 'undefined'){
            console.log('serialized without reviewsj');
            return {
                id: site.id,
                img: site.img,
                name: xss(site.name),
                description: xss(site.description),
                park: xss(site.park),
                city: xss(site.city),
                state: xss(site.state),
            }
        }else{
           
            return {
                id: site.id,
                img: site.img,
                name: xss(site.name),
                description: xss(site.description),
                park: xss(site.park),
                city: xss(site.city),
                state: xss(site.state),
                number_of_reviews: site.number_of_reviews,
                avg_reviews: site.avg_reviews
            }
        }
    },

}

module.exports = campsiteServices;