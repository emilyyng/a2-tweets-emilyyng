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
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const distance_data = completed
		.filter(t => top3.includes(t.activityType))
		.map(t => ({
			activityType: t.activityType,
			day: days[t.time.getDay()],
			distance: t.distance
		}));
	
	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distance by day of the week for the three most tweeted activities.",
		"data": { "values": distance_data },
		"mark": "point",
		"encoding": {
			"x": { "field": "day", "type": "ordinal", "sort": days, "title": "Day of week" },
			"y": { "field": "distance", "type": "quantitative", "title": "Distance (mi)" },
			"color": { "field": "activityType", "type": "nominal", "title": "Activity" }
		}
	};

	distance_agg_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Mean distance by day of the week for the three most tweeted activities.",
		"data": { "values": distance_data },
		"mark": "point",
		"encoding": {
			"x": { "field": "day", "type": "ordinal", "sort": days, "title": "Day of week" },
			"y": { "aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Mean distance (mi)" },
			"color": { "field": "activityType", "type": "nominal", "title": "Activity" }
		}
	};

	vegaEmbed('#distanceVis', distance_vis_spec, { actions: false });
	vegaEmbed('#distanceVisAggregated', distance_agg_spec, { actions: false });

	document.getElementById('distanceVisAggregated').style.display = 'none';
	const button = document.getElementById('aggregate');
	button.addEventListener('click', function() {
		const raw = document.getElementById('distanceVis');
		const agg = document.getElementById('distanceVisAggregated');
		if (agg.style.display === 'none') {
			agg.style.display = 'block';
			raw.style.display = 'none';
			button.innerText = 'Show all activities';
		} else {
			agg.style.display = 'none';
			raw.style.display = 'block';
			button.innerText = 'Show means';
		}
	});

	top3.forEach(type => {
		const dists = distance_data.filter(d => d.activityType === type).map(d => d.distance);
		const mean = dists.reduce((sum, x) => sum + x, 0) / dists.length;
		console.log(type + ' mean distance: ' + mean.toFixed(2));
	});
	
	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';
	document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});