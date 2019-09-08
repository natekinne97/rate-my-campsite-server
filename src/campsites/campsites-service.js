const xss = require('xss');

const campsiteServices= {
    // get every campsite
    getAllSites(db){
        return db.from('campsites')
                .select('*');
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
    serializeCampsites(site){
        return {
            id: site.id,

        }
    }
}

module.exports = campsiteServices;