'use strict';

var should = require('should'),
	Writer = require('../index'),
		fs = require('fs'),
		fn = {};

var	exists = function fileExists(filename){
	try {
		require('fs').accessSync(filename, fs.F_OK);
		return true;
	} catch( e ) {
		return false;
	}
};
var mute = function() {
	fn.log = console.log;
	console.log = function(){};
};
var unmute = function() {
	console.log = fn.log;
};

describe('Paperback Writer', function() {
	describe('initialisation', function() {
		it('should have a filename with sensible defaults without any options set', function() {
			let inst = new Writer({
				directory: 'test-data'
			});
			inst.filename.should.match(/paperback[0-9\-\:apm]+\.txt/);
		})
		it('should let you specify the name and extension of the file', function() {
			let inst = new Writer({
				directory: 'test-data',
				basename: 'writer',
				extension: 'log'
			});
			inst.filename.should.match(/writer[0-9\-\:apm]+\.log/);
		})
		it('should let you remove the timestamp of the file', function() {
			let inst = new Writer({
				directory: 'test-data',
				basename: 'writer',
				extension: 'txt',
				timestamp: false
			});
			inst.filename.should.match(/writer\.txt/);
		})
		it('should let you specify the timestamp format of the file', function() {
			let inst = new Writer({
				directory: 'test-data',
				basename: 'writer',
				extension: 'txt',
				timestampFormat: 'YYYY'
			});
			inst.filename.should.match(`writer-${new Date().getFullYear()}.txt`);
		})
		it('should throw an error if you set the mode to something invalid', function(){
			try { new Writer({ mode: 100}); }
			catch(e) { e.message.should.eql('Unknown mode set'); }
			try { new Writer().mode = 100; }
			catch(e) { e.message.should.eql('Unknown mode set'); }
		})
	});
	describe('file initialisation', function() {
		it('should not create a file if you don\'t write a line', function(){
			let name = new Date().getTime();
			let inst = new Writer({
				directory: 'test-data',
				basename: name,
				extension: 'txt',
				timestamp: false
			});
			let fname = `./test-data/${name}.txt`;
			exists(fname).should.be.false();
			// make sure file doesn't exist
		})
		it('should not create a file if you set console mode and write a line', function(){
			mute();
			let name = new Date().getTime();
			let inst = new Writer({
				directory: 'test-data',
				basename: name,
				extension: 'txt',
				timestamp: false,
				mode: 2
			});
			inst.ln('dont do too much');
			let fname = `./test-data/${name}.txt`;
			exists(fname).should.be.false();
			unmute();
		})
		it('should create a file if you change the mode after initialisation', function(){
			mute();
			let name = new Date().getTime();
			let inst = new Writer({
				directory: 'test-data',
				basename: name,
				extension: 'txt',
				timestamp: false,
				mode: 2
			});
			inst.ln('dont do too much');
			let fname = `./test-data/${name}.txt`;
			// make sure file doesn't exist
			inst.mode = 3;
			inst.ln('handle your biz');
			exists(fname).should.be.true();
			unmute();
		})
	})
	describe('writing', function() {
		it('with ln() should be chainable', function() {
			mute();
			let inst = new Writer();
			inst.ln('anything').should.eql(inst);
			unmute();
		})
		it('with lnc() should be chainable', function() {
			mute();
			let inst = new Writer();
			inst.lnc('anything').should.eql(inst);
			unmute();
		})
		it('with lnf() should be chainable', function() {
			mute();
			let inst = new Writer({
				directory: 'test-data'
			});
			inst.lnf('anything').should.eql(inst);
			unmute();
		})
	})
})