function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const completed = tweet_array.filter(t => t.source === 'completed_event' && t.activityType !== 'unknown');

	const counts = {};
	completed.forEach(t => {
		counts[t.activityType] = (counts[t.activityType] || 0) + 1;
	});

	const activity_counts = Object.keys(counts).map(type => ({ activityType: type, count: counts[type] }));
	activity_counts.sort((a, b) => b.count - a.count);
	const top3 = activity_counts.slice(0, 3).map(a => a.activityType);

	document.getElementById('numberActivities').innerText = String(activity_counts.length);
	document.getElementById('firstMost').innerText = top3[0];
	document.getElementById('secondMost').innerText = top3[1];
	document.getElementById('thirdMost').innerText = top3[2];
	
	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activity_counts
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
		"x": { "field": "activityType", "type": "nominal", "sort": "-y", "title": "Activity type" },
		"y": { "field": "count", "type": "quantitative", "title": "Number of tweets" }
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});