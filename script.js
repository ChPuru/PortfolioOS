document.addEventListener('DOMContentLoaded', () => {
    feather.replace();

    const desktop = document.getElementById('desktop');
    const windowsContainer = document.getElementById('windows');
    const taskbar = document.getElementById('taskbar', 'taskbar-icons');
    const windowTemplate = document.getElementById('window-template');
    const startMenuButton = document.getElementById('start-menu-button');
    const startMenu = document.getElementById('start-menu');
    const clock = document.getElementById('clock');
    const calendarWidget = document.getElementById('calendar-widget');
    const searchInput = document.querySelector('#search-bar input');

    const windows = {};
    let zIndex = 1;

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
            windows[id].style.display = 'none';
        }
    }

    function maximizeWindow(id) {
        if (windows[id]) {
            const win = windows[id];
            if (win.style.width === '100vw') {
                win.style.width = '';
                win.style.height = '';
                win.style.left = '';
                win.style.top = '';
            } else {
                win.style.width = '100vw';
                win.style.height = 'calc(100vh - 40px)';
                win.style.left = '0';
                win.style.top = '0';
            }
        }
    }

    function createTaskbarItem(id, title) {
        const item = document.createElement('button');
        item.classList.add('taskbar-item');
        item.textContent = title;
        item.dataset.id = id;
        item.addEventListener('click', () => {
            if (windows[id].style.display === 'none') {
                windows[id].style.display = 'block';
            }
            focusWindow(id);
        });
        taskbar.appendChild(item);
    }

    function focusWindow(id) {
        if (windows[id]) {
            windows[id].style.zIndex = ++zIndex;
        }
    }

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.querySelector('.window-header').onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            focusWindow(element.dataset.id);
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
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

    // Window contents
    const projectsContent = `
        <h2>My Projects</h2>
        <div class="project">
            <h3>Interactive Portfolio OS</h3>
            <p>A unique portfolio website mimicking an operating system interface.</p>
        </div>
        <div class="project">
            <h3>AI-Powered Chat Application</h3>
            <p>A real-time chat application with AI-generated responses.</p>
        </div>
        <div class="project">
            <h3>E-commerce Platform</h3>
            <p>A full-featured e-commerce platform with inventory management.</p>
        </div>
    `;

    const aboutContent = `
        <h2>About Me</h2>
        <p>Hello! I'm a passionate full-stack developer with a love for creating interactive and innovative web applications. With expertise in various frontend and backend technologies, I strive to build seamless user experiences that push the boundaries of web development.</p>
        <h3>Skills</h3>
        <ul>
            <li>Frontend: HTML, CSS, JavaScript, React, Vue.js</li>
            <li>Backend: Node.js, Python, Ruby on Rails</li>
            <li>Databases: PostgreSQL, MongoDB, Redis</li>
            <li>DevOps: Docker, Kubernetes, AWS</li>
        </ul>
    `;

    const blogContent = `
        <h2>Latest Blog Posts</h2>
        <div class="blog-post">
            <h3>Building an OS-like Portfolio with Vanilla JS</h3>
            <p>Learn how I created this unique portfolio website using only HTML, CSS, and JavaScript...</p>
        </div>
        <div class="blog-post">
            <h3>The Future of Web Development</h3>
            <p>Exploring upcoming trends and technologies in the world of web development...</p>
        </div>
        <div class="blog-post">
            <h3>Optimizing Website Performance</h3>
            <p>Tips and tricks for improving the speed and efficiency of your web applications...</p>
        </div>
    `;

    const contactContent = `
        <h2>Contact Me</h2>
        <form id="contact-form">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div>
                <label for="message">Message:</label>
                <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit">Send Message</button>
        </form>
    `;

    const terminalContent = `
    <div id="terminal-output"></div>
    <div id="terminal-input">
        <span class="prompt">$</span>
        <input type="text" id="terminal-command" autofocus>
    </div>
`;

const settingsContent = `
    <h2>Settings</h2>
    <div class="setting">
        <label for="theme">Theme:</label>
        <select id="theme">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
        </select>
    </div>
    <div class="setting">
        <label for="font-size">Font Size:</label>
        <input type="range" id="font-size" min="12" max="24" value="16">
    </div>
    <button id="save-settings">Save Settings</button>
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
    <textarea id="text-editor-content" placeholder="Start typing..."></textarea>
</div>
`;

const musicPlayerContent = `
<div class="music-player">
    <audio id="audio-player" controls>
        <source src="https://example.com/sample-music.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
    <div id="playlist">
        <h3>Playlist</h3>
        <ul>
            <li data-src="https://example.com/sample-music.mp3">Sample Song 1</li>
            <li data-src="https://example.com/sample-music2.mp3">Sample Song 2</li>
            <li data-src="https://example.com/sample-music3.mp3">Sample Song 3</li>
        </ul>
    </div>
</div>
`;

