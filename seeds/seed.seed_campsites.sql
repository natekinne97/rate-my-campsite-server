BEGIN;

TRUNCATE
  reviews,
  campsites,
  users
  RESTART IDENTITY CASCADE;

-- insert new user values
INSERT INTO users(user_name, full_name, email,  password)
VALUES
  -- muffun-stuff      email      blah@gmail.com
  ('dunder', 'Dunder Mifflin', 'blah@gmail.com', '$2a$12$3MsnYDHU0g.FBXkHU5qNiOVM/KT.2LXho7D6TZwbOKLFJBmSbHFbG'),
  -- boward-word      email,  bodoop@gmail.com
  ('b.deboop', 'Bodeep Deboop', 'bodoop@gmail.com', '$2a$12$nt8./ljTB2nPzcncvT51OOTl2AvWkDwQx0Fc70d8dB.VwKx.lKJRe'),
  -- charzard              email  personal
  ('c.bloggs', 'Charlie Bloggs', 'nathan.kinne@gmail.com', '$2a$12$I7iresCXsABro/2L1XnAaOKPIqxMHvyWG/YugMlqf4HYxODNMRzM6'),
  -- samword          samsmith@gmail.com
  ('s.smith', 'Sam Smith', 'samsmith@gmail.com', '$2a$12$qkJ4CkTXE5TzeplM5IUs4eVhkvUNm4/IE1H9jdPUPD2jPNSgpkRHq'),
  -- lex-password     email ataylor@gmail.com
  ('lexlor', 'Alex Taylor', 'ataylor@gmail.com', '$2a$12$9YDhqae2Hqt.w9io46C1fO/is48ebGbA0vRSX8xtHcVtX30TAPjd2'),
  -- ping-password            wippy@gmail.com
  ('wippy', 'Ping Won In', 'wippy@gmail.com', '$2a$12$/jAv6ITFFzjO4kaGUK6M5O2cy2OUv3hj8i0HnsPR4CPMCIdRrr5G6');


-- populate campsites
INSERT INTO campsites(img, name, description, park, city, state)
    VALUES
        ('https://i.imgur.com/ELRFWHvb.jpg', 'Bayou place', 'A beautiful bayou great for fishing', 'Okefenokee Swamp National Park', 'Williamsburg', 'Georgia'),
        ('https://i.imgur.com/JGdoWLe.jpg', 'Mountain Place', 'Perched atop a mountain meadow this site offers great birdwatching', 'Black Mountain',  'Boise', 'Idaho'),
        ('https://i.imgur.com/RhdiHIv.jpg', 'Mountain Meadow', 'In this beautiful valley a few miles down a dirt road offers a wonderful chance to find elk.', 'Mt. Yale','Salida', 'Colorado'),
        ('https://i.imgur.com/H71AHhKb.jpg', 'Canyon Ledge', 'A gorgeous view of the grand canyon', 'Grand Canyon National Park','Phoenix', 'Arizona');

-- populate reviews
INSERT INTO reviews(text, rating, campsite_id, user_id)
    VALUES
        ('totally awesome', 5, 1, 1),
        ('Really great. Kind of a long hike', 4, 2, 2),
        ('Kinda lame. Not worth it', 1, 1, 3),
        ('Great I love it', 5, 1, 3),
        ('Great I love it', 5, 1, 2),
        ('Great I love it', 5, 1, 3);
        

COMMIT;