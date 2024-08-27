let increase = document.getElementsByTagName('i')[0];
let p = document.getElementById('MyText');
let ul = document.getElementById('MyUl');
let editor = document.getElementById('editor');
let decrease = document.getElementsByTagName('i')[1];
let bold = document.getElementsByTagName('i')[2];
let italic = document.getElementsByTagName('i')[3];
let underline = document.getElementsByTagName('i')[4];
let color = document.getElementById('colors');
let undoButton = document.getElementsByTagName('i')[5];
let redoButton = document.getElementsByTagName('i')[6];
let select = document.getElementsByTagName('select')[0];

let undoStack = [];
let redoStack = [];

let div = editor;

saveState();

function getSelectedText() {
    let selectedText = '';
    if (window.getSelection) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            selectedText = selection.toString();
        }
    }
    return { selectedText };
}

editor.addEventListener('mouseup', function () {
    const { selectedText } = getSelectedText();
    if (div) {
        const fontSize = window.getComputedStyle(div).fontSize;
        console.log('Font size of selected text:', fontSize);
    }
});

select.addEventListener('change', function () {
    const selectedFont = select.value;
    div.style.fontFamily = selectedFont;
});

increase.addEventListener('click', function () {
    saveState();
    if (div) {
        let fontsize = parseFloat(window.getComputedStyle(div).fontSize);
        div.style.fontSize = (fontsize + 2) + 'px';
    }
});

decrease.addEventListener('click', function () {
    saveState();
    if (div) {
        let fontsize = parseFloat(window.getComputedStyle(div).fontSize);
        div.style.fontSize = (fontsize - 2) + 'px';
    }
});

bold.addEventListener('click', function () {
    saveState();
    if (div) {
        let fontweight = window.getComputedStyle(div).fontWeight;
        div.style.fontWeight = (fontweight === '700' || fontweight === 'bold') ? '400' : '700';
    }
});

italic.addEventListener('click', function () {
    saveState();
    if (div) {
        let fontStyle = window.getComputedStyle(div).fontStyle;
        div.style.fontStyle = (fontStyle === 'italic') ? 'normal' : 'italic';
    }
});

underline.addEventListener('click', function () {
    saveState();
    if (div) {
        let textDecoration = window.getComputedStyle(div).textDecorationLine;
        div.style.textDecoration = (textDecoration === 'underline') ? 'none' : 'underline';
    }
});

color.addEventListener('input', function () {
    saveState();
    let selectedColor = color.value;
    div.style.color = selectedColor;
});

function saveState() {
    const currentState = {
        fontWeight: div.style.fontWeight,
        fontStyle: div.style.fontStyle,
        textDecoration: div.style.textDecoration,
        fontSize: div.style.fontSize,
        color: div.style.color,
    };
    undoStack.push(currentState);
    redoStack = [];
}

function undo() {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        const lastState = undoStack[undoStack.length - 1];
        applyState(lastState);
    }
}

function redo() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        applyState(nextState);
        saveState();
    }
}

function applyState(state) {
    div.style.fontWeight = state.fontWeight;
    div.style.fontStyle = state.fontStyle;
    div.style.textDecoration = state.textDecoration;
    div.style.fontSize = state.fontSize;
    div.style.color = state.color;
}

undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
