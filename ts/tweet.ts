class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        // completed: "just completed" (start)
        // achievement: "achieved" (start)
        // live: "#RKLive" (includes)
        // misc: none of the above
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event"
        }
        else if (this.text.startsWith("Achieved") || this.text.startsWith("I just set a goal")) {
            return "achievement"
        }
        else if (this.text.includes("#RKLive")) {
            return "live_event"
        }
        else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.source != 'completed_event') {
            return false;
        }
        const stripped_text = this.text
            .replace(/https?:\/\/\S+/g, '')
            .replace(/#RunKeeper/gi, '')
            .trim();
        if (stripped_text.includes(' - ')){
            if (stripped_text.includes('TomTom MySports')){
                return false;
            }
            return true;
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        const stripped_text = this.text
            .replace(/https?:\/\/\S+/g, '')
            .replace(/#RunKeeper/gi, '')
            .trim();
        const dash = stripped_text.indexOf(' - ');
        return stripped_text.substring(dash + 3).trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        // get the position of the distance and then get the activity until
        // ' - ' or 'with @RunKeeper' or 'right now'
        // or after 'watch my' until 'right now'
        const twt = this.text.split(' ');
        let unitIndex = twt.indexOf('km');
        if (unitIndex == -1) {
            unitIndex = twt.indexOf('mi');
        }
        if (unitIndex == -1) {
            return "unknown";
        }

        let activity = "";
        for (let i = unitIndex + 1; i < twt.length; i++) {
            if (twt[i] == 'with' || twt[i] == '-' || twt[i].startsWith('http')) {
                break;
            }
            activity += twt[i] + " ";
        }
        return activity.trim().toLowerCase();
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        // get the index of km or mi and get whatever number is before that?
        const twt = this.text.split(' ');
        const km = twt.indexOf('km');
        const mi = twt.indexOf('mi');
        if (km != -1) {
            return parseFloat(twt[km - 1]) / 1.609;
        }
        if (mi != -1) {
            return parseFloat(twt[mi - 1]);
        }
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        const words = this.text.split(' ');
        let link = "";
        for (let i = 0; i < words.length; i++) {
            if (words[i].startsWith('http')) {
                link = words[i];
                break;
            }
        }
        let linkedText = this.text;
        if (link !== "") {
            linkedText = this.text.replace(link, '<a href="' + link + '">' + link + '</a>');
        }
        return '<tr><td>' + rowNumber + '</td><td>' + this.activityType + '</td><td>' + linkedText + '</td></tr>';
    }
}