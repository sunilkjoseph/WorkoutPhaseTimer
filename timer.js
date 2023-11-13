let timer;
let isPaused = false;
let totalTime; // Variable to store the total time set by the user
let workoutCompleted = false;

// Initialize the inputs to 0 when the page loads
document.addEventListener('DOMContentLoaded', function () {
    resetInputs();
});

function startPauseTimer() {
    const hours = parseInt(document.getElementById('hours').value, 10);
    const minutes = parseInt(document.getElementById('minutes').value, 10);
    const seconds = parseInt(document.getElementById('seconds').value, 10);

    totalTime = hours * 3600 + minutes * 60 + seconds;

    let totalSeconds = totalTime;

    if (!timer || isPaused) {
        // Start or resume the timer
        if (!isPaused) {
            document.getElementById('startPauseButton').innerText = 'Pause';
            isPaused = false;
            workoutCompleted = false; // Reset the flag when starting or resuming the timer
        }

        timer = setInterval(function () {
            if (totalSeconds <= 0) {
                clearInterval(timer);
                document.getElementById('startPauseButton').innerText = 'Start';

                if (!workoutCompleted) {
                    showNotification('Workout Complete!');
                    workoutCompleted = true; // Set the flag to true after showing the notification
                }
            } else {
                totalSeconds--;
                displayTime(totalSeconds);
                checkPhaseCompletion(totalSeconds);
            }
        }, 1000);
    } else {
        // Pause the timer
        clearInterval(timer);
        document.getElementById('startPauseButton').innerText = 'Resume';
        isPaused = true;
    }
}

function checkPhaseCompletion(totalSeconds) {
    const warmupDuration = Math.floor(totalTime * 0.06);
    const cooldownDuration = Math.floor(totalTime * 0.06);
    const intenseDuration = totalTime - (warmupDuration + cooldownDuration);

    if (totalSeconds === warmupDuration) {
        showNotification('Intense Training Complete! Switch to Cooldown.');
    } else if (totalSeconds === warmupDuration + intenseDuration) {
        showNotification('Warmup Complete! Switch to Intense Training.');
    }
}

function displayTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById('hours').value = hours;
    document.getElementById('minutes').value = minutes;
    document.getElementById('seconds').value = seconds;
}

function showNotification(message) {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(message);
            }
        });
    }
}

function cancelTimer() {
    clearInterval(timer);
    document.getElementById('startPauseButton').innerText = 'Start';
    isPaused = false;
    resetInputs();
}

function resetInputs() {
    document.getElementById('hours').value = 0;
    document.getElementById('minutes').value = 0;
    document.getElementById('seconds').value = 0;
}
