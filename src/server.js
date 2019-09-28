const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')

// setting db url
const db = knex({
    client: 'pg',
    connection: DATABASE_URL,
})

// db.on('query', console.log);

app.set('db', db)

app.get('/api/*', (req, res) => {
    res.json({ ok: true });
});

// initialize server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
