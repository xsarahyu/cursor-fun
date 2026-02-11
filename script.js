const display = document.getElementById('display');
const angleModeLabel = document.getElementById('angleMode');
const angleBtn = document.getElementById('angleBtn');

let currentValue = '0';
let previousValue = '';
let operator = null;
let shouldResetDisplay = false;
let angleMode = 'DEG'; // DEG or RAD

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function fromRadians(rad) {
  return (rad * 180) / Math.PI;
}

function updateDisplay() {
  display.value = currentValue;
}

function updateAngleLabel() {
  angleModeLabel.textContent = angleMode;
  if (angleBtn) angleBtn.textContent = angleMode;
}

function inputNumber(num) {
  if (shouldResetDisplay) {
    currentValue = num;
    shouldResetDisplay = false;
  } else {
    if (currentValue === '0' && num !== '.') {
      currentValue = num;
    } else {
      currentValue += num;
    }
  }
  updateDisplay();
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentValue = '0.';
    shouldResetDisplay = false;
  } else if (!currentValue.includes('.')) {
    currentValue += '.';
  }
  updateDisplay();
}

function setOperator(op) {
  if (operator !== null && !shouldResetDisplay) {
    calculate();
  }
  previousValue = currentValue;
  operator = op;
  shouldResetDisplay = true;
}

function applyUnary(fn) {
  const x = parseFloat(currentValue);
  if (isNaN(x)) return;
  let result;
  switch (fn) {
    case 'sin':
      result = Math.sin(angleMode === 'DEG' ? toRadians(x) : x);
      break;
    case 'cos':
      result = Math.cos(angleMode === 'DEG' ? toRadians(x) : x);
      break;
    case 'tan':
      result = Math.tan(angleMode === 'DEG' ? toRadians(x) : x);
      break;
    case 'asin':
      result = angleMode === 'DEG' ? fromRadians(Math.asin(x)) : Math.asin(x);
      break;
    case 'acos':
      result = angleMode === 'DEG' ? fromRadians(Math.acos(x)) : Math.acos(x);
      break;
    case 'atan':
      result = angleMode === 'DEG' ? fromRadians(Math.atan(x)) : Math.atan(x);
      break;
    case 'log':
      result = x <= 0 ? 'Error' : Math.log10(x);
      break;
    case 'ln':
      result = x <= 0 ? 'Error' : Math.log(x);
      break;
    case 'sqrt':
      result = x < 0 ? 'Error' : Math.sqrt(x);
      break;
    case 'square':
      result = x * x;
      break;
    case 'reciprocal':
      result = x === 0 ? 'Error' : 1 / x;
      break;
    case 'negate':
      result = -x;
      break;
    default:
      return;
  }
  currentValue = result === 'Error' || !Number.isFinite(result) ? 'Error' : String(result);
  shouldResetDisplay = true;
  updateDisplay();
}

function setConstant(name) {
  if (name === 'pi') {
    currentValue = String(Math.PI);
  } else if (name === 'e') {
    currentValue = String(Math.E);
  }
  shouldResetDisplay = true;
  updateDisplay();
}

function calculate() {
  const prev = parseFloat(previousValue);
  const curr = parseFloat(currentValue);
  if (isNaN(prev) || isNaN(curr)) return;

  let result;
  switch (operator) {
    case '+':
      result = prev + curr;
      break;
    case '-':
      result = prev - curr;
      break;
    case '*':
      result = prev * curr;
      break;
    case '/':
      result = curr === 0 ? 'Error' : prev / curr;
      break;
    case '^':
      result = Math.pow(prev, curr);
      if (!Number.isFinite(result)) result = 'Error';
      break;
    default:
      return;
  }

  currentValue = result === 'Error' ? 'Error' : String(result);
  operator = null;
  previousValue = '';
  shouldResetDisplay = true;
  updateDisplay();
}

function clear() {
  currentValue = '0';
  previousValue = '';
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function toggleAngle() {
  angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
  updateAngleLabel();
}

document.querySelectorAll('.buttons').forEach(container => {
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const value = btn.dataset.value;
    const action = btn.dataset.action;
    const fn = btn.dataset.fn;

    if (action === 'clear') {
      clear();
      return;
    }
    if (action === 'toggleAngle') {
      toggleAngle();
      return;
    }
    if (action === 'equals') {
      calculate();
      return;
    }
    if (action === 'operator') {
      setOperator(value);
      return;
    }
    if (action === 'unary' && fn) {
      applyUnary(fn);
      return;
    }
    if (action === 'constant' && value) {
      setConstant(value);
      return;
    }
    if (value === '.') {
      inputDecimal();
      return;
    }
    if (value !== undefined) {
      inputNumber(value);
    }
  });
});

updateDisplay();
updateAngleLabel();
