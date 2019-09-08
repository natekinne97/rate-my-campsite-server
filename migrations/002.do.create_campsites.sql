CREATE TABLE campsites(
    id SERIAL PRIMARY KEY,
    img TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    park TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL
    
);

-- must be altered when all of the routes have been made