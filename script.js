class SlotMachine {
    constructor() {
        // Game state
        this.balance = parseInt(localStorage.getItem('slotBalance')) || 1000;
        this.currentBet = 1;
        this.isSpinning = false;
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.activeLines = 10;
        
        // Symbols with their weights (higher weight = more frequent)
        this.symbols = [
            { symbol: '🍒', weight: 5 },   // Cherry - most common
            { symbol: '🍊', weight: 4 },   // Orange
            { symbol: '🍋', weight: 4 },   // Lemon
            { symbol: '🍇', weight: 3 },   // Grapes
            { symbol: '⭐', weight: 3 },   // Star
            { symbol: '🔔', weight: 2 },   // Bell
            { symbol: '💎', weight: 1 },   // Diamond - rare
            { symbol: '🍀', weight: 1 }    // Clover - rare
        ];
        
        // Paylines definition (row indices for each reel)
        this.paylines = [
            [1, 1, 1, 1, 1], // Middle row
            [0, 0, 0, 0, 0], // Top row
            [2, 2, 2, 2, 2], // Bottom row
            [0, 1, 2, 1, 0], // V shape
            [2, 1, 0, 1, 2], // ^ shape
            [1, 0, 0, 0, 1], // W shape
            [1, 2, 2, 2, 1], // M shape
            [0, 0, 1, 2, 2], // Diagonal
            [2, 2, 1, 0, 0], // Reverse diagonal
            [1, 2, 1, 0, 1]  // Zigzag
        ];
        
        // Payout table (symbol: {3: multiplier, 4: multiplier, 5: multiplier})
        this.payouts = {
            '🍒': { 3: 20, 4: 100, 5: 1000 },
            '💎': { 3: 10, 4: 50, 5: 500 },
            '🔔': { 3: 5, 4: 25, 5: 200 },
            '🍀': { 3: 8, 4: 40, 5: 300 },
            '⭐': { 3: 3, 4: 15, 5: 100 },
            '🍇': { 3: 2, 4: 10, 5: 50 },
            '🍋': { 3: 2, 4: 8, 5: 40 },
            '🍊': { 3: 2, 4: 8, 5: 40 }
        };
        
        // DOM elements
        this.elements = {};
        this.initializeElements();
        this.initializeReels();
        this.bindEvents();
        this.updateDisplay();
        this.loadTheme();
    }
    
    initializeElements() {
        this.elements = {
            balance: document.getElementById('balance'),
            currentBet: document.getElementById('currentBet'),
            betAmount: document.getElementById('betAmount'),
            spinCost: document.getElementById('spinCost'),
            winAmount: document.getElementById('winAmount'),
            activeLinesCount: document.getElementById('activeLinesCount'),
            spinBtn: document.getElementById('spinBtn'),
            betPlus: document.getElementById('betPlus'),
            betMinus: document.getElementById('betMinus'),
            maxBetBtn: document.getElementById('maxBetBtn'),
            themeToggle: document.getElementById('themeToggle'),
            soundToggle: document.getElementById('soundToggle'),
            paytableToggle: document.getElementById('paytableToggle'),
            paytable: document.getElementById('paytable'),
            spinSound: document.getElementById('spinSound'),
            winSound: document.getElementById('winSound')
        };
    }
    
    initializeReels() {
        this.reels = [];
        for (let i = 1; i <= 5; i++) {
            const reel = document.getElementById(`reel${i}`);
            const symbolsContainer = reel.querySelector('.symbols');
            
            // Create initial symbols for each reel
            const reelSymbols = [];
            for (let j = 0; j < 20; j++) { // 20 symbols per reel for smooth scrolling
                const symbolEl = document.createElement('div');
                symbolEl.className = 'symbol';
                symbolEl.textContent = this.getRandomSymbol();
                symbolsContainer.appendChild(symbolEl);
                reelSymbols.push(symbolEl.textContent);
            }
            
            this.reels.push({
                element: reel,
                container: symbolsContainer,
                symbols: reelSymbols,
                finalSymbols: ['🍒', '🍊', '🍋'] // Default visible symbols
            });
        }
    }
    
    getRandomSymbol() {
        const totalWeight = this.symbols.reduce((sum, s) => sum + s.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const symbolData of this.symbols) {
            random -= symbolData.weight;
            if (random <= 0) {
                return symbolData.symbol;
            }
        }
        return this.symbols[0].symbol;
    }
    
    bindEvents() {
        this.elements.spinBtn.addEventListener('click', () => this.spin());
        this.elements.betPlus.addEventListener('click', () => this.adjustBet(1));
        this.elements.betMinus.addEventListener('click', () => this.adjustBet(-1));
        this.elements.maxBetBtn.addEventListener('click', () => this.setMaxBet());
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.elements.soundToggle.addEventListener('click', () => this.toggleSound());
        this.elements.paytableToggle.addEventListener('click', () => this.togglePaytable());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSpinning) {
                e.preventDefault();
                this.spin();
            }
        });
    }
    
    adjustBet(change) {
        const newBet = this.currentBet + change;
        if (newBet >= 1 && newBet <= 10) {
            this.currentBet = newBet;
            this.updateDisplay();
        }
    }
    
    setMaxBet() {
        this.currentBet = 10;
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.elements.balance.textContent = this.balance;
        this.elements.currentBet.textContent = this.currentBet;
        this.elements.betAmount.textContent = this.currentBet;
        this.elements.spinCost.textContent = this.currentBet * this.activeLines;
        this.elements.activeLinesCount.textContent = this.activeLines;
        
        // Enable/disable buttons based on balance
        const spinCost = this.currentBet * this.activeLines;
        this.elements.spinBtn.disabled = this.balance < spinCost || this.isSpinning;
        this.elements.betPlus.disabled = this.currentBet >= 10 || this.isSpinning;
        this.elements.betMinus.disabled = this.currentBet <= 1 || this.isSpinning;
        this.elements.maxBetBtn.disabled = this.currentBet >= 10 || this.isSpinning;
        
        // Update sound icon
        this.elements.soundToggle.textContent = this.soundEnabled ? '🔊' : '🔇';
        
        // Save balance to localStorage
        localStorage.setItem('slotBalance', this.balance.toString());
    }
    
    async spin() {
        if (this.isSpinning) return;
        
        const spinCost = this.currentBet * this.activeLines;
        if (this.balance < spinCost) {
            this.showMessage('Insufficient balance!');
            return;
        }
        
        this.isSpinning = true;
        this.balance -= spinCost;
        this.elements.winAmount.textContent = '0';
        this.updateDisplay();
        
        // Play spin sound
        if (this.soundEnabled) {
            this.elements.spinSound.currentTime = 0;
            this.elements.spinSound.play().catch(() => {});
        }
        
        // Add spinning animation
        this.elements.spinBtn.classList.add('spinning');
        this.reels.forEach(reel => reel.element.classList.add('spinning'));
        
        // Generate final results
        const results = this.generateSpinResults();
        
        // Animate reels stopping one by one
        await this.animateReels(results);
        
        // Check for wins
        const winData = this.checkWins(results);
        
        // Display results
        await this.displayResults(winData);
        
        this.isSpinning = false;
        this.elements.spinBtn.classList.remove('spinning');
        this.updateDisplay();
    }
    
    generateSpinResults() {
        const results = [];
        for (let reel = 0; reel < 5; reel++) {
            const reelResult = [];
            for (let row = 0; row < 3; row++) {
                reelResult.push(this.getRandomSymbol());
            }
            results.push(reelResult);
        }
        return results;
    }
    
    async animateReels(results) {
        const delays = [0, 200, 400, 600, 800]; // Staggered stopping
        
        const promises = this.reels.map((reel, index) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    this.stopReel(reel, results[index]);
                    resolve();
                }, delays[index]);
            });
        });
        
        await Promise.all(promises);
        await new Promise(resolve => setTimeout(resolve, 300)); // Final pause
    }
    
    stopReel(reel, finalSymbols) {
        reel.element.classList.remove('spinning');
        reel.finalSymbols = finalSymbols;
        
        // Update visible symbols
        const symbols = reel.container.querySelectorAll('.symbol');
        symbols.forEach((symbol, index) => {
            if (index < 3) {
                symbol.textContent = finalSymbols[index];
            }
        });
    }
    
    checkWins(results) {
        const wins = [];
        let totalWin = 0;
        
        // Check each payline
        for (let lineIndex = 0; lineIndex < this.activeLines; lineIndex++) {
            const line = this.paylines[lineIndex];
            const lineSymbols = line.map((row, reel) => results[reel][row]);
            
            const win = this.checkLineWin(lineSymbols, lineIndex);
            if (win) {
                wins.push(win);
                totalWin += win.amount;
            }
        }
        
        return { wins, totalWin };
    }
    
    checkLineWin(lineSymbols, lineIndex) {
        const firstSymbol = lineSymbols[0];
        let matchCount = 1;
        
        // Count consecutive matching symbols from left
        for (let i = 1; i < lineSymbols.length; i++) {
            if (lineSymbols[i] === firstSymbol) {
                matchCount++;
            } else {
                break;
            }
        }
        
        // Check if we have a winning combination
        if (matchCount >= 3 && this.payouts[firstSymbol]) {
            const multiplier = this.payouts[firstSymbol][matchCount] || 0;
            const amount = this.currentBet * multiplier;
            
            return {
                symbol: firstSymbol,
                count: matchCount,
                multiplier,
                amount,
                line: lineIndex,
                positions: lineSymbols.slice(0, matchCount).map((_, i) => ({ reel: i, row: this.paylines[lineIndex][i] }))
            };
        }
        
        return null;
    }
    
    async displayResults(winData) {
        if (winData.totalWin > 0) {
            this.balance += winData.totalWin;
            
            // Animate win amount
            await this.animateWinAmount(winData.totalWin);
            
            // Highlight winning symbols
            this.highlightWinningSymbols(winData.wins);
            
            // Play win sound
            if (this.soundEnabled) {
                this.elements.winSound.currentTime = 0;
                this.elements.winSound.play().catch(() => {});
            }
            
            // Show celebration for big wins
            if (winData.totalWin >= this.currentBet * 50) {
                this.showCelebration();
            }
        }
    }
    
    async animateWinAmount(amount) {
        const duration = 1000;
        const steps = 20;
        const increment = amount / steps;
        
        for (let i = 0; i <= steps; i++) {
            const currentAmount = Math.round(increment * i);
            this.elements.winAmount.textContent = currentAmount;
            await new Promise(resolve => setTimeout(resolve, duration / steps));
        }
    }
    
    highlightWinningSymbols(wins) {
        // Clear previous highlights
        document.querySelectorAll('.symbol.winning').forEach(el => {
            el.classList.remove('winning');
        });
        
        // Add highlights for winning symbols
        wins.forEach(win => {
            win.positions.forEach(pos => {
                const reel = this.reels[pos.reel];
                const symbols = reel.container.querySelectorAll('.symbol');
                if (symbols[pos.row]) {
                    symbols[pos.row].classList.add('winning');
                }
            });
        });
        
        // Remove highlights after animation
        setTimeout(() => {
            document.querySelectorAll('.symbol.winning').forEach(el => {
                el.classList.remove('winning');
            });
        }, 2000);
    }
    
    showCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'win-celebration';
        document.body.appendChild(celebration);
        
        // Create confetti
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.backgroundColor = ['#ffd700', '#ff6b6b', '#51cf66'][Math.floor(Math.random() * 3)];
            celebration.appendChild(confetti);
        }
        
        // Remove celebration after animation
        setTimeout(() => {
            celebration.remove();
        }, 3000);
    }
    
    showMessage(message) {
        // Simple alert for now - could be enhanced with custom modal
        alert(message);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.elements.themeToggle.textContent = newTheme === 'light' ? '☀️' : '🌙';
        
        localStorage.setItem('theme', newTheme);
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.elements.themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled.toString());
        this.updateDisplay();
    }
    
    togglePaytable() {
        this.elements.paytable.classList.toggle('show');
    }
}

