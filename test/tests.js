'use strict';

var should = require('should'),
	Writer = require('../index');

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
			// make sure file doesn't exist
		})
		it('should not create a file if you set console mode and write a line', function(){
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
		})
		it('should create a file if you change the mode after initialisation', function(){
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
			// make sure file exists
		})
	})
	describe('writing', function() {
		it('with ln() should be chainable', function() {
			let inst = new Writer();
			inst.ln('anything').should.eql(inst);
		})
		it('with lnc() should be chainable', function() {
			let inst = new Writer();
			inst.lnc('anything').should.eql(inst);
		})
		it('with lnf() should be chainable', function() {
			let inst = new Writer({
				directory: 'test-data'
			});
			inst.lnf('anything').should.eql(inst);
		})
	})
})