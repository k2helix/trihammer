interface Song {
	id: string;
	title: string;
	duration: string;
	durationInSec: number;
	channel: {
		url: string;
		name: string;
	};
	url: string;
	requested: string;
	seek: number;
	tryAgainFor: number;
	skip: string[];
}

export { Song };
