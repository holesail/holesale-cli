#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const Tail = require('tail').Tail;
const util = require('util');
const execPromise = util.promisify(exec);

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

let isLoggedin = false;






const configFilePath = 'user_config.json';

// Load existing user configuration from the file
let userConfig = {};
if (fs.existsSync(configFilePath)) {
  const configFileContent = fs.readFileSync(configFilePath, 'utf8');
  userConfig = JSON.parse(configFileContent);
}

let user, pass;

// Check if user credentials exist in the configuration
if (userConfig.username && userConfig.password) {
  user = userConfig.username;
  pass = userConfig.password;
  authenticateUser();
} else {
  // Prompt for credentials if not found in the configuration
  readline.question('Enter Username: ', (username) => {
    user = username;
    readline.question('Enter Password: ', (password) => {
      pass = password;
      readline.question('Enter domain: ', (domain) => {
        dom = domain;

      // Check username and password here
      authenticateUser();

      readline.close();
    });
  });
});
}

function authenticateUser() {
  // Check username and password here
  if (user === 'admin' && pass === '123') {
    isLoggedin = true;
    console.log('You are logged in!');
    saveToConfigFile(user, pass);
  } else {
    console.log('Invalid username or password');
  }
}

function saveToConfigFile(username, password) {
  const newConfig = { username, password };

  // Save the new configuration to the file
  fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2), 'utf8');
  console.log('Username and password saved to user_config.json');
}









//get user arguments
const args = process.argv.slice(2);
let port;
if (args.length < 1) {
  console.error("No arguments provided. Try holesale-cli --help for a list of all arguments");
  process.exit(1);
}
//clean user arguments
const inputs = args.map(arg => {
  const [key, value] = arg.split("=");
  return { key, value };
});
//start building command for seed generation two
let hyperServe = "hypertele-server ";
let seed = "";
let seed2 = "";
//loop through all the parameters
for (const { key, value } of inputs) {
  if (key === "--help") {
    console.log("Example: holesale-cli --expose=LOCAL_PORT --server=SERVER_PORT");
    console.log("Where LOCAL_PORT is the port you want to expose on your system, and SERVER_PORT is the port that it will be exposed to on the server.");
  }

  if (key === "--expose") {
    hyperServe += `-l ${value} `;
    port = value;
  }
}
if(isLoggedin){

// Generate seed and store in a file, then read the seed from the file
exec("hyper-cmd-util-keygen --gen_seed > seed.txt", (error, stdout, stderr) => {

  // Read the seed from the file and delete it
  let filename = "seed.txt";
  seed = fs.readFileSync(process.cwd() + "/" + filename).toString().substring(6).trim();
  fs.unlinkSync(filename);
  // Append the seed
  hyperServe += `--seed '${seed}'`;

  //console.log(seed);

// Generate seed and store in a file, then read the seed from the file
exec(hyperServe + " > seed2.txt", (error2, stdout2, stderr2) => {
  //this will never execute as the above command will run indefinately
  console.log("tessst")

});

  //read from the file
  tail = new Tail("seed2.txt");
  tail.on("line", function(data) {
    seed2 += data.toString().substring(11).trim();
    //console.log(seed2)
    if(seed2.length > 2){
      tail.unwatch();
      console.log(`Port ${port} is now connected to the cloud`);
      console.log(`Seed: ${seed2}`)
      fs.unlinkSync("seed2.txt");
    }
  });


  return;
});


}



