document.addEventListener('DOMContentLoaded', () => {
    feather.replace();

    const desktop = document.getElementById('desktop');
    const windowsContainer = document.getElementById('windows');
    const taskbar = document.getElementById('taskbar');
    const windowTemplate = document.getElementById('window-template');
    const startMenuButton = document.getElementById('start-menu-button');
    const startMenu = document.getElementById('start-menu');
    const clock = document.getElementById('clock');
    const calendarWidget = document.getElementById('calendar-widget');
    const searchInput = document.querySelector('#search-bar input');
    const searchButton = document.getElementById('search-button');

    const windows = {};
    let zIndex = 1;

    //event listeners for shutdown and restart buttons
    const powerOffButton = document.getElementById('power-off');
    const restartButton = document.getElementById('restart');

    powerOffButton.addEventListener('click', () => {
        // Close the website by redirecting to a blank page or closing the tab
        if (confirm('Are you sure you want to shut down?')) {
            window.close();
            // Alternatively, redirect to a blank page or another page
            // window.location.href = 'about:blank';
        }
    });

    restartButton.addEventListener('click', () => {
        // Reload the website
        if (confirm('Are you sure you want to restart?')) {
            window.location.reload();
        }
    });

    function createWindow(id, title, content) {
        const windowElement = document.importNode(windowTemplate.content, true).querySelector('.window');
        windowElement.dataset.id = id;
        windowElement.querySelector('.window-title').textContent = title;
        windowElement.querySelector('.window-content').innerHTML = content;

        windowElement.style.left = `${50 + Object.keys(windows).length * 30}px`;
        windowElement.style.top = `${50 + Object.keys(windows).length * 30}px`;
        windowElement.style.zIndex = ++zIndex;

        const closeBtn = windowElement.querySelector('.close');
        closeBtn.addEventListener('click', () => closeWindow(id));

        const minimizeBtn = windowElement.querySelector('.minimize');
        minimizeBtn.addEventListener('click', () => minimizeWindow(id));

        const maximizeBtn = windowElement.querySelector('.maximize');
        maximizeBtn.addEventListener('click', () => maximizeWindow(id));

        makeDraggable(windowElement);
        makeResizable(windowElement);

        windowsContainer.appendChild(windowElement);
        windows[id] = windowElement;

        createTaskbarItem(id, title);

        // Initialize components based on window ID
        initializeWindow(id, windowElement);
    }

    function closeWindow(id) {
        if (windows[id]) {
            windows[id].remove();
            delete windows[id];
            document.querySelector(`.taskbar-item[data-id="${id}"]`).remove();
        }
    }

    function minimizeWindow(id) {
        if (windows[id]) {
            const windowElement = windows[id];
            windowElement.style.display = 'none';
            document.querySelector(`.taskbar-item[data-id="${id}"]`).classList.add('minimized');
        }
    }

    function maximizeWindow(id) {
        const win = windows[id];
        if (win) {
            if (win.dataset.maximized === "true") {
                // Restore the window to its original size and position
                win.style.width = win.dataset.originalWidth;
                win.style.height = win.dataset.originalHeight;
                win.style.left = win.dataset.originalLeft;
                win.style.top = win.dataset.originalTop;
                win.dataset.maximized = "false";
            } else {
                // Save the original size and position before maximizing
                win.dataset.originalWidth = win.style.width;
                win.dataset.originalHeight = win.style.height;
                win.dataset.originalLeft = win.style.left;
                win.dataset.originalTop = win.style.top;

                // Maximize the window
                win.style.width = "100vw";
                win.style.height = "calc(100vh - 40px)"; // Adjust for taskbar height
                win.style.left = "0";
                win.style.top = "0";
                win.dataset.maximized = "true";
            }
        }
    }

    function createTaskbarItem(id, title) {
        const item = document.createElement('button');
        item.classList.add('taskbar-item');
        item.textContent = title;
        item.dataset.id = id;

        // Taskbar click behavior
        item.addEventListener('click', () => {
            const windowElement = windows[id];

            if (!windowElement) return; // Safeguard against undefined windows

            if (windowElement.style.display === 'none') {
                // Restore a minimized window
                windowElement.style.display = 'block';
                windowElement.classList.remove('minimized');
                focusWindow(id);
            } else if (windowElement.classList.contains('minimized')) {
                // Handle the minimized class specifically
                windowElement.classList.remove('minimized');
                windowElement.style.display = 'block';
                focusWindow(id);
            } else {
                // Window is already visible, bring it to focus
                focusWindow(id);
            }
        });

        // Append the taskbar item
        taskbar.appendChild(item);
    }

    function focusWindow(id) {
        if (windows[id]) {
            windows[id].style.zIndex = ++zIndex;
        }
    }

    function makeDraggable(element) {
        let offsetX = 0, offsetY = 0;
        let isDragging = false;

        const header = element.querySelector('.window-header'); // Drag handle
        if (!header) {
            console.error('No drag handle found for:', element);
            return;
        }

        // Start dragging
        header.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent text selection or unintended actions
            isDragging = true;

            // Record the initial offset between cursor and the window's position
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDragging);
        });

        // Perform dragging
        function drag(e) {
            if (!isDragging) return;

            // Update the window's position to align with the cursor
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }

        // Stop dragging
        function stopDragging() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDragging);
        }
    }

    function makeResizable(element) {
        const resizer = element.querySelector('.resize-handle');
        resizer.addEventListener('mousedown', initResize, false);

        function initResize(e) {
            window.addEventListener('mousemove', Resize, false);
            window.addEventListener('mouseup', stopResize, false);
        }

        function Resize(e) {
            element.style.width = (e.clientX - element.offsetLeft) + 'px';
            element.style.height = (e.clientY - element.offsetTop) + 'px';
        }

        function stopResize(e) {
            window.removeEventListener('mousemove', Resize, false);
            window.removeEventListener('mouseup', stopResize, false);
        }
    }

    const projectsContent = `
    <h1>My Projects</h1>
    <div class="project">
    <h2>GAME DEV</h2>
        <h3>
            <a href="https://github.com/ChPuru/Doom" target="_blank" rel="noopener noreferrer" class="custom-link">
                DOOM
            </a>
        </h3>
        <p>My journey into game development using Python has been an exciting adventure where I recreated iconic games with a personal touch. Some of these include Zelda, Stardew Valley, Minecraft, Tower Defence, Space Invader, Pirate Maker Game, Breakout, Battle Game, Tetris, Space Shooter, Pacman, Pong Game, Tic Tac Toe, Hangman, Snake Game, and Chess. Among all these projects, my favorite is my recreation of DOOM, a project that truly challenged and honed my skills. With each game my love for gaming and how games were made grew altogether.</p>
    </div>
    <div class="project">
    <h2>Python Projects</h2>
        <h3>
            <a href="https://github.com/ChPuru/spch-txt" target="_blank" rel="noopener noreferrer" class="custom-link">
                Speech - To - Text
            </a>
        </h3>
        <p>I’ve explored the versatility of Python through a variety of projects. These include a weather app, text adventure game, story game, interactive story game, translator, to-do app, text summarizer, speech-to-text engine (and vice versa), and a project that generates random musical beats. Additionally, I’ve created a notepad app, music player, tools to colorize black-and-white images, convert images to black-and-white, apply filters to images, and a calculator. Many of these projects feature simple usage, intuitive GUIs, and functionality that highlights Python's potential for everyday solutions.</p>
    </div>
    <div class="project">
    <h2>AI/ML</h2>
        <h3>
            <a href="https://github.com/ChPuru/AI-FlappyBird" target="_blank" rel="noopener noreferrer" class="custom-link">
                AI Flappy-Bird
            </a>
        </h3>
        <p>My work in AI/ML spans a variety of domains, my expertise with tools like OpenCV, YOLO, and numerous libraries. I’ve built sentiment analysis systems, song recommendation engines, and diverse chatbots: a poetry-generating chatbot, chatbots for mental health support, e-commerce assistance, and general usage. I've even trained a chatbot on custom datasets from Kaggle and the web, with experiments in recreating systems like Alexa, Siri, and Google Assistant.

My projects also include image classifiers, real-time image and face detection systems, and dashboards for effective data visualization. On the gaming front, I’ve developed AI Chess, AI Flappy Bird, AimBots for games like Valorant and Counter-Strike and autonomous game bots for titles like GTA and Cyberpunk 2077, capable of achieving 100% completion by learning in real time. Currently, I’m working on a universal game bot designed to adapt to and play any given game.</p>
    </div>
    <div class="project">
    <h2>JARVIS</h2>
        <h3>
            <a>
                JARVIS
            </a>
        </h3>
        <p>Inspired by the legendary AI assistant from Iron Man, I embarked on a mission to create my own Jarvis. This project has been a transformative experience, blending AI, ML, IoT, and immense creativity. With Jarvis, I can effortlessly control my desktop or any connected device using voice or gesture commands. From setting alarms and timers to managing all the electronics in my room—air purifier, lights, AC, TV, microwave—one simple command gets the job done.

Jarvis also serves as a multi-functional chatbot: a friend for meaningful conversations, a mental health companion, and a versatile assistant ready to handle tasks. Its image-generation feature brings your thoughts to life, while its room scanning and measurement capabilities allow it to suggest architectural plans or furniture arrangements.

This project is an evolving masterpiece, with endless possibilities. I’m continually refining Jarvis to make it even more dynamic, functional, and lifelike—aspiring to surpass the fictional AI we all admire. Jarvis exemplifies the fusion of imagination and cutting-edge technology, a testament to my dedication to pushing boundaries in AI and IoT.</p>
    </div>
    `;

    const aboutContent = `
        <h2>About Me</h2>
        <p>I'm currently pursuing a BTech in Computer Engineering from KJ Somaiya School of Engineering, along with a BS degree in Data Science and Applications from IIT Madras. By day, I'm a programmer, passionately crafting lines of code to explore the realms of AI, Robotics, and data-driven innovation. My digital journey was sparked by encounters with visionaries like Elon Musk, the legendary Tony Stark, and countless hours immersed in gaming—from classics like Prince of Persia to modern epics like GTA and COD.

Beyond the screen, you'll often find me playing football and pickleball, stargazing with my telescope and binoculars, capturing moments through photography, or diving into conspiracy theories about the universe. As an aspiring space explorer-turned-programmer, my fascination with aerospace engineering, AI, and Robotics continues to drive my pursuits.

I'm thrilled to share that my dream project, 'Jarvis'—a voice-activated assistant and chatbot capable of seamlessly handling desktop tasks and interfacing with IoT—is no longer just a concept but a working prototype. Currently, I'm focused on advancing AI and productivity, exploring innovative, cost-effective robotics solutions that can rival high-budget counterparts.

Looking ahead, I aim to contribute to Big Tech, space organizations, or perhaps establish my own startup to bring my vision to life.</p>
        <h3>Skills</h3>
        <ul>
            <li>AI/ML : Fluent in : Python, MATLAB, Simulink, JavaScript, SQL ; Novoice/Learning : R, Scala, Julia</li>
            <li>Web Development : Fluent in : HTML, CSS, JavaScript, Python ; Novoice/Learning : Ruby, Typescript, Node, React, Vue</li>
            <li>Databases: PostgreSQL, NoSQL, MongoDB</li>
            <li>Development(Game & Software) : Fluent in : Python ; Intermediate Knowledge : C, C++, C#, Java ; Novoice/Learning: Kotlin, Swift, Golang</li>
            <li>Tools & Softwares : Git, IDEs, Bootstrap, Unity, UnrealEngine, Blender, PowerBI, AutoCAD, SolidWorks, SketchUP, Revit, Arduino, TinkerCad, OpenRocket</li>
        </ul>
    `;

    const blogContent = `
        <h2>Coming Soon...</h2>
    `;

    const contactContent = `
    <h2>Contact Me</h2>
    <p>Email : ch.puru31@gmail.com</p>
    <p>Address : JPR, RJ, IND // BOM, MH, IND</p>
    <div class="social-icons">
        <a href="https://www.linkedin.com/in/purunjay-choudhary/" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linkedin.svg" alt="LinkedIn" width="32" height="32">
        </a>
        <a href="https://www.instagram.com/_.p.u.r.u._/" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/instagram.svg" alt="Instagram" width="32" height="32">
        </a>
    </div>
`;

    const terminalContent = `
        <div id="terminal-output"></div>
        <div id="terminal-input">
            <span class="prompt">$</span>
            <input type="text" id="terminal-command" autofocus>
        </div>
    `;

    const weatherContent = `
        <h2>Weather</h2>
        <div id="weather-info">
            <p>Loading weather information...</p>
        </div>
    `;

    const newsContent = `
        <h2>Latest News</h2>
        <div id="news-feed">
            <p>Loading news feed...</p>
        </div>
    `;

    const calculatorContent = `
        <div class="calculator-grid">
            <div class="calculator-output" id="calculator-output">0</div>
            <button class="calculator-button" data-action="clear">C</button>
            <button class="calculator-button" data-action="delete">DEL</button>
            <button class="calculator-button" data-action="operator">÷</button>
            <button class="calculator-button" data-action="number">7</button>
            <button class="calculator-button" data-action="number">8</button>
            <button class="calculator-button" data-action="number">9</button>
            <button class="calculator-button" data-action="operator">×</button>
            <button class="calculator-button" data-action="number">4</button>
            <button class="calculator-button" data-action="number">5</button>
            <button class="calculator-button" data-action="number">6</button>
            <button class="calculator-button" data-action="operator">-</button>
            <button class="calculator-button" data-action="number">1</button>
            <button class="calculator-button" data-action="number">2</button>
            <button class="calculator-button" data-action="number">3</button>
            <button class="calculator-button" data-action="operator">+</button>
            <button class="calculator-button" data-action="number">0</button>
            <button class="calculator-button" data-action="decimal">.</button>
            <button class="calculator-button" data-action="equals">=</button>
        </div>
    `;

    const textEditorContent = `
        <div class="text-editor">
            <div id="text-editor-content" contenteditable="true" placeholder=""></div>
        </div>
    `;

    const musicPlayerContent = `
        <div class="music-player">
            <audio id="audio-player" controls>
                <source src="/American Authors - Hit It (Audio).mp3" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <div id="playlist">
                <h3>Playlist</h3>
                <ul>
                    <li data-src="/srcs/John Newman - Love Me Again.mp3">Love Me Again</li>
                    <li data-src="/srcs/Dominic Fike - Phone Numbers (Official Audio).mp3">Phone Numbers</li>
                    <li data-src="/srcs/American Authors - Hit It (Audio).mp3">Hit It</li>
                </ul>
            </div>
        </div>
    `;


    const snakeGameContent = `
        <div id="snake-game-container">
            <canvas id="snake-canvas" width="300" height="300"></canvas>
        </div>
    `;

    const tetrisContent = `
        <div id="tetris-game-container">
            <canvas id="tetris-canvas" width="300" height="600"></canvas>
        </div>
    `;

    const breakoutContent = `
        <div id="breakout-game-container">
            <canvas id="breakout-canvas" width="480" height="320"></canvas>
        </div>
    `;


    const achievementsContent = `
    <h2>Gaming</h2>
    <div class="achievement">
        <img src="/srcs/codm.png" alt="Achievement 1">
        <h3>CODM E-Sports Professional</h3>
        <p>I’ve been a passionate gamer since 2018, starting during the beta release of CODM. Over the years, I’ve honed my skills, reaching the Legendary rank multiple times and securing a spot in the global leaderboard’s Top 100 for three consecutive seasons. Competing at a Tier 1 level, I’ve participated in high-stakes tournaments, facing off against notable YouTubers and renowned players. These experiences have shaped my strategic mindset and resilience, both in gaming and beyond.</p>
    </div>
    <div class="achievement">
        <img src="/srcs/predator-rank.png" alt="Achievement 2">
        <h3>Achieving Learderboard in Apex Legends</h3>
        <p>What began as a casual pursuit quickly turned into a competitive passion. Starting from humble beginnings, I climbed the ranks to secure a spot on the global leaderboard, reaching the Top 750. This journey reflects my adaptability, and love for gaming, pushing me to continuously improve.</p>
    </div>
    <div class="achievement">
        <img src="/srcs/maxresdefault-removebg-preview.png" alt="Achievement 3">
        <img src="/srcs/maxresdefault__1_-removebg-preview.png" alt="Achievement 3">
        <h3>Valorant, Counter-Strike & Warzone</h3>
        <p>As a casual gamer, I’ve enjoyed exploring titles like Valorant, Counter Strike, and Warzone. In Valorant, I reached my peak rank of Ascendant 3. In Warzone, I achieved Crimson rank.</p>
    </div>
    <div class="achievement">
        <h3>Story Games</h3>
        <p>I have a deep passion for immersive storyline games, where I’ve dedicated myself to achieving 100% completion in a wide range of iconic titles. From the expansive worlds of GTA, RDR2, Cyberpunk 2077, and The Witcher 3, to the intense narratives of Elden Ring, Sekiro, Ghost of Tsushima and the Dark Souls series, I’ve explored every corner of these universes. I’ve also completed Call of Duty, God of War, Prince of Persia, Detroit: Become Human, Black Myth: Wukong, Tin Tin, and many others. </p>
    </div>
    `;

    const readmeContent = `
    <h2>Readme</h2>
    <div class="text-editor">
    <div id="readme-editor-content" contenteditable="false">
        <p>Welcome to my portfolio! To fully experience my interactive portfolio, you can refer to this guide:</p>

        <h3>Projects Section</h3>
        <p>
        Clicking on the embedded text or headlines within the Projects icon will redirect you to the respective GitHub repository of each project.
        </p>

        <h3>Contact Section</h3>
        <p>
        The LinkedIn and Instagram icons under the Contact icon will take you directly to my profiles when clicked.
        </p>

        <h3>Terminal Commands</h3>
        <ul>
        <li><strong>help</strong>: Displays all available commands.</li>
        <li><strong>date</strong>: Shows the current date.</li>
        <li><strong>clear</strong>: Clears the terminal screen.</li>
        <li><strong>echo</strong>: Prints your message. For example, typing <code>echo hi</code> will display "hi" in the output.</li>
        </ul>

        <h3>Text Editor</h3>
        <p>
        You can use the text editor as a notepad, load <code>.txt</code> files into it, or save your writings as <code>.txt</code> files on your system.
        </p>

        <h3>Games</h3>
        <ul>
        <li><strong>Snake Game</strong>: Press Enter to start.</li>
        <li><strong>Tetris</strong>: Press Enter to start.</li>
        <li>
            <strong>Breakout</strong>:  Press Enter thrice to start.
        </li>
        </ul>

        <h3>Taskbar Features</h3>
        <ul>
        <li><strong>Clock</strong>: Click the time to access the calendar.</li>
        <li>
            <strong>Search Bar</strong>: Type to search for desktop icons or perform web searches, which will open in a new window.
        </li>
        <li>
            <strong>Start Menu</strong>: Clicking the Start Menu reveals options to shut down (closes the tab) or restart (reloads the page).
        </li>
        </ul>
    </div>
    </div>
    `;

    function getWindowContent(windowId) {
        switch(windowId) {
            case 'projects':
                return projectsContent;
            case 'about':
                return aboutContent;
            case 'blog':
                return blogContent;
            case 'contact':
                return contactContent;
            case 'terminal':
                return terminalContent;
            case 'weather':
                return weatherContent;
            case 'news':
                return newsContent;
            case 'calculator':
                return calculatorContent;
            case 'text-editor':
                return textEditorContent;
            case 'music-player':
                return musicPlayerContent;
            case 'snake-game':
                return snakeGameContent;
            case 'tetris':
                return tetrisContent;
            case 'breakout':
                return breakoutContent;
            case 'achievements':
                return achievementsContent;
            case 'readme':
                return readmeContent;
            default:
                return '<p>Content not found.</p>';
        }
    }

    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const windowId = icon.dataset.window;
            if (windowId === 'github') {
                window.open('https://github.com/ChPuru', '_blank');
            } else {
                if (!windows[windowId]) {
                    createWindow(windowId, icon.querySelector('span').textContent, getWindowContent(windowId));
                }
                if (windows[windowId].style.display === 'none') {
                    windows[windowId].style.display = 'block';
                }
                focusWindow(windowId);
            }
        });
    });

    function initializeWindow(id, windowElement) {
        switch (id) {
            case 'terminal':
                initializeTerminal(windowElement);
                break;
            case 'weather':
                initializeWeather(windowElement);
                break;
            case 'news':
                initializeNews(windowElement);
                break;
            case 'calculator':
                initializeCalculator(windowElement);
                break;
            case 'text-editor':
                initializeTextEditor(windowElement);
                break;
            case 'music-player':
                initializeMusicPlayer(windowElement);
                break;
            case 'snake-game':
                initializeSnakeGame(windowElement);
                break;
            case 'tetris':
                initializeTetris(windowElement);
                break;
            case 'breakout':
                initializeBreakout(windowElement);
                break;
            case 'readme':
                initializeReadme(windowElement);
                break;
            default:
                break;
        }
    }

    function initializeTerminal(windowElement) {
        const terminalOutput = windowElement.querySelector('#terminal-output');
        const terminalInput = windowElement.querySelector('#terminal-command');

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim(); // Get the entered command
                terminalOutput.innerHTML += `<div>$ ${command}</div>`; // Show command
                executeCommand(command, terminalOutput); // Process command
                terminalInput.value = ''; // Clear input
            }
        });

        function executeCommand(command, outputElement) {
            let output = '';
            switch (command.toLowerCase()) {
                case 'help':
                    output = 'Available commands: help, date, clear, echo [message]';
                    break;
                case 'date':
                    output = new Date().toString();
                    break;
                case 'clear':
                    outputElement.innerHTML = '';
                    return; // Skip adding this output
                default:
                    if (command.startsWith('echo ')) {
                        output = command.slice(5);
                    } else {
                        output = `Command not found: ${command}`;
                    }
            }
            outputElement.innerHTML += `<div>${output}</div>`;
        }
    }


    function initializeWeather(windowElement) {
        const apiKey = '75afac04cac904ea55163b06ddbfe443';
        const weatherInfo = windowElement.querySelector('#weather-info');

        if (!navigator.geolocation) {
            weatherInfo.textContent = 'Geolocation not supported by your browser.';
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    weatherInfo.innerHTML = `
                        <h3>${data.name}</h3>
                        <p>Temperature: ${data.main.temp}°C</p>
                        <p>Condition: ${data.weather[0].description}</p>
                    `;
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    weatherInfo.textContent = 'Error fetching weather data.';
                });
        }, (error) => {
            console.error('Geolocation error:', error);
            weatherInfo.textContent = 'Unable to retrieve geolocation data.';
        });
    }

    function initializeNews(windowElement) {
        const apiKey = 'AIzaSyD8J2CQiicZvpdew71rw50QmCYHpWspL_Y'; // Replace with your Google CSE API key
        const cx = '96c72656b8c694808'; // Replace with your Google CSE ID
        const newsFeed = windowElement.querySelector('#news-feed');
    
        fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=news`)
            .then(response => {
                console.log('Response:', response); // Log the full response object
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.items) {
                    newsFeed.innerHTML = data.items.map(item => `
                        <div class="news-item">
                            <h3>${item.title}</h3>
                            <p>${item.snippet}</p>
                            <a href="${item.link}" target="_blank">Read more</a>
                        </div>
                    `).join('');
                } else {
                    newsFeed.textContent = 'No news articles found.';
                }
            })
            .catch(error => {
                console.error('Error fetching news data:', error);
                newsFeed.textContent = 'Error fetching news data.';
            });
    }
    
    // Initialize the news feed when the window loads
    window.onload = () => {
        initializeNews(document);
    };

    function initializeCalculator(windowElement) {
        const output = windowElement.querySelector('#calculator-output');
        let currentValue = '0';
        let previousValue = null;
        let operation = null;

        windowElement.querySelectorAll('.calculator-button').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const buttonValue = button.textContent;

                switch (action) {
                    case 'number':
                        currentValue = currentValue === '0' ? buttonValue : currentValue + buttonValue;
                        break;
                    case 'decimal':
                        if (!currentValue.includes('.')) currentValue += '.';
                        break;
                    case 'operator':
                        previousValue = currentValue;
                        currentValue = '';
                        operation = buttonValue;
                        break;
                    case 'equals':
                        if (previousValue && operation) {
                            currentValue = calculate(previousValue, currentValue, operation);
                            previousValue = null;
                            operation = null;
                        }
                        break;
                    case 'clear':
                        currentValue = '0';
                        previousValue = null;
                        operation = null;
                        break;
                    case 'delete':
                        currentValue = currentValue.slice(0, -1);
                        if (currentValue === '') currentValue = '0';
                        break;
                    default:
                        break;
                }
                output.textContent = currentValue || '0';
            });
        });

        function calculate(a, b, operator) {
            a = parseFloat(a);
            b = parseFloat(b);
            switch (operator) {
                case '+': return (a + b).toString();
                case '-': return (a - b).toString();
                case '×': return (a * b).toString();
                case '÷': return b !== 0 ? (a / b).toString() : 'Error';
                default: return b.toString();
            }
        }
    }

    function initializeTextEditor(windowElement) {
        const textArea = windowElement.querySelector('#text-editor-content');

        // Save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () => {
            const blob = new Blob([textArea.value], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'notes.txt';
            a.click();
        });

        // Load button
        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load';
        loadButton.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'text/plain';
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        textArea.value = event.target.result;
                    };
                    reader.readAsText(file);
                }
            });
            input.click();
        });

        textArea.parentElement.append(saveButton, loadButton);
    }

    function initializeMusicPlayer(windowElement) {
        const audioPlayer = windowElement.querySelector('#audio-player');
        const playlist = windowElement.querySelector('#playlist');

        playlist.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                audioPlayer.src = e.target.dataset.src;
                audioPlayer.play();
            }
        });
    }

    function initializeSnakeGame(windowElement) {
        const canvas = windowElement.querySelector('#snake-canvas');
        const ctx = canvas.getContext('2d');
    
        const gridSize = 20; // Size of each grid cell
        let snake, direction, food, score, gameInterval, running;
    
        // Reset the game state
        function resetGame() {
            snake = [{ x: 5, y: 5 }];
            direction = { x: 0, y: 0 }; // Start with no movement
            food = generateFood();
            score = 0;
            updateScore();
            clearInterval(gameInterval);
            running = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    
        function generateFood() {
            let newFood;
            do {
                newFood = {
                    x: Math.floor(Math.random() * (canvas.width / gridSize)),
                    y: Math.floor(Math.random() * (canvas.height / gridSize)),
                };
            } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
            return newFood;
        }
    
        function updateScore() {
            let scoreElement = windowElement.querySelector('#snake-score');
            if (!scoreElement) {
                scoreElement = document.createElement('div');
                scoreElement.id = 'snake-score';
                scoreElement.style.position = 'absolute';
                scoreElement.style.top = '5px';
                scoreElement.style.left = '95px';
                scoreElement.style.color = 'white';
                windowElement.appendChild(scoreElement);
            }
            scoreElement.textContent = `Score: ${score}`;
        }
    
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            // Draw Food
            ctx.fillStyle = 'red';
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    
            // Draw Snake
            ctx.fillStyle = 'green';
            snake.forEach(segment => {
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
            });
    
            // Move Snake
            const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    
            // Check Collisions
            if (
                head.x < 0 || head.x >= canvas.width / gridSize ||
                head.y < 0 || head.y >= canvas.height / gridSize ||
                snake.some(segment => segment.x === head.x && segment.y === head.y)
            ) {
                resetGame();
                return;
            }
    
            snake.unshift(head);
    
            // Check Food Collision
            if (head.x === food.x && head.y === food.y) {
                food = generateFood();
                score++;
                updateScore();
            } else {
                snake.pop();
            }
        }
    
        function changeDirection(event) {
            const { key } = event;
            if (key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
            else if (key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
            else if (key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
            else if (key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
        }
    
        function startGame() {
            if (!running) {
                resetGame();
                direction = { x: 1, y: 0 }; // Start moving to the right
                gameInterval = setInterval(draw, 100);
                running = true;
            }
        }
    
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') startGame();
            changeDirection(e);
        });
    
        resetGame();
    }
    
    function initializeTetris(windowElement) {
        const canvas = windowElement.querySelector('#tetris-canvas');
        const ctx = canvas.getContext('2d');
    
        const ROWS = 20;
        const COLUMNS = 10;
        const BLOCK_SIZE = 30;
    
        let board, currentPiece, posX, posY, score, gameInterval, running;
    
        const SHAPES = [
            [], // Placeholder
            [[1, 1, 1, 1]], // I
            [[1, 1], [1, 1]], // O
            [[0, 1, 0], [1, 1, 1]], // T
            [[1, 1, 0], [0, 1, 1]], // Z
            [[0, 1, 1], [1, 1, 0]], // S
            [[1, 0, 0], [1, 1, 1]], // L
            [[0, 0, 1], [1, 1, 1]], // J
        ];
    
        function resetGame() {
            board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
            currentPiece = getRandomPiece();
            posX = Math.floor(COLUMNS / 2) - Math.floor(currentPiece[0].length / 2);
            posY = 0;
            score = 0;
            updateScore();
            clearInterval(gameInterval);
            running = false;
        }
    
        function getRandomPiece() {
            const id = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
            return SHAPES[id];
        }
    
        function updateScore() {
            let scoreElement = windowElement.querySelector('#tetris-score');
            if (!scoreElement) {
                scoreElement = document.createElement('div');
                scoreElement.id = 'tetris-score';
                scoreElement.style.position = 'absolute';
                scoreElement.style.top = '5px';
                scoreElement.style.left = '95px';
                scoreElement.style.color = 'white';
                windowElement.appendChild(scoreElement);
            }
            scoreElement.textContent = `Score: ${score}`;
        }
    
        function drawBoard() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            // Draw placed blocks
            board.forEach((row, y) =>
                row.forEach((value, x) => {
                    if (value) drawBlock(x, y, 'grey');
                })
            );
    
            // Draw current piece
            currentPiece.forEach((row, y) =>
                row.forEach((value, x) => {
                    if (value) drawBlock(posX + x, posY + y, 'red');
                })
            );
        }
    
        function drawBlock(x, y, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    
        function collision(newX, newY, piece) {
            return piece.some((row, dy) =>
                row.some((value, dx) => {
                    let x = newX + dx;
                    let y = newY + dy;
                    return value && (x < 0 || x >= COLUMNS || y >= ROWS || (board[y] && board[y][x]));
                })
            );
        }
    
        function dropPiece() {
            if (!collision(posX, posY + 1, currentPiece)) {
                posY++;
            } else {
                mergePiece();
                clearLines();
                currentPiece = getRandomPiece();
                posX = Math.floor(COLUMNS / 2) - Math.floor(currentPiece[0].length / 2);
                posY = 0;
    
                if (collision(posX, posY, currentPiece)) {
                    // Removed alert statement
                    resetGame();
                }
            }
            drawBoard();
        }
    
        function mergePiece() {
            currentPiece.forEach((row, y) =>
                row.forEach((value, x) => {
                    if (value) board[posY + y][posX + x] = 1;
                })
            );
        }
    
        function clearLines() {
            let linesCleared = 0;
    
            board = board.filter(row => {
                if (row.every(cell => cell !== 0)) {
                    linesCleared++;
                    return false; // Remove full row
                }
                return true;
            });
    
            // Add empty rows at the top
            while (board.length < ROWS) {
                board.unshift(Array(COLUMNS).fill(0));
            }
    
            score += linesCleared * 10; // Increase score for cleared rows
            updateScore();
        }
    
        function rotatePiece() {
            const rotated = currentPiece[0].map((_, i) =>
                currentPiece.map(row => row[i]).reverse()
            );
            if (!collision(posX, posY, rotated)) {
                currentPiece = rotated;
            }
        }
    
        function startGame() {
            if (!running) {
                resetGame();
                gameInterval = setInterval(dropPiece, 500);
                running = true;
            }
        }
    
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') startGame();
            if (e.key === 'ArrowLeft' && !collision(posX - 1, posY, currentPiece)) posX--;
            if (e.key === 'ArrowRight' && !collision(posX + 1, posY, currentPiece)) posX++;
            if (e.key === 'ArrowDown') dropPiece();
            if (e.key === 'ArrowUp') rotatePiece();
            drawBoard();
        });
    
        resetGame();
    }
    
    function initializeBreakout(windowElement) {
        const canvas = windowElement.querySelector('#breakout-canvas');
        const ctx = canvas.getContext('2d');
    
        const BALL_RADIUS = 8;
        const PADDLE_WIDTH = 80;
        const PADDLE_HEIGHT = 12;
        const BRICK_ROW_COUNT = 5;
        const BRICK_COLUMN_COUNT = 7;
        const BRICK_WIDTH = 70;
        const BRICK_HEIGHT = 20;
        const BRICK_PADDING = 10;
        const BRICK_OFFSET_TOP = 30;
        const BRICK_OFFSET_LEFT = 30;
    
        // Enhanced game state
        let ball, paddle, bricks, score, gameInterval, running;
        let lastTime = 0;
        const FRAME_RATE = 1000 / 60; // 60 FPS target
    
        class Ball {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.speed = 7;
                this.dx = 0;
                this.dy = 0;
                this.launched = false;
            }
    
            launch() {
                const angle = (Math.random() * (Math.PI / 3)) - (Math.PI / 6); // Launch between -30 and 30 degrees
                this.dx = this.speed * Math.sin(angle);
                this.dy = -this.speed * Math.cos(angle);
                this.launched = true;
            }
    
            update(deltaTime) {
                if (!this.launched) {
                    this.x = paddle.x + paddle.width / 2;
                    this.y = canvas.height - PADDLE_HEIGHT - BALL_RADIUS - 1;
                    return;
                }
    
                const speedMultiplier = deltaTime / FRAME_RATE;
                this.x += this.dx * speedMultiplier;
                this.y += this.dy * speedMultiplier;
    
                // Wall collisions with proper bouncing
                if (this.x - BALL_RADIUS <= 0 || this.x + BALL_RADIUS >= canvas.width) {
                    this.dx = -this.dx;
                    this.x = this.x - BALL_RADIUS <= 0 ? BALL_RADIUS : canvas.width - BALL_RADIUS;
                }
                if (this.y - BALL_RADIUS <= 0) {
                    this.dy = -this.dy;
                    this.y = BALL_RADIUS;
                }
            }
    
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, BALL_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = '#FF4444';
                ctx.fill();
                ctx.strokeStyle = '#CC0000';
                ctx.stroke();
                ctx.closePath();
            }
        }
    
        class Paddle {
            constructor() {
                this.width = PADDLE_WIDTH;
                this.height = PADDLE_HEIGHT;
                this.x = (canvas.width - this.width) / 2;
                this.speed = 8;
                this.moving = 0; // -1 for left, 1 for right, 0 for stationary
            }
    
            update(deltaTime) {
                const speedMultiplier = deltaTime / FRAME_RATE;
                this.x += this.moving * this.speed * speedMultiplier;
                this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
            }
    
            draw() {
                ctx.fillStyle = '#4444FF';
                ctx.fillRect(this.x, canvas.height - this.height, this.width, this.height);
                // Add visual depth
                ctx.fillStyle = '#6666FF';
                ctx.fillRect(this.x, canvas.height - this.height, this.width, 3);
            }
        }
    
        function createBricks() {
            const bricks = [];
            const colors = ['#FF4444', '#FF8844', '#FFCC44', '#44FF44', '#4444FF'];
            
            for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
                bricks[c] = [];
                for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                    bricks[c][r] = { 
                        visible: true,
                        color: colors[r],
                        x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
                        y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
                        health: BRICK_ROW_COUNT - r // Bricks at top are tougher
                    };
                }
            }
            return bricks;
        }
    
        function resetGame() {
            paddle = new Paddle();
            ball = new Ball(paddle.x + paddle.width / 2, canvas.height - PADDLE_HEIGHT - BALL_RADIUS - 1);
            bricks = createBricks();
            score = 0;
            updateScore();
            clearInterval(gameInterval);
            running = false;
            lastTime = performance.now();
        }
    
        function updateScore() {
            let scoreElement = windowElement.querySelector('#breakout-score');
            if (!scoreElement) {
                scoreElement = document.createElement('div');
                scoreElement.id = 'breakout-score';
                scoreElement.style.position = 'absolute';
                scoreElement.style.top = '5px';
                scoreElement.style.left = '95px';
                scoreElement.style.color = 'white';
                windowElement.appendChild(scoreElement);
            }
            scoreElement.textContent = `Score: ${score}`;
        }
    
        function checkPaddleCollision() {
            if (ball.y + BALL_RADIUS >= canvas.height - PADDLE_HEIGHT &&
                ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) {
                
                // Calculate impact point relative to paddle center (-1 to 1)
                const impactPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
                
                // Calculate new angle based on impact point
                const maxAngle = Math.PI / 3; // 60 degrees
                const angle = impactPoint * maxAngle;
                
                // Update ball velocity
                ball.dy = -ball.speed * Math.cos(angle);
                ball.dx = ball.speed * Math.sin(angle);
                
                // Prevent sticking by moving ball above paddle
                ball.y = canvas.height - PADDLE_HEIGHT - BALL_RADIUS - 1;
                
                // Add slight speed increase on each paddle hit
                ball.speed = Math.min(ball.speed * 1.02, 12);
            }
        }
    
        function checkBrickCollision() {
            const ballLeft = ball.x - BALL_RADIUS;
            const ballRight = ball.x + BALL_RADIUS;
            const ballTop = ball.y - BALL_RADIUS;
            const ballBottom = ball.y + BALL_RADIUS;
    
            for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
                for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                    const brick = bricks[c][r];
                    if (!brick.visible) continue;
    
                    const brickLeft = brick.x;
                    const brickRight = brick.x + BRICK_WIDTH;
                    const brickTop = brick.y;
                    const brickBottom = brick.y + BRICK_HEIGHT;
    
                    if (ballRight >= brickLeft && ballLeft <= brickRight &&
                        ballBottom >= brickTop && ballTop <= brickBottom) {
                        
                        // Determine collision side
                        const fromLeft = Math.abs(ballRight - brickLeft);
                        const fromRight = Math.abs(ballLeft - brickRight);
                        const fromTop = Math.abs(ballBottom - brickTop);
                        const fromBottom = Math.abs(ballTop - brickBottom);
                        const min = Math.min(fromLeft, fromRight, fromTop, fromBottom);
    
                        brick.health--;
                        if (brick.health <= 0) {
                            brick.visible = false;
                            score += (BRICK_ROW_COUNT - r) * 10; // More points for higher bricks
                            updateScore();
                        }
    
                        // Bounce based on collision side
                        if (min === fromLeft || min === fromRight) {
                            ball.dx = -ball.dx;
                        } else {
                            ball.dy = -ball.dy;
                        }
    
                        // Add slight random variation to prevent monotonous bounces
                        ball.dx += (Math.random() - 0.5) * 0.5;
                        ball.dy += (Math.random() - 0.5) * 0.5;
    
                        // Normalize speed to maintain consistent ball velocity
                        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
                        ball.dx = (ball.dx / speed) * ball.speed;
                        ball.dy = (ball.dy / speed) * ball.speed;
    
                        return true;
                    }
                }
            }
            return false;
        }
    
        function drawBricks() {
            bricks.forEach(column => {
                column.forEach(brick => {
                    if (brick.visible) {
                        ctx.fillStyle = brick.color;
                        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
                        // Add 3D effect
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, 4);
                    }
                });
            });
        }
    
        function gameLoop(timestamp) {
            if (!running) return;
    
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;
    
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            // Update game objects
            paddle.update(deltaTime);
            ball.update(deltaTime);
    
            // Check collisions
            if (ball.launched) {
                checkPaddleCollision();
                checkBrickCollision();
            }
    
            // Check for game over
            if (ball.y + BALL_RADIUS > canvas.height) {
                resetGame();
                return;
            }
    
            // Draw everything
            drawBricks();
            paddle.draw();
            ball.draw();
    
            requestAnimationFrame(gameLoop);
        }
    
        function startGame() {
            if (!running) {
                resetGame();
                running = true;
                requestAnimationFrame(gameLoop);
            }
        }
    
        // Event Listeners
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (!ball.launched) {
                    ball.launch();
                } else if (!running) {
                    startGame();
                }
            }
            if (e.key === 'ArrowLeft') paddle.moving = -1;
            if (e.key === 'ArrowRight') paddle.moving = 1;
            if (e.key === ' ' && !ball.launched) ball.launch();
        });
    
        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' && paddle.moving === -1) paddle.moving = 0;
            if (e.key === 'ArrowRight' && paddle.moving === 1) paddle.moving = 0;
        });
    
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, mouseX - paddle.width / 2));
        });
    
        canvas.addEventListener('click', () => {
            if (!ball.launched) {
                ball.launch();
            } else if (!running) {
                startGame();
            }
        });
    
        resetGame();
    }

    document.addEventListener('submit', (e) => {
        if (e.target.id === 'contact-form') {
            e.preventDefault();
            const formData = new FormData(e.target);
            console.log('Form submitted:', Object.fromEntries(formData));
            alert('Thank you for your message! I will get back to you soon.');
            e.target.reset();
        }
    });

    // Clock functionality
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        clock.textContent = timeString;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Calendar functionality
    const calendarMonthYear = document.getElementById('calendar-month-year');
    const calendarBody = document.getElementById('calendar-body');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    let currentDate = new Date();

    function generateCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        calendarMonthYear.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;

        let date = 1;
        let calendarHTML = '';

        for (let i = 0; i < 6; i++) {
            let row = '<tr>';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < startingDay) {
                    row += '<td></td>';
                } else if (date > daysInMonth) {
                    break;
                } else {
                    row += `<td>${date}</td>`;
                    date++;
                }
            }
            row += '</tr>';
            calendarHTML += row;
            if (date > daysInMonth) {
                break;
            }
        }

        calendarBody.innerHTML = calendarHTML;
    }

    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    });

    clock.addEventListener('click', () => {
        calendarWidget.classList.toggle('hidden');
    });

    // Start menu functionality
    startMenuButton.addEventListener('click', () => {
        startMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && e.target !== startMenuButton) {
            startMenu.classList.add('hidden');
        }
    });

    function initializeReadme(windowElement) {

    }

//search
// Add event listener for the search button
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        displaySearchResults(query);
    }
});

// Add event listener for the Enter key in the search input
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            displaySearchResults(query);
        }
    }
});

// Add event listener for input changes to filter icons
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('.icon').forEach(icon => {
        const iconText = icon.querySelector('span').textContent.toLowerCase();
        if (iconText.includes(searchTerm)) {
            icon.style.display = 'flex';
        } else {
            icon.style.display = 'none';
        }
    });
});

    function fetchSearchResults(query, callback) {
        const apiKey = 'AIzaSyDrNs69_Oa3lRmMra0NXBn33awcoVzOad4'; // Replace with your Google CSE API key
        const cx = 'a2b560a0ebdb84fe4'; // Replace with your Google CSE ID
    
        fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`)
            .then(response => {
                console.log('Response:', response); // Log the full response object
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                callback(null, data);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                callback(error, null);
            });
    }

    function displaySearchResults(query) {
        const windowId = `search-results-${Date.now()}`;
        const windowTitle = `Search Results for "${query}"`;
        const windowContent = `
            <h2>Search Results for "${query}"</h2>
            <div id="search-results-feed">
                <p>Loading search results...</p>
            </div>
        `;
    
        createWindow(windowId, windowTitle, windowContent);
    
        const searchResultsFeed = windows[windowId].querySelector('#search-results-feed');
    
        fetchSearchResults(query, (error, data) => {
            if (error) {
                searchResultsFeed.textContent = 'Error fetching search results.';
                return;
            }
    
            if (data.items) {
                searchResultsFeed.innerHTML = data.items.map(item => `
                    <div class="news-item">
                        <h3>${item.title}</h3>
                        <p>${item.snippet}</p>
                        <a href="${item.link}" target="_blank">Read more</a>
                    </div>
                `).join('');
            } else {
                searchResultsFeed.textContent = 'No search results found.';
            }
        });
    }

    // Ensure settings are applied globally
    function applyGlobalSettings() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const savedFontSize = localStorage.getItem('fontSize') || '16';

        document.body.className = savedTheme;
        document.body.style.fontSize = `${savedFontSize}px`;
    }

    applyGlobalSettings(); // Apply global settings on load
});