// Enhanced audio context for better sound support
class AudioManager {
    constructor() {
        this.context = null;
        this.sounds = {};
        this.init();
    }
    
    async init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            await this.loadSounds();
        } catch (error) {
            console.log('Audio not supported:', error);
        }
    }
    
    async loadSounds() {
        // Generate simple sound effects using Web Audio API
        this.sounds.spin = this.createSpinSound();
        this.sounds.win = this.createWinSound();
    }
    
    createSpinSound() {
        // Create a short mechanical spinning sound
        return () => {
            if (!this.context) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.setValueAtTime(200, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 0.3);
        };
    }
    
    createWinSound() {
        // Create a winning chime sound
        return () => {
            if (!this.context) return;
            
            const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.context.createOscillator();
                    const gainNode = this.context.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.context.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);
                    
                    oscillator.start(this.context.currentTime);
                    oscillator.stop(this.context.currentTime + 0.5);
                }, index * 100);
            });
        };
    }
    
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
}

// Auto-save functionality
class GameSaver {
    static save(gameState) {
        const data = {
            balance: gameState.balance,
            currentBet: gameState.currentBet,
            soundEnabled: gameState.soundEnabled,
            timestamp: Date.now()
        };
        localStorage.setItem('slotMachineState', JSON.stringify(data));
    }
    
