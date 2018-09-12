const rp = require('request-promise');

module.exports = {

/*
  App settings for requesting tweets.
*/

app_settings: {
    count: '30',
    screen_names: [
      'makeschool',
      'ycombinator',
      'newsycombinator'
    ]
  },

/*
  Request tweets.
*/

request_base_url:'http://localhost:7890/1.1/statuses/user_timeline.json',
// TODO: update feed in real-time
feed: [],
// TODO: memoize, only load new data
fetch(url){
  // fetch all tweets from one timeline
    console.log(`fetching ${url}`)

    const options = {
      uri: url,
      json: true
    };

    return rp(options)
      .then( res => { return res } )
      .catch( err => { console.log(err) } )
},
async getTweets(){
    // request all timelines parallel
    const screen_name_arr= this.app_settings.screen_names.map(async screen_name => {
      const response = await this.fetch(`${this.request_base_url}\?count\=${this.app_settings.count}\&screen_name\=${screen_name}`);
      return { screen_name, response }
    });

    // wait for all requests to be settled
    let all = await Promise.all(screen_name_arr);

    return all

  }, // end getTweets()

}; // end module.exports
