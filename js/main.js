/**
 * Main JavaScript for GitPilot Landing Page
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Navbar Scroll Effect
    initNavbar();
    
    // 2. Initialize Scroll Reveal Animations
    initScrollReveal();
    
    // 3. Initialize Terminal Typing Effect
    initTerminalTyping();
    
    // 4. Initialize Mouse Glow Tracking for Feature Cards
    initGlowEffect();
});

/**
 * Navbar style changes on scroll
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle (simple version)
    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', () => {
        // Create simple alert for demo purposes; in a real app, toggle a mobile menu class
        alert('Mobile menu clicked. In a full implementation, this would open a sidebar.');
    });
}

/**
 * Handle elements appearing as they scroll into view
 */
function initScrollReveal() {
    // Select elements that should animate in immediately (Hero section)
    const initialElements = document.querySelectorAll('.fade-in-up, .fade-in');
    
    // Slight delay to ensure CSS is fully painted
    setTimeout(() => {
        initialElements.forEach(el => {
            el.classList.add('active');
        });
    }, 100);

    // Setup Intersection Observer for scrolling reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
}

/**
 * Simulated Terminal Typing Effect
 */
function initTerminalTyping() {
    const terminalElement = document.getElementById('terminal-typing');
    if (!terminalElement) return;

    // Define the sequence of commands and outputs to simulate GitPilot backend action
    const commands = [
        { text: '> git checkout -b feature/auth', type: 'command', delay: 1000 },
        { text: 'Switched to a new branch \'feature/auth\'', type: 'output', delay: 500 },
        { text: '> git push origin feature/auth', type: 'command', delay: 1500 },
        { text: 'Total 0 (delta 0), reused 0 (delta 0)\nTo https://github.com/repo/gitpilot.git\n * [new branch]      feature/auth -> feature/auth', type: 'output', delay: 800 },
        { text: '> Executing Workflow: Auth Flow...', type: 'status', delay: 2000 },
        { text: '✓ Parallel fetch starting...', type: 'success', delay: 500 },
        { text: '✓ Branch feature/auth checked out', type: 'success', delay: 500 },
        { text: 'Waiting for merge dependencies...', type: 'warning', delay: 500 }
    ];

    let currentCommandIndex = 0;
    let isTyping = false;

    // Build cursor element
    const cursorHTML = '<span class="terminal-cursor"></span>';
    terminalElement.innerHTML = cursorHTML;

    function typeLine() {
        if (currentCommandIndex >= commands.length) {
            // Loop back to start after a delay
            setTimeout(() => {
                terminalElement.innerHTML = cursorHTML;
                currentCommandIndex = 0;
                typeLine();
            }, 5000);
            return;
        }

        const currentCommand = commands[currentCommandIndex];
        
        // Remove cursor temporarily to append text
        let content = terminalElement.innerHTML.replace(cursorHTML, '');
        
        // Wrap output in appropriate coloring spans if needed, though default is green based on CSS
        let prefix = '';
        let suffix = '';
        
        if (currentCommand.type === 'command') {
            prefix = '<span style="color: #f8f9fa;">'; // White text for commands
            suffix = '</span>';
        } else if (currentCommand.type === 'warning') {
            prefix = '<span style="color: #f59e0b;">'; // Amber
            suffix = '</span>';
        } else if (currentCommand.type === 'status') {
            prefix = '<span style="color: #8b5cf6;">'; // Purple
            suffix = '</span>';
        }
        
        const lineHTML = `<div style="margin-bottom: 4px; opacity: 0; transform: translateY(5px); transition: all 0.3s ease;">${prefix}${currentCommand.text.replace(/\n/g, '<br>')}${suffix}</div>`;
        
        terminalElement.innerHTML = content + lineHTML + cursorHTML;
        
        // Trigger reflow & animation
        const addedNode = terminalElement.children[terminalElement.children.length - 2];
        setTimeout(() => {
            addedNode.style.opacity = '1';
            addedNode.style.transform = 'translateY(0)';
            
            // Auto-scroll to bottom
            terminalElement.scrollTop = terminalElement.scrollHeight;
        }, 50);

        currentCommandIndex++;
        
        // Queue next line
        setTimeout(typeLine, currentCommand.delay);
    }

    // Start typing
    setTimeout(typeLine, 1000);
}

/**
 * Handle Mouse Movement for Glow Effect on Feature Cards
 */
function initGlowEffect() {
    const cards = document.querySelectorAll('.hover-glow-effect');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calculate coordinates relative to the card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Update CSS variables for the background radial gradient position
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        
        // Reset properties nicely when leaving (optional, but handled well by radial gradient cutting off)
        card.addEventListener('mouseleave', () => {
            // The gradient opacity is handled by CSS hover state, so we don't strictly need to reset coordinates.
        });
    });
}

