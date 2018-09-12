
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

// TODO: array routes.length === timelines.length
app.get(`/api/tweets/${timelines[0]}`, (req, res) => {
  const filtered = Object.values(data).filter( v => v['screen_name'] === timelines[0]);
  res.send(filtered);
});

app.get(`/api/tweets/${timelines[1]}`, (req, res) => {
  const filtered = Object.values(data).filter( v => v['screen_name'] === timelines[1]);
  res.send(filtered);
});

app.get(`/api/tweets/${timelines[2]}`, (req, res) => {
  const filtered = Object.values(data).filter( v => v['screen_name'] === timelines[2]);
  res.send(filtered);
});

app.get('/', (req, res) => {
  //TODO: serve index html
  res.send('My awesome TweetDeck')
});

app.listen(3000, () => console.log('Listening on port 3000...'));
