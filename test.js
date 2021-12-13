let object = {
	weeks: 0,
	years: 0,
	months: 0,
	days: 0,
	hours: 0,
	minutes: 0,
	seconds: 0
};
function humanize(object) {
	let arr = [];
	let array = Object.keys(object);
	array.forEach((key) => {
		let index = array.indexOf(key);
		let value = object[key];
		if (key !== 'minutes' && !value && index !== array.length - 1 && !array.some((v) => array.indexOf(v) < index && object[v])) return;
		if (value < 10) value = '0' + value;
		arr.push(value.toString());
	});
	return arr;
}
console.log(humanize(object));
