document.addEventListener("DOMContentLoaded", () => {

    // Boot screen behavior for index.html
    const bootTerminal = document.getElementById("bootTerminal");
    const mainContent = document.getElementById("mainContent");
    if (bootTerminal && mainContent) {
        runBootSequence();
    }

    // Contact form behavior
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            sendMessage();
        });
    }

    // ABOUT PAGE - toggle bio
    const toggleBio = document.getElementById("toggleBio");
    const bioSection = document.getElementById("bioSection");

    if (toggleBio && bioSection) {
        console.log("About toggle feature active");

        // Load saved preference 
        let savedState = false;
        try {
            savedState = localStorage.getItem("bioExpanded") === "true";
        } catch (err) {
            console.warn("LocalStorage disabled:", err.message);
        }

        // Apply initial state
        bioSection.classList.toggle("hidden", !savedState);
        toggleBio.textContent = savedState ? "showLess();" : "showMore();";

        toggleBio.addEventListener("click", () => {
            const expanded = bioSection.classList.toggle("hidden") === false;
            toggleBio.textContent = expanded ? "showLess();" : "showMore();";

            try {
                localStorage.setItem("bioExpanded", expanded);
            } catch (err) {
                console.warn("LocalStorage blocked:", err.message);
            }

            console.log("Bio expanded:", expanded);
        });
    }

});




/*BOOT SCREEN for index.html*/

function runBootSequence() {
    const bootOutput = document.getElementById("bootOutput");
    const bootTerminal = document.getElementById("bootTerminal");
    const mainContent = document.getElementById("mainContent");

    const lines = [
        "> initializing portfolio.c...",
        "> compiling human profile...",
        "> linking skills.o...",
        "> loading UI drivers...",
        "> running main()...",
        ""
    ];

    bootTerminal.classList.remove("hidden");

    let i = 0;
    function typeLine() {
        if (i < lines.length) {
            bootOutput.innerHTML += lines[i] + "<br>";
            i++;
            setTimeout(typeLine, 600);
        } else {
            bootTerminal.classList.add("hidden");
            mainContent.classList.remove("hidden");
        }
    }

    typeLine();
}


// form
function sendMessage() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    
    const terminal = document.getElementById("terminal-output");
    const terminalBox = document.getElementById("terminal");
    terminalBox.classList.remove("hidden");

    let output = "";

    try {
        // try catch errors
        if (!name) {
            throw { field: "name", message: "missing value for 'name'" };
        }

        if (!email.includes("@")) {
            throw { field: "email", message: "invalid or missing email address" };
        }

        if (!message || message.length < 5) {
            throw { field: "message", message: "message too short" };
        }

        // If no errors:
        output += `<span class='ok'>✔ compilation successful!</span><br><br>`;
        output += "&lt;message sent&gt;<br><br>";

    } catch (err) {
        output += `<span class='err'>error (${err.field}):</span> ${err.message}<br>`;
        output += `<span class='hint'>hint:</span> please correct the ${err.field} field<br><br>`;
        output += "> awaiting valid input…<br>";
    }

    typeWriterHTML(terminal, output, 15);
}



// Typewriter effect for form terminal output
function typeWriterHTML(element, html, speed) {
    element.innerHTML = "";
    let i = 0;
    let isTag = false;
    let text = "";

    function type() {
        let char = html[i];

        if (char === "<") isTag = true;
        if (!isTag) {
            text += char;
            element.innerHTML = text;
        } else {
            text += char;
        }
        if (char === ">") {
            isTag = false;
            element.innerHTML = text;
        }

        i++;
        if (i < html.length) {
            setTimeout(type, speed);
        } else {
            element.innerHTML += `<span class="cursor">█</span>`;
        }
    }

    type();
}


// tools page
const languages = ["C", "Python", "JavaScript", "Verilog", "HTML/CSS"];

function loadLanguages() {
    const list = document.getElementById("languageList");
    if (!list) return; 

    languages.forEach(lang => {
        const li = document.createElement("li");
        li.textContent = lang;
        list.appendChild(li);
    });
}

//dynamic map for tool lookup
const toolInfo = new Map([
    ["arduino", "A microcontroller board great for prototyping embedded systems."],
    ["kicad", "Open source PCB design tool for schematics and PCB layout."],
    ["vscode", "A popular coding editor for many languages."],
    ["esp32", "A WiFi/Bluetooth microcontroller used in IoT."]
]);

function lookupTool() {
    const input = document.getElementById("toolInput");
    const output = document.getElementById("toolOutput");

    if (!input || !output) return; 

    const key = input.value.trim().toLowerCase();

    if (toolInfo.has(key)) {
        output.textContent = toolInfo.get(key);
    } else {
        output.textContent = "Tool not found. Try: Arduino, KiCad, VSCode, ESP32.";
    }
}

//Button change in tools.html
document.addEventListener("DOMContentLoaded", () => {
    loadLanguages();

    const btn = document.getElementById("toolBtn");
    if (btn) {
        console.log("toolBtn found — click listener attached");
        btn.addEventListener("click", lookupTool);
    } else {
        console.log("toolBtn NOT found");
    }
});



//fake compiler page
function runFakeCompiler() {
    const name = document.getElementById("cName").value.trim();
    const times = parseInt(document.getElementById("cTimes").value);
    const out = document.getElementById("cOutput");

    if (!name || times < 1) {
        out.textContent =
`Compiling main.c...
main.c:14:5: error: invalid input
hint: enter name and times > 0`;
        return;
    }

    let result =
`Compiling main.c...
main.c: warning: unused variable 'debug'
Build successful.

Running program...

`;

    for (let i = 0; i < times; i++) result += name + "\n";

    result += "\nProcess exited with code 0.";
    out.textContent = result;
}

