var assert = require('assert');
var ReconCommands = require('../js/commands.js');

var failures = 0;

function run(name, fn) {
  try {
    fn();
    console.log('PASS - ' + name);
  } catch (err) {
    failures++;
    console.error('FAIL - ' + name);
    console.error(err);
  }
}

run('parseCommand resolves whoami', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('whoami'), { name: 'whoami', arg: null });
});

run('parseCommand resolves the "about" alias to whoami', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('about'), { name: 'whoami', arg: null });
});

run('parseCommand resolves ls projects/ and its variants', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('ls projects/'), { name: 'ls-projects', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('ls projects'), { name: 'ls-projects', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('projects'), { name: 'ls-projects', arg: null });
});

run('parseCommand extracts the project id from cd, trimming a trailing slash', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('cd beacon-hunter'), { name: 'cd', arg: 'beacon-hunter' });
  assert.deepStrictEqual(ReconCommands.parseCommand('cd beacon-hunter/'), { name: 'cd', arg: 'beacon-hunter' });
});

run('parseCommand resolves certs aliases', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('cat certs.log'), { name: 'certs', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('certs'), { name: 'certs', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('certifications'), { name: 'certs', arg: null });
});

run('parseCommand resolves contact and any mail-prefixed input', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('contact'), { name: 'contact', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('mail --to you'), { name: 'contact', arg: null });
});

run('parseCommand recognizes clear, sudo, and nmap', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('clear'), { name: 'clear', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('sudo rm -rf /'), { name: 'sudo', arg: null });
  assert.deepStrictEqual(ReconCommands.parseCommand('nmap self'), { name: 'nmap', arg: null });
});

run('parseCommand flags unknown commands, preserving the raw text', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('drop table users'), { name: 'unknown', arg: 'drop table users' });
});

run('parseCommand treats <script> input as an ordinary unknown command (no special handling needed — never rendered via innerHTML)', function () {
  var result = ReconCommands.parseCommand('<script>alert(1)</script>');
  assert.strictEqual(result.name, 'unknown');
  assert.strictEqual(result.arg, '<script>alert(1)</script>');
});

run('parseCommand ignores empty/whitespace-only input', function () {
  assert.deepStrictEqual(ReconCommands.parseCommand('   '), { name: 'noop', arg: null });
});

run('buildHash and parseHash round-trip a project id', function () {
  var hash = ReconCommands.buildHash('beacon-hunter');
  assert.strictEqual(hash, '#projects/beacon-hunter');
  assert.strictEqual(ReconCommands.parseHash(hash), 'beacon-hunter');
});

run('parseHash returns null for a hash that is not a project link', function () {
  assert.strictEqual(ReconCommands.parseHash('#about'), null);
  assert.strictEqual(ReconCommands.parseHash(''), null);
});

if (failures > 0) {
  console.error(failures + ' test(s) failed');
  process.exitCode = 1;
} else {
  console.log('ALL TESTS PASSED');
}
