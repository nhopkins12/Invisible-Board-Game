var colors = require('colors');

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const os = require('os');

console.log('hello'.green); // outputs green text 
console.log('i like cake and pies'.underline.red) // outputs red underlined text 
console.log('inverse the color'.inverse); // inverses the color 
console.log('OMG Rainbows!'.rainbow); // rainbow 
console.log('Run the trap'.trap); // Drops the bass

// const {mouse, left, right, up, down} = require("@nut-tree/nut-js");

// (async () => {
//     await mouse.move(left(500));
//     await mouse.move(up(500));
//     await mouse.move(right(500));
//     await mouse.move(down(500))
// })();



function rotateScreen (amount, callback) {
    amount = String(amount).toLowerCase();
    const validAmounts = ['default', '0', '90', '180', '270', 'cw', 'ccw'];
  
    if (!validAmounts.includes(amount)) {
      console.warn('Cannot rotate screen using: ' + amount);
      console.warn('Please use one of these: ' + validAmounts.join(', '));
      return;
    }
  
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
  
//   rotateScreen(180, function () {
//     console.log('Screen flipped');
//   });
  
//   setTimeout(function () {
//     rotateScreen(0, function () {
//       console.log('Screen back to normal');
//     });
//   }, 5000);


async function main() {
    // Dynamically import the 'open' module
    const { default: open } = await import('open');

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
    console.log('Opening file:', randomFile);

    // Open the file with the default application
    try {
        await open(randomFile);
    } catch (err) {
        console.error('Error opening file:', err);
    }
}

main().catch(err => console.error(err));
