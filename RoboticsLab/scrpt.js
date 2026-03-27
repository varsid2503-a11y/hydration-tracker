const beam = document.getElementById('beam');
const intruder = document.getElementById('intruder');
const luxDisplay = document.getElementById('lux-value');
const statusChip = document.getElementById('system-status');
const alarmSnd = document.getElementById('alarm-snd');

function spawnIntruder() {
    intruder.classList.add('active');
    setTimeout(() => {
        triggerAlarm();
    }, 150);
}

function removeIntruder() {
    intruder.classList.remove('active');
}

function triggerAlarm() {
    document.body.classList.add('alarm-active');
    statusChip.innerText = "INTRUDER DETECTED";
    luxDisplay.innerText = "0";
    alarmSnd.play();
}

function resetSystem() {
    document.body.classList.remove('alarm-active');
    statusChip.innerText = "SYSTEM READY";
    luxDisplay.innerText = "1024";
}