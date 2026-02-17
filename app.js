const rows = 6;
const columns = 5;
let currentRow = 0;
let currentColumn = 0;

// This runs as soon as the page loads
window.onload = function() {
    initializeBoard();
    setupTyping();
}

function initializeBoard() {
    // Generate the 5x6 grid dynamically
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // Create a <div> element for each tile
            let tile = document.createElement("div");
            
            // Give it an ID like "0-0", "0-1", etc., so we can find it later
            tile.id = r.toString() + "-" + c.toString(); 
            tile.classList.add("tile");
            
            // Append it to the empty #board div in our HTML
            document.getElementById("board").appendChild(tile);
        }
    }
}

function setupTyping() {
    // Listen for physical keyboard presses
    document.addEventListener("keyup", (e) => {
        
        // If the key pressed is a letter A-Z
        if (e.code >= "KeyA" && e.code <= "KeyZ") {
            if (currentColumn < columns) {
                // Find the specific tile we are currently on
                let currentTile = document.getElementById(currentRow.toString() + "-" + currentColumn.toString());
                
                // If it's empty, fill it with the letter
                if (currentTile.innerText === "") {
                    currentTile.innerText = e.code[3]; // e.code returns "KeyA", so index [3] gives us "A"
                    currentColumn += 1; // Move to the next column
                }
            }
        }
        
        // If the key pressed is Backspace
        else if (e.code === "Backspace") {
            if (currentColumn > 0 && currentColumn <= columns) {
                currentColumn -= 1; // Move back one column
                let currentTile = document.getElementById(currentRow.toString() + "-" + currentColumn.toString());
                currentTile.innerText = ""; // Clear the text
            }
        }
    });
}