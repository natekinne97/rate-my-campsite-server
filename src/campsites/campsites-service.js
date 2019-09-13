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
                    db.raw(
                        `json_strip_nulls(
                            json_build_object(
                                'id', 'rev.id',
                                'text', 'rev.text',
                                'rating', 'rev.rating',
                                'campsite_id', 'rev.campsite_id'
                          )
                     ) AS "reviews"`
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
                .select('*')
                .where('camp.id', id)
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
        return db.from('reviews AS rev')
                .select(
                    'rev.id',
                    'rev.text',
                    'rev.rating',
                    'rev.campsite_id',
                    'rev.date_created'
                    )
                .where('rev.campsite_id', campsite_id);
    },
    serializeReviews(site){
        console.log(site)
        return{
            id: site.id,
            text: xss(site.text),
            rating: site.rating,
            campsite_id: site.campsite_id,
            date_created: site.date_created
        }
    },
    serializeCampsites(site){
        return {
            id: site.id,
            img: xss(site.img),
            name: xss(site.name),
            description: xss(site.description),
            park: xss(site.name),
            city: xss(site.city),
            state: xss(site.state),
            number_of_reviews: site.number_of_reviews,
            avg_reviews: site.avg_reviews
        }
    }
}

module.exports = campsiteServices;