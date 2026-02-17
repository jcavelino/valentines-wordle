let rows = 6;
let columns = 5;
let currentRow = 0;
let currentColumn = 0;
let currentPhase = 1; 
let isAnimating = false;
let shakeTimer = null;
let errorHideTimer = null;
let word = "LOVER";
const riggedKeyboard = {
    'A': 'present',
    'E': 'present',
    'I': 'present',
    'O': 'present',
    'U': 'present',
    'S': 'present',
    'T': 'present',
    'R': 'present',
    'M': 'present',
    'J': 'present',
}
window.onload = function() {
    initializeBoard();
    initializeKeyboard();
    setupPhysicalKeyboard();

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
    if (isAnimating) return; 

    if (key === "Enter") {
        if (currentPhase === 1 && currentColumn === columns) {
            checkWord();
        } else if (currentPhase === 3 && currentColumn > 0) { 
            checkYes(); 
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
    if (isAnimating) return; 
    isAnimating = true; 

    let guess = "";
    let currentTileRow = []; 
    
    // Gather the letters she typed
    for (let c = 0; c < columns; c++) {
        let currentTile = document.getElementById(currentRow.toString() + "-" + c.toString());
        guess += currentTile.innerText;
        currentTileRow.push(currentTile);
    }

    let statuses = ["absent", "absent", "absent", "absent", "absent"];
    let correctCount = 0;

    // Evaluate the guess using our Troll Dictionary
    for (let c = 0; c < columns; c++) {
        let letter = guess[c];
        
        if (letter === word[c]) {
            // 1. Exact match! Force it to be Green.
            statuses[c] = "correct";
            correctCount += 1;
        } else {
            // 2. Not an exact match? Look up its rigged color in our dictionary!
            if (riggedKeyboard[letter]) {
                statuses[c] = riggedKeyboard[letter];
            } else {
                statuses[c] = "absent"; // Default to gray if you didn't list it
            }
        }
    }

    // Trigger the 3D flip animations
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

    // Check for game over (Modal triggers whether she wins OR loses!)
    setTimeout(() => {
        if (correctCount === columns) {
            document.getElementById("game-over-modal").classList.remove("hidden");
        } else if (currentRow === rows) {
            document.getElementById("game-over-modal").classList.remove("hidden");
        } else {
            isAnimating = false; 
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
    document.querySelector("header").style.display = "none"; // Hide Wordle
    document.getElementById("keyboard-container").style.display = "none";
    document.getElementById("bg-overlay").classList.add("show-bg");
    document.getElementById("game-container").classList.add("center-phase-3");

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
                        tile.classList.add("val-text");
                    } else {
                        tile.classList.add("val-empty");
                    }
                }, 250);
            }, delay);
        }
    }

    setTimeout(() => {
        triggerBelatedTwist();
    }, 4500); 
}

// Phase 2.5: The Whispered Twist
function triggerBelatedTwist() {
    let board = document.getElementById("board");
    
    board.style.transition = "opacity 0.4s ease";
    board.style.opacity = "0";

    setTimeout(() => {
        board.innerHTML = ""; 
        board.style.display = "flex";
        board.style.flexDirection = "column";
        board.style.gap = "5px";
        board.style.alignItems = "center"; 
        board.style.margin = "0 auto";
        board.style.width = "100%";

        const topLayout = [
            ["W", "I", "L", "L"],
            ["Y", "O", "U"],
            ["B", "E"],
            ["M", "Y"]
        ];

        let topBlock = document.createElement("div");
        topBlock.style.display = "flex";
        topBlock.style.flexDirection = "column";
        topBlock.style.gap = "5px";

        topLayout.forEach((rowArr) => {
            let rowDiv = document.createElement("div");
            rowDiv.classList.add("twist-row");
            rowDiv.style.justifyContent = "flex-start"; 

            rowArr.forEach(letter => {
                let tile = document.createElement("div");
                tile.classList.add("tile", "val-text");
                tile.innerText = letter;
                rowDiv.appendChild(tile);
            });

            let emptyCount = 5 - rowArr.length;
            for(let i = 0; i < emptyCount; i++){
                 let emptyTile = document.createElement("div");
                 emptyTile.classList.add("tile", "val-empty");
                 rowDiv.appendChild(emptyTile);
            }
            topBlock.appendChild(rowDiv);
        });
        
        board.appendChild(topBlock);

        let whisper = document.createElement("div");
        whisper.innerText = "(belated...)";
        whisper.classList.add("whisper-text");
        board.appendChild(whisper);

        let bottomRow = document.createElement("div");
        bottomRow.classList.add("twist-row", "drop-in");
        
        const valRow = ["V", "A", "L", "E", "N", "T", "I", "N", "E", "?"];
        valRow.forEach(letter => {
            let tile = document.createElement("div");
            tile.classList.add("tile", "val-text");
            tile.innerText = letter;
            bottomRow.appendChild(tile);
        });

        board.appendChild(bottomRow);
        board.style.opacity = "1"; 

        setTimeout(() => {
            triggerPhase3();
        }, 6000);

    }, 400); 
}