const fileExplorerContent = `
<div class="file-explorer">
    <div class="file-explorer-header">
        <button id="back-button">Back</button>
        <span id="current-path">/</span>
    </div>
    <div class="file-explorer-grid" id="file-explorer-content"></div>
</div>
`;

const imageViewerContent = `
<div class="image-viewer">
    <img id="image-display" src="/placeholder.svg?height=300&width=300" alt="No image selected">
</div>
`;

const videoPlayerContent = `
<div class="video-player">
    <video id="video-player" controls>
        <source src="https://example.com/sample-video.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>
`;

    // Create windows - Removed initial window creation calls

    // Event listeners for desktop icons
    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const windowId = icon.dataset.window;
            if (windowId === 'github') {
                window.open('https://github.com/yourusername', '_blank');
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
            case 'settings':
                return settingsContent;
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
            case 'file-explorer':
                return fileExplorerContent;
            case 'image-viewer':
                return imageViewerContent;
            case 'video-player':
                return videoPlayerContent;
            default:
                return '<p>Content not found.</p>';
        }
    }

    // Handle contact form submission
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
    
        // Search functionality
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
    
        // Terminal functionality
        function initializeTerminal() {
            const terminalOutput = document.getElementById('terminal-output');
            const terminalInput = document.getElementById('terminal-command');
    
            terminalInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const command = terminalInput.value;
                    terminalOutput.innerHTML += `<div>$ ${command}</div>`;
                    executeCommand(command);
                    terminalInput.value = '';
                }
            });
    
            function executeCommand(command) {
                let output = '';
                switch (command.toLowerCase()) {
                    case 'help':
                        output = 'Available commands: help, echo, date, clear';
                        break;
                    case 'echo':
                        output = 'Usage: echo [message]';
                        break;
                    case 'date':
                        output = new Date().toString();
                        break;
                    case 'clear':
                        terminalOutput.innerHTML = '';
                        return;
                    default:
                        if (command.toLowerCase().startsWith('echo ')) {
                            output = command.slice(5);
                        } else {
                            output = `Command not found: ${command}`;
                        }
                }
                terminalOutput.innerHTML += `<div>${output}</div>`;
            }
        }
    
        // Settings functionality
        function initializeSettings() {
            const themeSelect = document.getElementById('theme');
            const fontSizeInput = document.getElementById('font-size');
            const saveSettingsBtn = document.getElementById('save-settings');
    
            saveSettingsBtn.addEventListener('click', () => {
                const theme = themeSelect.value;
                const fontSize = fontSizeInput.value;
                
                document.body.className = theme;
                document.body.style.fontSize = `${fontSize}px`;
    
                alert('Settings saved!');
            });
        }
        // Weather functionality
        function initializeWeather() {
            const weatherInfo = document.getElementById('weather-info');
            // Simulating weather data fetch
            setTimeout(() => {
                weatherInfo.innerHTML = `
                    <h3>New York, NY</h3>
                    <p>Temperature: 72°F</p>
                    <p>Condition: Partly Cloudy</p>
                `;
            }, 1000);
        }
    
        // News functionality
        function initializeNews() {
            const newsFeed = document.getElementById('news-feed');
            // Simulating news data fetch
            setTimeout(() => {
                newsFeed.innerHTML = `
                    <div class="news-item">
                        <h3>Breaking News: Web Developer Creates Amazing OS-like Portfolio</h3>
                        <p>A talented web developer has created an impressive portfolio that mimics an operating system...</p>
                    </div>
                    <div class="news-item">
                        <h3>Tech Giants Announce New Collaboration</h3>
                        <p>Major tech companies have announced a groundbreaking collaboration on an open-source project...</p>
                    </div>
                `;
            }, 1000);
        }
    
        // Calculator functionality
        function initializeCalculator() {
            const output = document.getElementById('calculator-output');
            let currentValue = '0';
            let previousValue = null;
            let operation = null;
    
            document.querySelectorAll('.calculator-button').forEach(button => {
                button.addEventListener('click', () => {
                    const action = button.dataset.action;
                    const buttonValue = button.textContent;
    
                    switch (action) {
                        case 'number':
                            if (currentValue === '0') {
                                currentValue = buttonValue;
                            } else {
                                currentValue += buttonValue;
                            }
                            break;
                        case 'decimal':
                            if (!currentValue.includes('.')) {
                                currentValue += '.';
                            }
                            break;
                        case 'operator':
                            previousValue = currentValue;
                            currentValue = '0';
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
                            currentValue = currentValue.slice(0, -1) || '0';
                            break;
                    }
                    output.textContent = currentValue;
                });
            });
    
            function calculate(a, b, op) {
                a = parseFloat(a);
                b = parseFloat(b);
                switch (op) {
                    case '+': return (a + b).toString();
                    case '-': return (a - b).toString();
                    case '×': return (a * b).toString();
                    case '÷': return (a / b).toString();
                    default: return b.toString();
                }
            }
        }
    
        // Text Editor functionality
        function initializeTextEditor() {
            const textArea = document.getElementById('text-editor-content');
            textArea.value = localStorage.getItem('textEditorContent') || '';
            textArea.addEventListener('input', () => {
                localStorage.setItem('textEditorContent', textArea.value);
            });
        }
    
        // Music Player functionality
        function initializeMusicPlayer() {
            const audioPlayer = document.getElementById('audio-player');
            const playlist = document.getElementById('playlist');
    
            playlist.addEventListener('click', (e) => {
                if (e.target.tagName === 'LI') {
                    audioPlayer.src = e.target.dataset.src;
                    audioPlayer.play();
                }
            });
        }
    
        // File Explorer functionality
        function initializeFileExplorer() {
            const fileExplorerContent = document.getElementById('file-explorer-content');
            const backButton = document.getElementById('back-button');
            const currentPath = document.getElementById('current-path');
            let currentDirectory = '/';
    
            const fileSystem = {
                '/': [
                    { name: 'Documents', type: 'folder' },
                    { name: 'Pictures', type: 'folder' },
                    { name: 'Music', type: 'folder' },
                    { name: 'readme.txt', type: 'file' }
                ],
                '/Documents': [
                    { name: 'project1.doc', type: 'file' },
                    { name: 'project2.doc', type: 'file' }
                ],
                '/Pictures': [
                    { name: 'vacation.jpg', type: 'file' },
                    { name: 'family.jpg', type: 'file' }
                ],
                '/Music': [
                    { name: 'song1.mp3', type: 'file' },
                    { name: 'song2.mp3', type: 'file' }
                ]
            };
    
            function renderDirectory(path) {
                currentDirectory = path;
                currentPath.textContent = path;
                fileExplorerContent.innerHTML = '';
    
                fileSystem[path].forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('file-explorer-item');
                    itemElement.innerHTML = `
                        <i data-feather="${item.type === 'folder' ? 'folder' : 'file'}"></i>
                        <span>${item.name}</span>
                    `;
                    itemElement.addEventListener('click', () => {
                        if (item.type === 'folder') {
                            renderDirectory(`${path}${item.name}/`);
                        } else {
                            alert(`Opening file: ${item.name}`);
                        }
                    });
                    fileExplorerContent.appendChild(itemElement);
                });
    
                feather.replace();
            }
    
            backButton.addEventListener('click', () => {
                if (currentDirectory !== '/') {
                    const parentDirectory = currentDirectory.split('/').slice(0, -2).join('/') + '/';
                    renderDirectory(parentDirectory);
                }
            });
    
            renderDirectory('/');
        }
    
        // Image Viewer functionality
        function initializeImageViewer() {
            const imageDisplay = document.getElementById('image-display');
            // Simulating image selection
            setTimeout(() => {
                imageDisplay.src = 'https://example.com/sample-image.jpg';
            }, 1000);
        }
    
        // Video Player functionality
        function initializeVideoPlayer() {
            const videoPlayer = document.getElementById('video-player');
            // Video player is already set up in the HTML, no additional JavaScript needed
        }

        // Initialize terminal and settings when their windows are created
        document.addEventListener('DOMNodeInserted', (e) => {
            if (e.target.id === 'terminal-output') {
                initializeTerminal();
            } else if (e.target.querySelector('#save-settings')) {
                initializeSettings();
            }
        });
        document.addEventListener('DOMNodeInserted', (e) => {
            if (e.target.classList && e.target.classList.contains('window')) {
                const windowId = e.target.dataset.id;
                switch (windowId) {
                    case 'settings':
                        initializeSettings();
                        break;
                    case 'weather':
                        initializeWeather();
                        break;
                    case 'news':
                        initializeNews();
                        break;
                    case 'calculator':
                        initializeCalculator();
                        break;
                    case 'text-editor':
                        initializeTextEditor();
                        break;
                    case 'music-player':
                        initializeMusicPlayer();
                        break;
                    case 'file-explorer':
                        initializeFileExplorer();
                        break;
                    case 'image-viewer':
                        initializeImageViewer();
                        break;
                    case 'video-player':
                        initializeVideoPlayer();
                        break;
                }
            }
        });
});

