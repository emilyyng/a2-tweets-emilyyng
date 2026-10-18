function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	
	// tweet data
	sorted_tweet_array = tweet_array.sort(function(a, b) {
    	return a.time - b.time;
  	});
	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC"
	};
	document.getElementById('firstDate').innerText = sorted_tweet_array[0].time.toLocaleDateString('en-US', options)
	document.getElementById('lastDate').innerText = sorted_tweet_array[sorted_tweet_array.length - 1].time.toLocaleDateString('en-US', options)

	// tweet categories
	function setText(className, value) {
		const elements = document.getElementsByClassName(className);
		for (let i = 0; i < elements.length; i++) {
			elements[i].innerText = value;
		}
	}

	function percentage(count, total) {
		return math.format((count / total) * 100, { notation: 'fixed', precision: 2 }) + '%';
	}

	const total = tweet_array.length;
	const completed_event = tweet_array.filter(t => t.source === 'completed_event').length;
	const live_event = tweet_array.filter(t => t.source === 'live_event').length;
	const achievement = tweet_array.filter(t => t.source === 'achievement').length;
	const miscellaneous = tweet_array.filter(t => t.source === 'miscellaneous').length;

	setText('completedEvents', String(completed_event));
	setText('completedEventsPct', percentage(completed_event, total));

	setText('liveEvents', String(live_event));
	setText('liveEventsPct', percentage(live_event, total));

	setText('achievements', String(achievement));
	setText('achievementsPct', percentage(achievement, total));

	setText('miscellaneous', String(miscellaneous));
	setText('miscellaneousPct', percentage(miscellaneous, total));
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});