
  //require modules
const { exec } = require('child_process');
const fs = require('fs');
const Tail = require('tail').Tail;
const util = require('util');
const execPromise = util.promisify(exec);

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






