const knex = require('knex')
// const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./campsite-helper');

describe('Protected endpoints', ()=>{
    let db;

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

    beforeEach('inserting data to db', ()=>{
        return helpers.seedCampsites(
            db,
            campsites
        ).then(res => {
            console.log('campsites into db')
            return  helpers.seedReviews2(db, users, reviews).then(res => {
                console.log('reviews added');
            }).catch(error => console.log(error, 'error'));
        })
    })

    const protectedEndpoints = [
        {
            name: 'POST /api/reviews/',
            path: '/api/reviews/',
            method: supertest(app).post
        },
        {
            name: 'POST /api/campsites/',
            path: '/api/campsites/',
            method: supertest(app).post
        },
        {
            name: 'POST /api/auth/refresh',
            path: '/api/auth/refresh',
            method: supertest(app).post,
        },
    ];

    protectedEndpoints.forEach(endpoint => {
        describe(endpoint.name, () => {
            it(`responds 401 'Missing bearer token' when no bearer token`, () => {
                return endpoint.method(endpoint.path)
                    .expect(401, { error: `Missing bearer token` })
            })

            it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = users[0]
                const invalidSecret = 'bad-secret'
                return endpoint.method(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, { error: `Unauthorized request` })
            })

            it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = { user_name: 'user-not-existy', id: 1 }
                return endpoint.method(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, { error: `Unauthorized request` })
            })
        })
    })
})