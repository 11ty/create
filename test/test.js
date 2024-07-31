import test from 'node:test';
import assert from "node:assert/strict";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { rimrafSync } from "rimraf";

const SAMPLE_CONTENT = '# Test content';

function waitForStreamClose(stream) {
	return new Promise(resolve => {
		stream.on("close", () => {
			resolve();
		});
	});
}

test('Baseline double quotes', async (t) => {
	t.after(() => {
		rimrafSync("./test/stubs-dbl/");
	});

	let path = 'test/stubs-dbl/index.md';
	let create = spawn("node", ['.', path, SAMPLE_CONTENT]);
	await waitForStreamClose(create);

	assert.ok(fs.existsSync(path));
	assert.notDeepEqual(fs.readFileSync(path, "utf8"), SAMPLE_CONTENT);
});

test('Baseline single quotes', async (t) => {
	t.after(() => {
		rimrafSync("./test/stubs-sgl/");
	});

	let path = 'test/stubs-sgl/index.md';
	let create = spawn("node", ['.', path, SAMPLE_CONTENT]);

	await waitForStreamClose(create);

	assert.ok(fs.existsSync(path));
	assert.deepEqual(fs.readFileSync(path, "utf8"), SAMPLE_CONTENT);
});

test('Missing content', async (t) => {
	t.after(() => {
		rimrafSync("./test/stubs-err-c/");
	});

	let path = 'test/stubs-err-c/index.md';
	let create = spawn("node", ['.', path]);
	await waitForStreamClose(create);

	assert.ok(!fs.existsSync(path));
});

test('Missing filename', async (t) => {
	t.after(() => {
		rimrafSync("./test/stubs-err-f/");
	});

	let path = 'test/stubs-err-f/';
	let create = spawn("node", ['.', path]);
	await waitForStreamClose(create);

	assert.ok(!fs.existsSync(path));
});

test('Point to a directory', async (t) => {
	t.after(() => {
		rimrafSync("./test/stubs-err-d/");
	});

	let path = 'test/stubs-err-d/';
	let create = spawn("node", ['.', path, SAMPLE_CONTENT]);
	await waitForStreamClose(create);

	assert.ok(!fs.existsSync(path));
});

test('Nested create', async (t) => {
	t.after(() => {
		rimrafSync("./test/stubs-nested/");
	});

	let path = 'test/stubs-nested/nested/index.md';
	let create = spawn("node", ['.', path, SAMPLE_CONTENT]);
	await waitForStreamClose(create);

	assert.ok(fs.existsSync(path));
	assert.deepEqual(fs.readFileSync(path, "utf8"), SAMPLE_CONTENT);
});
