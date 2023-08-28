const timerElement = document.getElementById("timer");
const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");
const alarmSound = document.getElementById("alarmSound");
const modal = document.getElementById("modal");
const modalStopButton = document.getElementById("modalStopButton");

let intervalId;
let timeLeft = 0;
let isPaused = false;
let isUnder10Seconds = false; // Flag for under 10 seconds color change
let isUnder5Seconds = false;  // Flag for under 5 seconds color change
let isNoTime = false; // Flag for no time input

function updateTimerDisplay(timeInMilliseconds) {
    if (timeInMilliseconds <= 0) {
        timerElement.textContent = "00:00:00:000";
        timerElement.style.color = "white";
    } else {
        const hours = Math.floor(timeInMilliseconds / 3600000);
        const minutes = Math.floor((timeInMilliseconds % 3600000) / 60000);
        const seconds = Math.floor((timeInMilliseconds % 60000) / 1000);
        const milliseconds = timeInMilliseconds % 1000;
        timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    }

    // Check for color change conditions
    if (timeInMilliseconds === 0 || timeLeft >= 10000) {
        timerElement.style.color = "white";
        isNoTime = timeInMilliseconds === 0;
    } else if (timeLeft < 5000 && !isUnder5Seconds) {
        timerElement.style.color = "#73001d";
        isUnder5Seconds = true;
    } else if (timeLeft < 10000 && !isUnder10Seconds) {
        timerElement.style.color = "#FFCC00";
        isUnder10Seconds = true;
    }
}

function showModal(message) {
    modal.style.display = "block";
    modal.querySelector(".modal-content p").textContent = message;

    // Play the alarm sound only when the message is "Time's up!"
    if (message === "Time's up!") {
        alarmSound.play();
    }
}

function hideModal() {
    modal.style.display = "none";
    alarmSound.pause();
    alarmSound.currentTime = 0; // Reset audio playback
    resetTimer();
}

function startTimer() {
    if (isPaused) {
        isPaused = false;
    } else {
        const hours = parseInt(hoursInput.value || 0);
        const minutes = parseInt(minutesInput.value || 0);
        const seconds = parseInt(secondsInput.value || 0);

        // Check for negative input values
        if (hours < 0 || minutes < 0 || seconds < 0) {
            showModal("Please input valid positive time");
            return; // Alert for negative input value
        }

        if (hours === 0 && minutes === 0 && seconds === 0) {
            showModal("Please input time");
            return; // Alert if no time input
        }

        timeLeft = (hours * 3600 + minutes * 60 + seconds) * 1000;
    }

    intervalId = setInterval(() => {
        if (!isPaused) {
            updateTimerDisplay(timeLeft);
            timeLeft -= 10; // Decrease by 10 milliseconds

            if (timeLeft < 0) {
                clearInterval(intervalId);
                showModal("Time's up!");
            }
        }
    }, 10); // Update every 10 milliseconds
}


function pauseTimer() {
    isPaused = true;
}

function resetTimer() {
    clearInterval(intervalId);
    timeLeft = 0;
    updateTimerDisplay(timeLeft); // Reset the display to "00:00:00:000"
    hoursInput.value = "";
    minutesInput.value = "";
    secondsInput.value = "";
}
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
modalStopButton.addEventListener("click", hideModal);


updateTimerDisplay(timeLeft);







// **** BACKGROUND EFFECT ****

var c = document.getElementById("c");
var ctx = c.getContext("2d");

//making the canvas full screen
c.height = window.innerHeight;
c.width = window.innerWidth;

//chinese characters - taken from the unicode charset
var matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
//converting the string into an array of single characters
matrix = matrix.split("");

var font_size = 10;
var columns = c.width / font_size; //number of columns for the rain
//an array of drops - one per column
var drops = [];
//x below is the x coordinate
//1 = y co-ordinate of the drop(same for every drop initially)
for (var x = 0; x < columns; x++)
    drops[x] = 1;

//drawing the characters
function draw() {
    //Black BG for the canvas
    //translucent BG to show trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#133a1b";//green text
    ctx.font = font_size + "px arial";
    //looping over drops
    for (var i = 0; i < drops.length; i++) {
        //a random chinese character to print
        var text = matrix[Math.floor(Math.random() * matrix.length)];
        //x = i*font_size, y = value of drops[i]*font_size
        ctx.fillText(text, i * font_size, drops[i] * font_size);

        //sending the drop back to the top randomly after it has crossed the screen
        //adding a randomness to the reset to make the drops scattered on the Y axis
        if (drops[i] * font_size > c.height && Math.random() > 0.975)
            drops[i] = 0;

        //incrementing Y coordinate
        drops[i]++;
    }
}

setInterval(draw, 35);
