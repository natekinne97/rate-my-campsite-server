BEGIN;

TRUNCATE
  reviews,
  campsites
  RESTART IDENTITY CASCADE;




-- populate campsites
INSERT INTO campsites(img, name, description, park, city, state)
    VALUES
        ('https://i.imgur.com/ELRFWHvb.jpg', 'Bayou place', 'A beautiful bayou great for fishing', 'Okefenokee Swamp National Park', 'Williamsburg', 'Georgia'),
        ('https://i.imgur.com/JGdoWLe.jpg', 'Mountain Place', 'Perched atop a mountain meadow this site offers great birdwatching', 'Black Mountain',  'Boise', 'Idaho'),
        ('https://i.imgur.com/RhdiHIv.jpg', 'Mountain Place', 'In this beautiful valley a few miles down a dirt road offers a wonderful chance to find elk.', 'Mt. Yale','Salida', 'Colorado'),
        ('https://i.imgur.com/H71AHhKb.jpg', 'Canyon Ledge', 'A gorgeous view of the grand canyon', 'Grand Canyon National Park','Phoenix', 'Arizona');

-- populate reviews
INSERT INTO reviews(text, rating, campsite_id)
    VALUES
        ('totally awesome', 5, 1),
        ('Really great. Kind of a long hike', 4, 2),
        ('Kinda lame. Not worth it', 1, 1),
        ('Great I love it', 5, 1),
        ('Great I love it', 5, 1),
        ('Great I love it', 5, 1);
        

COMMIT;