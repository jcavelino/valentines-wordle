const rows = 6;
const columns = 5;
let currentRow = 0;
let currentColumn = 0;
let word = "HEART"; // The secret word

window.onload = function() {
    initializeBoard();
    initializeKeyboard();
    setupPhysicalKeyboard();
}

function initializeBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString(); 
            tile.classList.add("tile");
            document.getElementById("board").appendChild(tile);
        }
    }
}

function initializeKeyboard() {
    // Arrays representing the 3 rows of a standard QWERTY keyboard
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
    ];

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");
            let key = currRow[j];
            keyTile.innerText = key;
            
            // Assign IDs so we can style Enter and Backspace differently
            if (key === "Enter") {
                keyTile.id = "Enter";
            } else if (key === "⌫") {
                keyTile.id = "Backspace";
            } else {
                keyTile.id = "Key" + key;
            }
            
            keyTile.classList.add("key-tile");
            
            // Listen for taps on the screen
            keyTile.addEventListener("click", function() {
                processInput(key);
            });
            
            keyboardRow.appendChild(keyTile);
        }
        document.getElementById("keyboard-container").appendChild(keyboardRow);
    }
}

// Listen for physical keyboard presses
function setupPhysicalKeyboard() {
    document.addEventListener("keyup", (e) => {
        if (e.code >= "KeyA" && e.code <= "KeyZ") {
            processInput(e.code[3]); // Extracts just the letter from "KeyA"
        } else if (e.code === "Backspace") {
            processInput("⌫");
        } else if (e.code === "Enter") {
            processInput("Enter");
        }
    });
}

// The central brain for handling input from BOTH keyboards
function processInput(key) {
    if (key >= "A" && key <= "Z") {
        if (currentColumn < columns) {
            let currentTile = document.getElementById(currentRow.toString() + "-" + currentColumn.toString());
            if (currentTile.innerText === "") {
                currentTile.innerText = key;
                currentColumn += 1;
            }
        }
    } else if (key === "⌫") {
        if (currentColumn > 0 && currentColumn <= columns) {
            currentColumn -= 1;
            let currentTile = document.getElementById(currentRow.toString() + "-" + currentColumn.toString());
            currentTile.innerText = "";
        }
    } else if (key === "Enter") {
        // Only check the word if the row is full
        if (currentColumn === columns) {
            checkWord();
        }
    }
}

function checkWord() {
    let guess = "";
    let currentTileRow = []; 
    
    // 1. Gather the letters from the current row
    for (let c = 0; c < columns; c++) {
        let currentTile = document.getElementById(currentRow.toString() + "-" + c.toString());
        guess += currentTile.innerText;
        currentTileRow.push(currentTile);
    }

    // 2. Create a dictionary/object to count how many of each letter are in the target word
    let wordMap = {};
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];
        if (wordMap[letter]) {
            wordMap[letter] += 1;
        } else {
            wordMap[letter] = 1;
        }
    }

    // 3. First Pass: Check for CORRECT (Green)
    let correctCount = 0;
    for (let c = 0; c < columns; c++) {
        if (guess[c] === word[c]) {
            currentTileRow[c].classList.add("correct");
            updateKeyboardClass(guess[c], "correct");
            wordMap[guess[c]] -= 1; // Deduct from our available letter count
            correctCount += 1;
        }
    }

    // 4. Second Pass: Check for PRESENT (Yellow) or ABSENT (Gray)
    for (let c = 0; c < columns; c++) {
        if (!currentTileRow[c].classList.contains("correct")) { // Skip the green ones
            // Is it in the word AND do we still have "unmatched" copies of that letter?
            if (word.includes(guess[c]) && wordMap[guess[c]] > 0) {
                currentTileRow[c].classList.add("present");
                updateKeyboardClass(guess[c], "present");
                wordMap[guess[c]] -= 1;
            } else {
                currentTileRow[c].classList.add("absent");
                updateKeyboardClass(guess[c], "absent");
            }
        }
    }

    // 5. Move to the next row
    currentRow += 1;
    currentColumn = 0;

    // 6. Win/Loss Logic (We will expand this in Phase 2)
    if (correctCount === columns) {
        console.log("Game Won!");
    } else if (currentRow === rows) {
        console.log("Game Lost!");
        // This is where we will trigger the "Give Up" / Valentine sequence
    }
}

function updateKeyboardClass(letter, className) {
    let keyTile = document.getElementById("Key" + letter);
    
    // Once a key is green, we don't want to accidentally downgrade it to yellow or gray later
    if (!keyTile.classList.contains("correct")) {
        keyTile.classList.remove("present"); // Remove yellow if we are upgrading to green
        keyTile.classList.add(className);
    }
}