    static load() {
        try {
            const data = localStorage.getItem('slotMachineState');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading game state:', error);
            return null;
        }
    }
    
    static clear() {
        localStorage.removeItem('slotMachineState');
        localStorage.removeItem('slotBalance');
    }
}

// Performance optimization for mobile
class PerformanceOptimizer {
    static optimizeForMobile() {
        if (window.innerWidth <= 768) {
            // Reduce animation complexity on mobile
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
            
            // Disable non-essential animations
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    .slot-machine::before { display: none; }
                    .payline { animation: none; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    static enableReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Apply performance optimizations
    PerformanceOptimizer.optimizeForMobile();
    PerformanceOptimizer.enableReducedMotion();
    
    // Initialize audio manager
    const audioManager = new AudioManager();
    
    // Initialize the slot machine
    const slotMachine = new SlotMachine();
    
    // Auto-save every 30 seconds
    setInterval(() => {
        GameSaver.save(slotMachine);
    }, 30000);
    
    // Save before page unload
    window.addEventListener('beforeunload', () => {
        GameSaver.save(slotMachine);
    });
    
    // Handle visibility change (mobile app switching)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            GameSaver.save(slotMachine);
        }
    });
    
    console.log('🎰 Vegas Slot Machine loaded successfully!');
    console.log('Press SPACE to spin or use the controls below');
}); 