let stateA = false;
let stateB = false;
let currentGate = 'AND';

function toggleSwitch(id) {
    if (id === 'a') stateA = !stateA;
    if (id === 'b') stateB = !stateB;
    
    document.getElementById('sw-a').classList.toggle('active', stateA);
    document.getElementById('sw-a').innerText = stateA ? "ON" : "OFF";
    document.getElementById('sw-b').classList.toggle('active', stateB);
    document.getElementById('sw-b').innerText = stateB ? "ON" : "OFF";
    
    calculateOutput();
}

function setGate(type) {
    currentGate = type;
    document.getElementById('gate-name').innerText = type + " GATE";
    calculateOutput();
}

function calculateOutput() {
    let result = false;
    if (currentGate === 'AND') result = (stateA && stateB);
    if (currentGate === 'OR') result = (stateA || stateB);
    
    document.getElementById('output-led').classList.toggle('active', result);
}