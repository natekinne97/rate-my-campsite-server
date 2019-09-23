const knex = require('knex')
// const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./campsite-helper');

// seeds and tests all campsite router endpoints
describe('campsite endpoints', function(){
    
    
    const campsites = helpers.makeCampsitesArray();
    const reviews = helpers.makeReviewArray();
    const users = helpers.makeUserArray();
    
    // connect to db
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })
    // destroy connection
    after('disconnect from db', () => db.destroy())
    // remove data before tests
    before('cleanup', () => helpers.cleanTables(db))
    // remove data after tests
    afterEach('cleanup', () => helpers.cleanTables(db))
    
    describe('get all campsites and get campsite by id', function(){
        beforeEach('insert campsites', ()=>{
            // seed campsites
            return helpers.seedCampsites(
                db, 
                campsites
            ).then(res=>{
                console.log('campsites into db')
                return  helpers.seedReviews2(db, users, reviews).then(res => {
                    console.log('reviews added');
                }).catch(error => console.log(error, 'error'));
            })
            // seed users
            // helpers.seedUsers(db, users).then(res =>{
            //     console.log(res, 'users inserted to db')
            // });
            
            // seed reviews
          

        })
        // passes
        it('get all campsites', function(){
            return supertest(app)
                    .get('/api/campsites/')
                    .expect(200, campsites);
        });
        // passes
        it('campsite by id', function(){
            return supertest(app)
                    .get('/api/campsites/1')
                    .expect(200, campsites[0]);
        });
        // get all reviews for campsite
        // it('returns all reviews for campsite', function(){
        //     return supertest(app)
        //             .get('/api/campsites/1/reviews')
        //             .expect(200, reviews);
        // });

    });


});