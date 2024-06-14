#!/usr/bin/env node

// I wish this didn’t have to exist https://fediverse.zachleat.com/@zachleat/112615813950390962

import { parseArgs } from "node:util";
import path from "node:path";
import fs from "node:fs";
import chalk from "kleur";

function isExistingDir(filepath) {
	return fs.existsSync(filepath) && fs.statSync(filepath).isDirectory();
}

function hasFilename(filepath) {
	if(filepath.endsWith(path.sep) || filepath.endsWith("/")) {
		return false;
	}

	let parsed = path.parse(filename);
	if(!parsed.base) {
		return false;
	}
	return true;
}

let { positionals, values } = parseArgs({
	allowPositionals: true,
	strict: false,
	options: {
		encoding: {
			type: "string",
			default: "utf8",
		},
		quiet: {
			type: "boolean",
			default: false,
		},
	},
});

// TODO support stdin
// TODO check not a parent directory

let { quiet, encoding } = values;
let [ filename, content ] = positionals;

// Input checking
if(!filename || !content || !hasFilename(filename) || isExistingDir(filename)) {
	console.error("Expected usage: npx @11ty/create file_path file_content");
	process.exit(1);
}

// Create parent dirs
let dirs = filename.split(path.sep);

// On Windows, work with forward and back slashes
if(dirs.length <= 1 && path.sep !== "/" && filename.includes("/")) {
	dirs = filename.split("/");
}

if(dirs.length > 1 ) {
	dirs.pop();

	fs.mkdirSync(dirs.join(path.sep), {
		recursive: true
	});
}

// Write file
fs.writeFileSync(filename, content, { encoding });

// Output
if(!quiet) {
	console.log( `${chalk.gray('[11ty/create]')} Writing ${filename} ${chalk.gray(`(${(content.length/1000).toFixed(3)}kb)`)}` );
}