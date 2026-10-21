let written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	written_tweets = tweet_array.filter(t => t.written);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const search = document.getElementById('textFilter');
	search.addEventListener('input', function() {
		const text = search.value;
		const table = document.getElementById('tweetTable');

		document.getElementById('searchText').innerText = text;

		if (text == '') {
			table.innerHTML = '';
			document.getElementById('searchCount').innerText = '0';
			return;
		}

		const matches = written_tweets.filter(t =>
			t.writtenText.toLowerCase().includes(text.toLowerCase())
		);

		document.getElementById('searchCount').innerText = String(matches.length);

		let rows = '';
		for (let i = 0; i < matches.length; i++) {
			rows += matches[i].getHTMLTableRow(i + 1);
		}
		table.innerHTML = rows;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});