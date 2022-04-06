Setup after cloning repo:
- Add a .env file in the base hierarchy with your MongoDB Atlas link to connect to the MongoDB database

MONGOATLAS_URL = ...

**Inspiration**
Most of us have been playing music from a young age, and many of us have been part of our school's band. During band, students played their separate parts together to produce a cohesive sound, but this experience was turned completely upside down during the pandemic. One obvious workaround music educators can employ is editing individual recordings from students into a single recording, but this is incredibly time intensive when done by hand. That's why we created MuSync.

**What it does**
MuSync is a web app that takes the difficult task of syncing recordings and streamlines it to create a perfect output track, allowing musicians to co-create no matter where they are in the world.

**How we built it**
The lobby web app system was built with React, NodeJS and MongoDB. Each lobby that was created became a new MongoDB collection, which could store multiple player objects that each included a name, mp3 file converted to a base 64 string, and an id. The server takes all the mp3 files from all the objects in a particular lobby, and once the conductor ends recording, we run parsing/processing logic, using tons of npm packages/documentation to help out, to merge the mp3 files together and return it to the lobby.

**Challenges we ran into**
While hosting on Heroku, our static files were hosted but our nodeJS server wouldn't do any server or database actions. At first it was a problem with the dyno configuration, then axiosConfigs not getting overridden, and this began a 2 hour loop hole of challenges that kept our nodeJS server from running on any device that went to that url. Additionally, our base 64 data often got corrupted or would have zero channels, so they couldn't always be recreated as mp3 files.

**Accomplishments that we're proud of**
We're proud of understanding "react-media-recorder" and really diving deep into its documentation, which gave us plenty of audio-related hooks and functions (pause, stop, clear, get the mediaURL as a blob) to allow users to record audio on the client side, but only when the conductor/server tells them they can. Furthermore, we're proud of designing an aesthetic logo and purple background with music notes etched into it.

**What we learned**
In the end, we learned that two brains work better than one when we run into bugs. We also learned that MongoDB can create collections with variable names (unlike PostgreSQL, at least not easily by any means). This allows us to use params in put, get requests that have parameters which indicate which collection to enter.

**What's next for MuSync**
Our initial MVP was very barebones, but we wish to add more audio processing capabilities. Currently our app simply combines the separate audio tracks with little processing, but later we want to add noise cancellation/clean-up and volume balancing. We can also integrate our app with services such as Google Drive and Dropbox to make working with our project easy. We still have issues with supporting all platforms such as Google Chrome, but we plan to look into platform-specific issues as well.
