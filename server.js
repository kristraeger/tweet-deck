
const spawn = require('child_process').spawn;
const express = require('express');
const app = express();
const service = require('./service');

/*
  Create child process and set up proxy server for Twitter.
*/

// TwitterAPI available on http://localhost:7980
spawn('twitter-proxy');

/*
  Serve static files.
*/

app.use(express.static('public'))

/*
  Create api for tweets.
*/

const timelines = service.app_settings.screen_names;

// global data object
let data = (() => {
  service.getTweets()
  .then(res => {
    if(res.name === 'Error'){
      console.log('exception when loading tweets from service')
    } else {
      console.log('tweets loaded successfully')
    }
    return data = res
  })
  .catch(err => {
    console.log('could not get tweets')
    return data = err
  })
})();

app.get('/api/tweets', (req, res) => {
  res.send(data)
});

app.get('/api/tweets/:screen_name', (req, res) => {
  const filtered = (() => {
    if(req.params.screen_name && timelines.includes(req.params.screen_name.toLowerCase())){
      return Object.values(data)
            .filter( v => v['screen_name'] === req.params.screen_name.toLowerCase());
    } else return false
  })();
  if(!filtered) res.status(404).send('Timeline with given /:screen_name cannot be found')
  res.send(filtered);
});

/*
  Set environment variables.
*/
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on ${port}`));
