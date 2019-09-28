SUMMARY

Rate My Campsite Server handles everything from user login
to adding new sites, reviews, users to a Postgresql database.
This website uses expirable web tokens that need refreshing at a regular
basis.
The technologies used are: Postgresql, Express.js, JWT-webtoken.

DOCUMENTATION

To get a list of all campsites '/api/campsites/'
the information here can be sorted into to two seperate categories: 
average rating and number ofreviews. To sort into those categories all we have to do is: '/api/campsites/?order=average'.

We can also get campsite by id with '/api/campsites/:id'.

Getting reviews for the campsite chosen is easy we use '/api/campsites/:campsite_id/reviews/'

Edit a posted campsite using a post to '/api/campsites/:id'

To insert you must be logged in to insert a new campsite.
The way to insert is a post reqest to '/api/campsites/'
It MUST contain these in the body tag: img, name, description, park, city, state.

Creating a new user '/api/users/new-user/'
A new user is sent in the body with these parameter: password, user_name, email, full_name. The email and user name MUST be unique. Once logged in a new token is sent and the user is logged in.

Login is at '/api/auth/login'
MUST contain username and password.

Now you're logged in the auth token now needs to be refreshed regularly.
Make a refresh request at '/api/auth/refresh'

What if your user forgets their password?
A new password takes three seperate requests in this order:
'/api/reset/forgot'. The body MUST contain an email. 
if the user exits a message will be sent to the users email and a json message will be from the api.

The email has been sent now the user clicks the email.
We have to validate the token sent in the email.
'/api/reset/reset-check/' this checks if the token has expired or is still valid.
There can only be a single request per valid token on this link.

Finally we have to update the user password. 
'/api/reset/reset-password' the body must contain the username aquired from the validation and the new password.