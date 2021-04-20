// runtests.js
// Copyright © 2021 Joel Mussman. All rights reserved.
//
// ts-jest cannot launch global startup and teardown scripts because of an incompatibility on the jest
// side: https://github.com/kulshekhar/ts-jest/issues/411. This TS script is used to launch the application
// server before any tests run, and tear it down after the tests.

import { run } from 'jest';
import { ChildProcess, exec } from 'child_process';

let process: ChildProcess;

// Launch the application server.

async function globalSetup() {

    console.log('Launching application server.');

    process = exec('npx webpack serve');
}

// Launch Jest.

async function runTests() {

    await run();
}

// Shutdown the application server.

async function globalTeardown() {

    console.log('Stopping application server.');

    process?.kill();
}

// Run as a promise to easily chain the three steps and catch the errors and output them.

globalSetup()
    .then(runTests)
    .then(globalTeardown)
    .catch((e) => console.error(e));