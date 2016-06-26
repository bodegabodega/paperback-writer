var Writer = require('./index.js');

var write = new Writer({
	directory: 'test-data',
	mode: 2
});
write.ln('Something');
write.mode = 1;
write.ln('another thing');