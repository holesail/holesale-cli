#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const { exec } = require('child_process');
const Tail = require('tail').Tail;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let users = {};

if (fs.existsSync('users.json')) {
    const data = fs.readFileSync('users.json');
    users = JSON.parse(data);
}

function saveUserData() {
    const data = JSON.stringify(users, null, 2);
    fs.writeFileSync('users.json', data);
}

function showOptions() {
    rl.question("Choose an option:\n1. Login\n2. Signup\n", (option) => {
        if (option === "1") {
            login();
        } else if (option === "2") {
            signup();
        } else {
            console.log("Invalid option. Please choose again.");
            showOptions();
        }
    });
}

function login() {
    rl.question("Enter your username: ", (username) => {
        rl.question("Enter your password: ", (password) => {
            if (users[username] && users[username].password === password) {
                console.log("Login successful!");
                executeCommand(); // Proceed with command execution
                rl.close();
            } else {
                console.log("Incorrect username or password. Please try again.");
                login();
            }
        });
    });
}

function signup() {
    rl.question("Enter a username: ", (username) => {
        rl.question("Enter your email: ", (email) => {
            rl.question("Enter a password: ", (password) => {
                users[username] = { email, password };
                saveUserData();
                console.log("Signup successful! You can now login with your credentials.");
                showOptions();
            });
        });
    });
}

function executeCommand() {
    const args = process.argv.slice(2);
    let port;
    let seed2 = ""; // Declare seed2 variable here

    if (args.length < 1) {
        console.error("No arguments provided. Try holesale-cli --help for a list of all arguments");
        process.exit(1);
    }

    const inputs = args.map(arg => {  
        const [key, value] = arg.split("=");
        return { key, value };
    });

    let hyperServe = "hypertele-server ";
    let seed = "";

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

    exec("hyper-cmd-util-keygen --gen_seed > seed.txt", (error, stdout, stderr) => {
        let filename = "seed.txt";
        seed = fs.readFileSync(process.cwd() + "/" + filename).toString().substring(6).trim();
        fs.unlinkSync(filename);
        hyperServe += `--seed '${seed}'`;

        exec(hyperServe + " > seed2.txt", (error2, stdout2, stderr2) => {
            console.log("Command executed successfully.");
        });

        tail = new Tail("seed2.txt");
        tail.on("line", function(data) {
            seed2 += data.toString().substring(11).trim();
            if(seed2.length > 2){
                tail.unwatch();
                console.log(`Port ${port} is now connected to the cloud`);
                console.log(`Seed: ${seed2}`)
                fs.unlinkSync("seed2.txt");
            }
        });
    });
}

showOptions();


