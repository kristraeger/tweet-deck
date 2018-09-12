
/*
  Create child process and set up proxy server for Twitter.
*/

const spawn = require('child_process').spawn;

spawn('twitter-proxy'); // TwitterAPI available on http://localhost:7980

/*
  Create dev server.
*/

// spawn('http-server'); // defaults to :8080
//console.log('Server running on http://localhost:8080');

/*
  Create dev server and serve tweets to front end.
*/
const service = require('./service.js');

const timelines = service.app_settings.screen_names;

const http = require('http');

const server = http.createServer( (req, res) => {

    service.getTweets()
      .then( data => {

        // all timelines
        if(req.url === '/api/tweets'){
          res.write(JSON.stringify(data))
          res.end()
        }

        // dynamically create routes depending on
        // how many timelines the user is requesting
        if(req.url === `/api/tweets/${timelines[0]}`){
          const filtered = Object.values(data).filter( v => v['screen_name'] === timelines[0])
          res.write(JSON.stringify(filtered))
          res.end()
        }

        if(req.url === `/api/tweets/${timelines[1]}`){
          const filtered = Object.values(data).filter( v => v['screen_name'] === timelines[1])
          res.write(JSON.stringify(filtered))
          res.end()
        }

        if(req.url === `/api/tweets/${timelines[2]}`){
          const filtered = Object.values(data).filter( v => v['screen_name'] === timelines[2])
          res.write(JSON.stringify(filtered))
          res.end()
        }





      })
      .catch( err => {
        console.log(`could not get data from service: ${err}`)
      });


}); // end createServer()

server.listen(3000, () => {
  console.log('Listening on port 3000');
});




//TODO: display in browser
