#!/usr/bin/env node

// I wish this didn’t have to exist https://fediverse.zachleat.com/@zachleat/112615813950390962

import { parseArgs } from "node:util";
import path from "node:path";
import fs from "node:fs";
import chalk from "kleur";
import readline from "node:readline";

async function getStdIn() {
	return new Promise((resolve, reject) => {
		let rl = readline.createInterface({ input: process.stdin });
		let timer = setTimeout(() => {
			reject();
		}, 100);
		rl.on("line", line => {
			resolve(line);
			clearTimeout(timer);
		});
		rl.on("end", () => {
			reject();
		});
	});
}

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

// TODO check not a parent directory

let { quiet, encoding } = values;
let [ filename, content ] = positionals;
let src;

if(!content) {
	try {
		content = await getStdIn();
		src = "stdin";
	} catch(e) {
		// do nothing
	}
}

// Input checking
if(!filename || !content || !hasFilename(filename) || isExistingDir(filename)) {
	console.error("Incorrect usage, expected one of:");
	console.error("  npx @11ty/create file_path 'file_content'");
	console.error("  echo 'file_content' | npx @11ty/create file_path");
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
	console.log( `${chalk.gray('[11ty/create]')} Writing ${filename} ${chalk.gray(`(${(content.length/1000).toFixed(3)}kb)${src ? ` (${src})` : ""}`)}` );
}