// Phase 3: The Forced YES
function triggerPhase3() {
    // Smoothly center the whole game container!
    document.getElementById("game-container").classList.add("center-phase-3");

    currentPhase = 3;
    columns = 3; 
    currentRow = 0;
    currentColumn = 0;
    isAnimating = false;

    let board = document.getElementById("board");
    
    board.style.transition = "opacity 0.5s ease";
    board.style.opacity = "0";

    setTimeout(() => {
        board.innerHTML = ""; 
        
        let hint = document.createElement("div");
        hint.innerText = "Will you be my Valentine?";
        hint.classList.add("final-title"); // Image-accurate font!
        hint.style.animation = "whisperFade 1s ease forwards"; 
        hint.style.marginBottom = "20px";
        board.appendChild(hint);

        let rowDiv = document.createElement("div");
        rowDiv.classList.add("twist-row");
        rowDiv.id = "phase3-row"; 

        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = "0-" + c.toString(); 
            tile.classList.add("tile");
            
            // Make Phase 3 tiles bigger automatically
            tile.style.width = "70px";
            tile.style.height = "70px";
            tile.style.fontSize = "2.5rem";
            
            rowDiv.appendChild(tile);
        }
        board.appendChild(rowDiv);

        // For error messages
        let errMsg = document.getElementById("error-msg");
        board.appendChild(errMsg);

        errMsg.innerText = "hint: it's already there !!";
        errMsg.style.opacity = "1";

        let keys = document.getElementsByClassName("key-tile");
        for (let i = 0; i < keys.length; i++) {
            keys[i].classList.remove("correct", "present", "absent");
        }

        document.getElementById("KeyY").classList.add("present");
        document.getElementById("KeyE").classList.add("present");
        document.getElementById("KeyS").classList.add("present");

        document.getElementById("keyboard-container").style.display = "flex";
        board.style.opacity = "1";
    }, 500);
}

// Fixed array: Added all the missing commas!
const errorMessages = [
    "uhm.. wrong spelling..?", 
    "Pleaseee?", 
    "Sureee? 😭",
    "Try again...",
    "BAKETT",
    "Nuh uh",
    "hint: 3 letters",
    "brahhh",
    "hint: nagsstart sa Y",
    "yung color yellow po ang pindutin",
    "hint: ganto spelling: y, e, s",
    "uhhuuhuhuh",
    "plssssssss",
    "why nottttt !!",
    "mag yes ka na raw sabi ko ...",
    "HUHUHUHUHU",
    "mauubos din mga messages here ..",
    "yes na ikaw pls !",
    "type this: yes"
];
let errorIndex = 0;

function checkYes() {
    let guess = "";
    for (let c = 0; c < columns; c++) {
        let currentTile = document.getElementById("0-" + c.toString());
        if (currentTile.innerText !== "") {
            guess += currentTile.innerText;
        }
    }

    if (guess === "YES") {
        isAnimating = true; 
        
        document.getElementById("0-0").classList.add("val-text");
        document.getElementById("0-1").classList.add("val-text");
        document.getElementById("0-2").classList.add("val-text");

        let keyboard = document.getElementById("keyboard-container");
        keyboard.style.transition = "opacity 1s ease";
        keyboard.style.opacity = "0";
        
        let errMsg = document.getElementById("error-msg");
        errMsg.style.opacity = "0";

        // Stop any pending errors from showing up on the final screen
        clearTimeout(shakeTimer);
        clearTimeout(errorHideTimer);

        setTimeout(() => {
            keyboard.style.display = "none";
            errMsg.style.display = "none"; // Remove physically for clean spacing

            let finalFadeInContainer = document.createElement("div");
            finalFadeInContainer.style.opacity = "0";
            finalFadeInContainer.style.animation = "whisperFade 2s ease forwards";
            finalFadeInContainer.style.textAlign = "center";
            finalFadeInContainer.style.marginTop = "30px"; 

            finalFadeInContainer.innerHTML = `
                <h2 class="final-subtitle">YEEYYYYY</h2>
                <p class="final-message">It's better late than never! I love you ♡</p>
                <button class="final-button" onclick="alert('labyu bb happy motmot hehe')">See you on our date! Click me...</button>
            `;

            document.getElementById("board-container").appendChild(finalFadeInContainer);
            createStars();
        }, 1000);

    } else {
        // --- THE SPAM FIX ---
        
        // 1. Immediately cancel any existing timers so they don't overlap
        clearTimeout(shakeTimer);
        clearTimeout(errorHideTimer);

        // 2. Hide the error message instantly to reset the UI
        let errMsg = document.getElementById("error-msg");
        errMsg.style.opacity = "0";

        // 3. Restart the shake animation perfectly
        let row = document.getElementById("phase3-row");
        row.classList.remove("shake"); 
        void row.offsetWidth; // Force a CSS reflow
        row.classList.add("shake");

        // 4. Start a fresh timer: wait 400ms for shake to end, THEN show error
        shakeTimer = setTimeout(() => {
            errMsg.innerText = errorMessages[errorIndex]; 
            errMsg.style.opacity = "1";
            errorIndex = (errorIndex + 1) % errorMessages.length; 
            
            // 5. Hide it again after 1.5 seconds
            //errorHideTimer = setTimeout(() => {
            //    errMsg.style.opacity = "0";
            //}, 1500);
        }, 400);
    }
}

function createStars() {
    for (let i = 0; i < 67; i++) {
        let star = document.createElement("div");
        star.innerHTML = "✦"; 
        star.classList.add("star");
        star.style.left = Math.random() * 100 + "vw";
        star.style.top = Math.random() * 100 + "vh";
        star.style.fontSize = (Math.random() * 1.5 + 1) + "rem";
        star.style.animationDelay = Math.random() * 3 + "s";
        document.body.appendChild(star);
    }
}
