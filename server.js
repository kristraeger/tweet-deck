
/*
  Create child process and set up proxy server for Twitter.
*/

const spawn = require('child_process').spawn;

// this way, we don't need to authenticate :)
// TwitterAPI available on http://localhost:7980
spawn('twitter-proxy');

/*
  Create dev server.
*/

const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

/*
  Create api for tweets.
*/

const service = require('./service.js');

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
    } else {
      return `hmmh, can't find a timeline for ${req.params.screen_name}! typo?`
    }
  })();

  res.send(filtered);
});

app.get('/', (req, res) => {
  //TODO: serve index html
  res.send('My awesome TweetDeck')
});

app.listen(3000, () => console.log(`Listening on ${port}`));
