const rows = 6;
const columns = 5;
let currentRow = 0;
let currentColumn = 0;
let word = "HEART"; // The secret word

window.onload = function() {
    initializeBoard();
    initializeKeyboard();
    setupPhysicalKeyboard();

    // The Phase 2 Buttons
    document.getElementById("try-again-btn").addEventListener("click", function() {
        location.reload(); 
    });

    document.getElementById("give-up-btn").addEventListener("click", function() {
        document.getElementById("game-over-modal").classList.add("hidden"); 
        triggerValentineSequence(); 
    });
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
            currentTile.classList.remove("animate-pop");
        }
    } else if (key >= "A" && key <= "Z" && key.length === 1) { 
        if (currentColumn < columns) {
            let currentTile = document.getElementById(currentRow.toString() + "-" + currentColumn.toString());
            if (currentTile.innerText === "") {
                currentTile.innerText = key;
                currentTile.classList.add("animate-pop");
                currentColumn += 1;
            }
        }
    }
}

function checkWord() {
    let guess = "";
    let currentTileRow = []; 
    
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

    let statuses = ["absent", "absent", "absent", "absent", "absent"];
    let correctCount = 0;

    for (let c = 0; c < columns; c++) {
        if (guess[c] === word[c]) {
            statuses[c] = "correct";
            wordMap[guess[c]] -= 1; 
            correctCount += 1;
        }
    }

    for (let c = 0; c < columns; c++) {
        if (statuses[c] !== "correct") { 
            if (word.includes(guess[c]) && wordMap[guess[c]] > 0) {
                statuses[c] = "present";
                wordMap[guess[c]] -= 1;
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        setTimeout(() => {
            let tile = currentTileRow[c];
            tile.classList.add("flip"); 

            setTimeout(() => {
                tile.classList.add(statuses[c]);
                updateKeyboardClass(guess[c], statuses[c]);
            }, 250);

        }, c * 300); 
    }

    currentRow += 1;
    currentColumn = 0;

    setTimeout(() => {
        if (correctCount === columns) {
            // Trigger popup if won
            document.getElementById("game-over-modal").classList.remove("hidden");
        } else if (currentRow === rows) {
            // Trigger popup if lost
            document.getElementById("game-over-modal").classList.remove("hidden");
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

// Phase 2: The Magic Scramble
function triggerValentineSequence() {
    document.getElementById("keyboard-container").style.display = "none";

    // Fade the background to a deep romantic red
    document.body.style.transition = "background-color 2s ease";
    document.body.style.backgroundColor = "#2b0505"; 

    // The left-justified layout
    const message = [
        ["W", "I", "L", "L", ""],
        ["Y", "O", "U", "", ""],
        ["B", "E", "", "", ""],
        ["M", "Y", "", "", ""],
        ["V", "A", "L", "E", "N"],
        ["T", "I", "N", "E", "?"]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let delay = (r * columns + c) * 100;

            setTimeout(() => {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                tile.style.animation = 'none'; 
                tile.offsetHeight; 
                tile.style.animation = null; 
                tile.classList.add("flip");

                setTimeout(() => {
                    tile.innerText = message[r][c];
                    tile.classList.remove("correct", "present", "absent");

                    if (message[r][c] !== "") {
                        tile.classList.add("val-text"); // Bright red
                    } else {
                        tile.classList.add("val-empty"); // Dark red
                    }
                }, 250);
            }, delay);
        }
    }

    // Wait for the flip to finish, let her read it, then trigger the twist!
    setTimeout(() => {
        triggerBelatedTwist();
    }, 4500); 
}

// Phase 2.5: The Belated Twist
function triggerBelatedTwist() {
    let board = document.getElementById("board");
    
    // Briefly fade out the board to hide the layout swap
    board.style.transition = "opacity 0.4s ease";
    board.style.opacity = "0";

    setTimeout(() => {
        // Destroy the CSS Grid and switch to Flexbox
        board.innerHTML = ""; 
        board.style.display = "flex";
        board.style.flexDirection = "column";
        board.style.gap = "5px";
        board.style.alignItems = "flex-start"; // Aligns top rows to the left
        
        // Center the whole container
        board.style.margin = "0 auto";
        board.style.width = "fit-content";

        // The new custom layout arrays
        const newLayout = [
            ["W", "I", "L", "L"],
            ["Y", "O", "U"],
            ["B", "E"],
            ["M", "Y"],
            ["B", "E", "L", "A", "T", "E", "D"],
            ["V", "A", "L", "E", "N", "T", "I", "N", "E", "?"]
        ];

        newLayout.forEach((rowArr, rowIndex) => {
            let rowDiv = document.createElement("div");
            rowDiv.classList.add("twist-row");

            // Left justify the top 4 rows by overriding flex settings
            if (rowIndex < 4) {
                rowDiv.style.justifyContent = "flex-start";
            }

            // Apply the drop-in animation to the two new giant rows
            if (rowIndex >= 4) {
                rowDiv.classList.add("drop-in");
                rowDiv.style.animationDelay = `${(rowIndex - 3) * 0.4}s`; // Staggered drop
            }

            // Build the letters
            rowArr.forEach(letter => {
                let tile = document.createElement("div");
                tile.classList.add("tile", "val-text");
                tile.innerText = letter;
                rowDiv.appendChild(tile);
            });

            // Pad the top 4 rows with empty red blocks to keep the square shape
            if (rowIndex < 4) {
                let emptyCount = 5 - rowArr.length;
                for(let i = 0; i < emptyCount; i++){
                     let emptyTile = document.createElement("div");
                     emptyTile.classList.add("tile", "val-empty");
                     rowDiv.appendChild(emptyTile);
                }
            }

            board.appendChild(rowDiv);
        });

        // Fade the board back in
        board.style.opacity = "1"; 

        // Move to Phase 3 (The forced "YES" screen)
        setTimeout(() => {
            console.log("Time for Phase 3!");
        }, 3000);

    }, 400); // Waits for the opacity to hit 0 before rebuilding
}