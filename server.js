
/*
  Create child process and set up proxy server for Twitter.
*/
const spawn = require('child_process').spawn;
// TwitterAPI available on http://localhost:7980
// NOTE:needs to come before express
spawn('twitter-proxy');

const express = require('express');
const app = express();
const helmet = require('helmet')
const service = require('./service');

/*
 Secure your Express app by setting various HTTP headers.
*/
// enable DNS lookups for load performance
app.use(helmet({ dnsPrefetchControl: { allow: true }}));

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
