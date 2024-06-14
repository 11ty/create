import test from 'node:test';
import assert from "node:assert";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { rimrafSync } from "rimraf";

const SAMPLE_CONTENT = '"# Test content"';

test('Baseline', (t) => {
	let path = 'test/stubs-0/index.md';
	let create = spawn("node", ['.', path, SAMPLE_CONTENT]);

	create.on('close', () => {
	  assert.ok(fs.existsSync(path));
		assert.deepEqual(fs.readFileSync(path, "utf8"), SAMPLE_CONTENT);
		rimrafSync("./test/stubs-0/");
	});
});

test('Missing content', (t) => {
	let path = 'test/stubs-err-c/index.md';
	let create = spawn("node", ['.', path]);

	create.on('close', () => {
	  assert.ok(!fs.existsSync(path));
		rimrafSync("./test/stubs-err-c/");
	});
});

test('Missing filename', (t) => {
	let path = 'test/stubs-err-f/';
	let create = spawn("node", ['.', path]);

	create.on('close', () => {
	  assert.ok(!fs.existsSync(path));
		rimrafSync("./test/stubs-err-f/");
	});
});

test('Point to a directory', (t) => {
	let path = 'test/stubs-err-d/';
	let create = spawn("node", ['.', path, SAMPLE_CONTENT]);

	create.on('close', () => {
	  assert.ok(!fs.existsSync(path));
		rimrafSync("./test/stubs-err-d/");
	});
});

test('Nested create', (t) => {
	let path = 'test/stubs-1/nested/index.md';
	let create = spawn("node", ['.', path, SAMPLE_CONTENT]);

	create.on('close', () => {
	  assert.ok(fs.existsSync(path));
		assert.deepEqual(fs.readFileSync(path, "utf8"), SAMPLE_CONTENT);
		rimrafSync("./test/stubs-1/");
	});
});
