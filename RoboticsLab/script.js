let stateA = false;
let stateB = false;
let currentGate = 'AND';
let count = 0;
let lastResult = false;

function toggleSwitch(id) {
    if (id === 'a') stateA = !stateA;
    if (id === 'b') stateB = !stateB;
    
    document.getElementById('sw-a').classList.toggle('active', stateA);
    document.getElementById('sw-a').innerText = stateA ? "1" : "0";
    if(document.getElementById('sw-b')) {
        document.getElementById('sw-b').classList.toggle('active', stateB);
        document.getElementById('sw-b').innerText = stateB ? "1" : "0";
    }
    
    calculateOutput();
}

function setGate(type) {
    currentGate = type;
    document.getElementById('gate-name').innerText = type + " GATE";
    const container = document.getElementById('input-container');
    const shape = document.getElementById('gate-shape');
    
    shape.className = "gate-body gate-" + type.toLowerCase();
    shape.innerText = type === 'NOT' ? "" : type === 'AND' ? "D" : "OR";

    if (type === 'NOT') {
        container.innerHTML = '<div class="switch-node" id="sw-a" onclick="toggleSwitch(\'a\')">0</div>';
    } else {
        container.innerHTML = '<div class="switch-node" id="sw-a" onclick="toggleSwitch(\'a\')">0</div><div class="switch-node" id="sw-b" onclick="toggleSwitch(\'b\')">0</div>';
    }
    
    stateA = false; stateB = false;
    calculateOutput();
}

function calculateOutput() {
    let result = false;
    if (currentGate === 'AND') result = (stateA && stateB);
    if (currentGate === 'OR') result = (stateA || stateB);
    if (currentGate === 'NOT') result = (!stateA);
    
    document.getElementById('output-led').classList.toggle('active', result);
    
    if (result && !lastResult) {
        count++;
        document.getElementById('binary-count').innerText = count.toString(2).padStart(4, '0');
    }
    lastResult = result;
}

setGate('AND');