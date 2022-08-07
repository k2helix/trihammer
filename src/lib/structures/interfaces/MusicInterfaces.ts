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
	skip: string[];
}

export { Song };
