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
            
            if (key === "Enter") {
                keyTile.id = "Enter";
            } else if (key === "⌫") {
                keyTile.id = "Backspace";
            } else {
                keyTile.id = "Key" + key;
            }
            
            keyTile.classList.add("key-tile");
            
            keyTile.addEventListener("click", function() {
                processInput(key);
            });
            
            keyboardRow.appendChild(keyTile);
        }
        document.getElementById("keyboard-container").appendChild(keyboardRow);
    }
}

function setupPhysicalKeyboard() {
    document.addEventListener("keyup", (e) => {
        if (e.code >= "KeyA" && e.code <= "KeyZ") {
            processInput(e.code[3]); 
        } else if (e.code === "Backspace") {
            processInput("⌫");
        } else if (e.code === "Enter") {
            processInput("Enter");
        }
    });
}

// The central brain for handling input from BOTH keyboards
function processInput(key) {
    if (key === "Enter") {
        if (currentColumn === columns) {
            checkWord();
        }
    } else if (key === "⌫") {
        if (currentColumn > 0 && currentColumn <= columns) {
            currentColumn -= 1;
            let currentTile = document.getElementById(currentRow.toString() + "-" + currentColumn.toString());
            currentTile.innerText = "";
            currentTile.classList.remove("animate-pop"); // Remove the pop class so it can trigger again later
        }
    } else if (key >= "A" && key <= "Z" && key.length === 1) { 
        if (currentColumn < columns) {
            let currentTile = document.getElementById(currentRow.toString() + "-" + currentColumn.toString());
            if (currentTile.innerText === "") {
                currentTile.innerText = key;
                currentTile.classList.add("animate-pop"); // Trigger the typing animation
                currentColumn += 1;
            }
        }
    }
}

function checkWord() {
    let guess = "";
    let currentTileRow = []; 
    
    // 1. Gather the letters
    for (let c = 0; c < columns; c++) {
        let currentTile = document.getElementById(currentRow.toString() + "-" + c.toString());
        guess += currentTile.innerText;
        currentTileRow.push(currentTile);
    }

    let wordMap = {};
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];
        if (wordMap[letter]) {
            wordMap[letter] += 1;
        } else {
            wordMap[letter] = 1;
        }
    }

    // 2. Calculate all the colors BEFORE animating
    let statuses = ["absent", "absent", "absent", "absent", "absent"];
    let correctCount = 0;

    // First Pass: Green
    for (let c = 0; c < columns; c++) {
        if (guess[c] === word[c]) {
            statuses[c] = "correct";
            wordMap[guess[c]] -= 1; 
            correctCount += 1;
        }
    }

    // Second Pass: Yellow
    for (let c = 0; c < columns; c++) {
        if (statuses[c] !== "correct") { 
            if (word.includes(guess[c]) && wordMap[guess[c]] > 0) {
                statuses[c] = "present";
                wordMap[guess[c]] -= 1;
            }
        }
    }

    // 3. The Staggered Animation Loop
    for (let c = 0; c < columns; c++) {
        setTimeout(() => {
            let tile = currentTileRow[c];
            tile.classList.add("flip"); // Start the CSS flip animation

            // Change the color exactly halfway through the 500ms flip
            setTimeout(() => {
                tile.classList.add(statuses[c]);
                updateKeyboardClass(guess[c], statuses[c]);
            }, 250);

        }, c * 300); // 300ms delay between each letter flipping
    }

    // 4. Update row instantly so the user can keep playing while animations run
    currentRow += 1;
    currentColumn = 0;

    // 5. Wait for ALL animations to finish before announcing win/loss
    setTimeout(() => {
        if (correctCount === columns) {
            console.log("Game Won!");
        } else if (currentRow === rows) {
            console.log("Game Lost!");
            // Phase 2 will start right here
        }
    }, (columns * 300) + 250); 
}

function updateKeyboardClass(letter, className) {
    let keyTile = document.getElementById("Key" + letter);
    if (!keyTile.classList.contains("correct")) {
        keyTile.classList.remove("present"); 
        keyTile.classList.add(className);
    }
}