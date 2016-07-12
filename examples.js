var Writer = require('./index.js');

// The constructor with the default properties set
var write = new Writer({
	directory: null, //a directory to write the file to e.g. './place/to-write'
	basename: 'paperback', // the basename of the file.
	timestamp: true, // whether or not to appeand a timestamp to the filename
	timestampFormat: 'MM-DD-YY-h:mm:ss-a', // the format of the timestamp using momentjs formatting
	extension: 'txt' , // the file extension of the file
	mode: Writer.CONSOLE, // the mode to use for the ln() function
	inspect: true // whether or not util.inspect is used for each ln call
});
// You can write a line using the ln() function. The mode determines where the output goes
write.ln('something');


var obj = {
	something: 1,
	another: 'Here we go',
	andanother: {
		anarray: ['something', 9, false]
	}
}

write.ln(obj);
