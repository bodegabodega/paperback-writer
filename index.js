'use strict';

var moment = require('moment'),
		 _ = require('lodash'),
	mkdirp = require('mkdirp'),
		fs = require('fs'),
	  util = require('util');

// TODO Add docco to project and make docs
// TODO Use bitwise operators for the mode
// TODO Create README

/**
 * Creates a PaperbackWriter
 *
 * The following options are available:
 *  - directory (null): a directory to write the file to e.g. './place/to-write'
 *  - basename ('paperback'): the basename of the file.
 *  - timestamp (true): whether or not to appeand a timestamp to the filename
 *  - timestampFormat ('MM-DD-YY-h:mm:ss-a'): the format of the timestamp using momentjs formatting
 *  - extension ('txt'): the file extension of the file
 *  - mode (CONSOLE): the mode to use for the ln() function
 */
class PaperbackWriter {
	constructor(opts) {
		this.options = _.defaults({}, opts, {
			'directory': null,
			'basename': 'paperback', // filename to create
			'timestamp': true, // whether or not to appeand a timestamp to the filename
			'timestampFormat': 'MM-DD-YY-h:mm:ss-a', // the format of the timestamp
			'extension': 'txt', // the file extension of the log
			'mode': 2
		});
		this.initialise();
	}
	/**
	 * The mode used when writing using ln
	 */
	get mode() {
		return this._mode;
	}
	/**
	 * Sets the mode used when writing using ln
	 *
	 * Available modes:
	 * BOTH: ln() calls get written to the console and the file
	 * CONSOLE: ln() calls only get written to the console
	 * FILE: ln() calls only get written to the file.
	 */
	set mode(value) {
		if (this._mode !== value) {
			this._mode = value;
			this.setLnFunction();
		}
	}
	/**
	 * The filename based on the options set
	 */
	get filename() {
		if (!this._filename) {
			this._filename = this.options.basename;
			if(this.options.timestamp) this._filename += `-${moment().format(this.options.timestampFormat)}`;
			if(this.options.extension) this._filename += `.${this.options.extension}`;
		}
		return this._filename;
	}
	/**
	 * The filepath based on the filename and options set
	 */
	get filepath() {
		if (!this._filepath) {
			this._filepath = (this.options.directory) ? `${this.options.directory}/${this.filename}` : this.filename;
		}
		return this._filepath;
	}
	/**
	 * Writes a line using the mode that is set
	 */
	ln(arg) {
		this.lnFn(arg);
		return this;
	}
	/**
	 * Writes a line to the file
	 */
	lnf(arg) {
		this.lnfFn(arg);
		return this;
	}
	/**
	 * Writes a line to the console
	 */
	lnc() {
		let out = util.format.apply(this, arguments);
		console.log(`[${this.options.basename}] ${out}`);
		return this;
	}
	/**
	 * Line writing utility
	 */
	lnff() {
		let out = util.format.apply(this, arguments);
		this.stream.write(`${out}\n`);
	}
	/**
	 * Sets the ln() function using the current mode
	 */
	setLnFunction() {
		switch(this.mode) {
			case this.constructor.BOTH :
				this.lnFn = function(arg) {
					this.lnc(arg);
					this.lnf(arg);
				}
				break;
			case this.constructor.CONSOLE :
				this.lnFn = this.lnc;
				break;
			case this.constructor.FILE :
				this.lnFn = this.lnf;
				break;
			default :
				throw new Error('Unknown mode set');
				break;
		}
	}

	/**
	 * Creates the file log, writes the first line and then resets the ln() function
	 */
	initFileLog(arg) {
		if(this.options.directory) {
			mkdirp.sync(this.options.directory);
		}
		this.stream = fs.createWriteStream(this.filepath, {
			'flags': 'a'
		});
		this.lnfFn = this.lnff;
		this.lnf(arg);
	}
	/**
	 * Initialise's this instance
	 */
	initialise() {
		this.mode = this.options.mode;
		this.inspect = this.options.inspect;
		this.lnfFn = this.initFileLog;
	}
}

PaperbackWriter.BOTH = 1;
PaperbackWriter.CONSOLE = 2;
PaperbackWriter.FILE = 3;

module.exports = PaperbackWriter;