/**
 * Initialize Showcase Animations
 */
document.addEventListener('DOMContentLoaded', () => {
    initShowcaseLogs();
    initShowcaseExecution();
});

function initShowcaseExecution() {
    // Simple intersection observer to restart the pipeline animation
    const pipeline = document.querySelector('.exec-pipeline');
    if (!pipeline) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reset states for demo
                const stages = pipeline.querySelectorAll('.exec-stage');
                stages.forEach((s, ix) => {
                    s.className = 'exec-stage';
                    if (ix === 0) s.classList.add('stage-done');
                    else if (ix === 1) s.classList.add('stage-running', 'pulse-glow');
                    else s.classList.add('stage-pending');
                });
                
                // Simulate progress after a few seconds
                setTimeout(() => {
                    stages[1].className = 'exec-stage stage-done';
                    stages[2].className = 'exec-stage stage-running pulse-glow';
                }, 3000);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(pipeline);
}

function initShowcaseLogs() {
    const logContainer = document.getElementById('showcase-terminal-logs');
    if (!logContainer) return;

    const logs = [
        { time: '14:02:44', text: '> Starting pipeline execution [id: 8f92a]', type: 'info' },
        { time: '14:02:45', text: 'git fetch origin --prune', type: 'cmd' },
        { time: '14:02:47', text: '✓ Fetch completed successfully', type: 'success' },
        { time: '14:02:47', text: 'git checkout -b feature/new-ui', type: 'cmd' },
        { time: '14:02:48', text: 'Switched to a new branch \'feature/new-ui\'', type: 'info' },
        { time: '14:02:48', text: 'git merge origin/main --no-ff', type: 'cmd' },
        { time: '14:02:50', text: 'Warning: conflict in src/components/Button.js', type: 'err' },
        { time: '14:02:50', text: 'Auto-merging src/components/Button.js', type: 'info' },
        { time: '14:02:51', text: 'CONFLICT (content): Merge conflict in src/components/Button.js', type: 'err' },
        { time: '14:02:51', text: '✖ Pipeline stopped due to merge conflict.', type: 'err' }
    ];

    let currentLog = 0;
    
    // Intersection observer to start logging only when looking at it
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && currentLog === 0) {
                addNextLog();
            }
        });
    }, { threshold: 0.5 });
    
    function addNextLog() {
        if (currentLog >= logs.length) return; // End of logs
        
        const log = logs[currentLog];
        const line = document.createElement('div');
        line.className = `log-line`;
        
        const timeSpan = `<span class="log-time">[${log.time}]</span>`;
        let contentSpan = '';
        
        switch(log.type) {
            case 'cmd': contentSpan = `<span class="log-cmd">${log.text}</span>`; break;
            case 'info': contentSpan = `<span class="log-info">${log.text}</span>`; break;
            case 'success': contentSpan = `<span class="log-success">${log.text}</span>`; break;
            case 'err': contentSpan = `<span class="log-err">${log.text}</span>`; break;
        }
        
        line.innerHTML = timeSpan + contentSpan;
        logContainer.appendChild(line);
        logContainer.scrollTop = logContainer.scrollHeight;
        
        currentLog++;
        
        // Random delay between 400ms and 1500ms for typing effect realism
        const delay = Math.random() * 1100 + 400;
        setTimeout(addNextLog, delay);
    }

    observer.observe(logContainer);
}

document.addEventListener('DOMContentLoaded', () => {
    initShowcasePreview();
});

function initShowcasePreview() {
    const previewContainer = document.getElementById('showcase-preview-actions');
    if (!previewContainer) return;

    const cmds = previewContainer.querySelectorAll('.p-cmd');
    const btnRow = previewContainer.querySelector('.p-btn-row');
    
    // Hide initially
    cmds.forEach(cmd => {
        cmd.style.opacity = '0';
        cmd.style.transform = 'translateY(10px)';
        cmd.style.transition = 'all 0.4s ease-out';
    });
    if(btnRow) {
        btnRow.style.opacity = '0';
        btnRow.style.transition = 'opacity 0.5s ease-in';
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate them in sequence
                cmds.forEach((cmd, idx) => {
                    setTimeout(() => {
                        cmd.style.opacity = '1';
                        cmd.style.transform = 'translateY(0)';
                    }, 400 * (idx + 1));
                });
                
                // Show button last
                if(btnRow) {
                    setTimeout(() => {
                        btnRow.style.opacity = '1';
                    }, 400 * (cmds.length + 1) + 200);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(previewContainer);
}
