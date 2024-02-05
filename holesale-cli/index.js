const { spawn } = require('child_process');

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("No arguments provided. Try holesale-cli --help for a list of all arguments");
  process.exit(1);
}

const inputs = [];

for (let i = 0; i < args.length; i++) {
  const [arg, value] = args[i].split("=");
  const input = {
    arg,
    value
  };
  inputs.push(input);
}

let hyperServe = "hypertele-server ";
let seed = "1933949853b7a323ab8f8364e8035c28933554985504a3230afa4d0b4f2aaf01";

for (const { arg, value } of inputs) {
  if (arg === "--help") {
    console.log("Example: holesale-cli --expose=LOCAL_PORT --server=SERVER_PORT");
    console.log("Where LOCAL_PORT is the port you want to expose on your system, and SERVER_PORT is the port that it will be exposed to on the server.");
  }

  if (arg === "--expose") {
    hyperServe += "-l " + value + " ";
  }
}

// Append the seed
hyperServe += "--seed " + "'" + seed + "'";

// Use spawn for interactive shell
// const childProcess = spawn('sh', ['-c', hyperServe], { stdio: 'inherit' });


// childProcess.on('exit', (code, signal) => {
//   if (code !== null) {
//     console.log(`Process exit code: ${code}`);
//   } else if (signal !== null) {
//     console.log(`Process received signal: ${signal}`);
//   }
// });

function run(hyperServe, cb) {
  var spawn = require('child_process').spawn;
  var command = spawn(hyperServe);
  var result = '';
  command.stdout.on('data', function(data) {
    result += data.toString();
  });
  command.on('close', function(code) {
    cb(result);
  });
}

run(hyperServe, function(message) {
  console.log(message);
});