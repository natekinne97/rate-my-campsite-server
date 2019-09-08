CREATE TABLE reviews(
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    rating INTEGER NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    campsite_id INTEGER
       REFERENCES campsites(id) ON DELETE CASCADE NOT NULL,
);