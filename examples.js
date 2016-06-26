var Writer = require('./index.js');

var write = new Writer({
	directory: 'test-data',
	// inspect: false,
	mode: 2
});
var obj = {
	something: 1,
	another: 'Here we go',
	andanother: {
		anarray: ['something', 9, false]
	}
}
console.log(obj.toString());
write.ln(obj);
