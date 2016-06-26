'use strict';

var moment = require('moment'),
		 _ = require('lodash'),
	mkdirp = require('mkdirp'),
		fs = require('fs'),
	  util = require('util');

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
 *  - inspect (true): whether or not util.inspect is used for each ln call
 */
class PaperbackWriter {
	constructor(opts) {
		this.options = _.defaults({}, opts, {
			'directory': null,
			'basename': 'paperback', // filename to create
			'timestamp': true, // whether or not to appeand a timestamp to the filename
			'timestampFormat': 'MM-DD-YY-h:mm:ss-a', // the format of the timestamp
			'extension': 'txt', // the file extension of the log
			'mode': 2,
			'inspect': true
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
	 * Whether or not to inspect the ln() calls
	 */
	get inspect() {
		return this._inspect;
	}
	/**
	 * Sets whether or not to inspect the ln() calls
	 */
	set inspect(value) {
		if(this._inspect !== value) {
			this._inspect = value;

			this.format = (this._inspect) ? function(arg) {
				return util.inspect(arg);
			} : function(arg) {
				return arg.toString();
			}
		}
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
	lnc(arg) {
		console.log(this.format(arg));
		return this;
	}
	/**
	 * Line writing utility
	 */
	lnff(arg) {
		this.stream.write(`${arg}\n`);
	}
	/**
	 * Sets the ln() function using the current mode
	 */
	setLnFunction() {
		switch(this.mode) {
			case this.BOTH :
				this.lnFn = function(arg) {
					this.lnc(arg);
					this.lnf(arg);
				}
				break;
			case this.CONSOLE :
				this.lnFn = this.lnc;
				break;
			case this.FILE :
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
		// Modes
		// TODO Switch modes to be bit flags
		this.BOTH = 1;
		this.CONSOLE = 2;
		this.FILE = 3;

		this.mode = this.options.mode;
		this.inspect = this.options.inspect;
		this.lnfFn = this.initFileLog;
	}
}

module.exports = PaperbackWriter;