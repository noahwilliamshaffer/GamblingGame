# 🎰 Vegas Slot Machine

A fully client-side slot machine gambling game that runs entirely in the browser. Features a classic 5-reel, 3-row Vegas-style layout with virtual credits, no real money involved.

## 🎮 Game Features

### Core Gameplay
- **5 Reels, 3 Rows**: Classic Vegas-style slot machine layout
- **10 Paylines**: Multiple winning combinations with various patterns
- **Virtual Credits**: Start with 1,000 credits (no real money)
- **Adjustable Betting**: Bet 1, 5, or 10 credits per spin
- **Animated Reels**: Smooth spinning animations with staggered stopping

### Symbols & Payouts
- 🍒 **Cherry**: Highest payout (1000x for 5 of a kind)
- 💎 **Diamond**: Premium symbol (500x for 5 of a kind)
- 🔔 **Bell**: Classic slot symbol (200x for 5 of a kind)
- 🍀 **Clover**: Lucky symbol (300x for 5 of a kind)
- ⭐ **Star**: Bonus symbol (100x for 5 of a kind)
- 🍇 **Grapes**: Fruit symbol (50x for 5 of a kind)
- 🍋 **Lemon**: Fruit symbol (40x for 5 of a kind)
- 🍊 **Orange**: Fruit symbol (40x for 5 of a kind)

### Game Controls
- **Spin Button**: Start the reels spinning
- **Bet Adjustment**: +/- buttons to change bet amount
- **Max Bet**: Instantly set maximum bet
- **Spacebar**: Quick spin keyboard shortcut
- **Paytable**: View all winning combinations

### Visual & Audio
- **Light/Dark Theme**: Toggle between themes
- **Sound Effects**: Spin and win sounds (can be muted)
- **Win Animations**: Highlighting winning symbols
- **Confetti Celebration**: For big wins (50x bet or more)
- **Responsive Design**: Works on mobile and desktop

### Data Persistence
- **LocalStorage**: Saves balance, settings, and theme
- **Auto-Save**: Automatically saves every 30 seconds
- **Session Recovery**: Resume where you left off

## 🚀 Live Demo

The game is deployed on Vercel and ready to play: [Live Demo](https://gambling-game-noahw.vercel.app)

## 🛠 Technology Stack

- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: No external dependencies
- **Web Audio API**: Sound effects generation
- **LocalStorage API**: Data persistence
- **CSS Variables**: Theme system support

## 🎯 Deployment on Vercel

### Quick Deploy (Recommended)

1. **Fork this repository** to your GitHub account

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "New Project"
   - Import your forked repository

3. **Configure Project**:
   - Project Name: `vegas-slot-machine` (or your choice)
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: Leave empty (static site)
   - Output Directory: Leave empty

4. **Deploy**:
   - Click "Deploy"
   - Your game will be live in seconds!

### Manual Deployment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/GamblingGame.git
   cd GamblingGame
   ```

2. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? `N`
   - Project name: `vegas-slot-machine`
   - Directory: `./`
   - Deploy? `Y`

### Environment Setup

No environment variables or build process required! This is a pure client-side application.

## 📱 Browser Compatibility

- **Chrome**: 70+ ✅
- **Firefox**: 65+ ✅
- **Safari**: 12+ ✅
- **Edge**: 79+ ✅
- **Mobile Safari**: iOS 12+ ✅
- **Chrome Mobile**: Android 70+ ✅

## 🎲 Game Mechanics

### Paylines
The game features 10 active paylines:
1. Straight lines (top, middle, bottom)
2. V-shaped patterns
3. Diagonal lines
4. Zigzag patterns

### Win Calculation
- Wins are calculated left-to-right
- Minimum 3 matching symbols required
- Multiple paylines can win simultaneously
- Payouts multiply your bet amount

### Symbol Weights
Symbols have different appearance frequencies:
- Common: 🍒 (Cherry), 🍊 (Orange), 🍋 (Lemon)
- Uncommon: 🍇 (Grapes), ⭐ (Star)
- Rare: 🔔 (Bell), 💎 (Diamond), 🍀 (Clover)

## 🎨 Customization

### Replacing Symbols
To use different symbols or images:

1. **Update JavaScript** (`script.js`):
   ```javascript
   this.symbols = [
       { symbol: '🎯', weight: 5 },  // Replace with your symbol
       // ... add more symbols
   ];
   ```

2. **Update Payouts** (`script.js`):
   ```javascript
   this.payouts = {
       '🎯': { 3: 20, 4: 100, 5: 1000 },
       // ... update payout table
   };
   ```

3. **Update Paytable** (`index.html`):
   Update the paytable display in the HTML.

### Using Image Assets
To replace emoji symbols with images:

1. **Add images** to a `/assets` folder
2. **Update CSS** to use background images:
   ```css
   .symbol[data-symbol="cherry"] {
       background-image: url('./assets/cherry.png');
       background-size: contain;
   }
   ```

3. **Update JavaScript** to use data attributes instead of text content

### Theme Customization
Modify CSS variables in `style.css`:
```css
:root {
    --accent-gold: #your-color;
    --bg-primary: #your-background;
    /* ... other variables */
}
```

## 🔧 Development

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser
3. No build process required!

### File Structure
```
GamblingGame/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Game logic and mechanics
└── README.md           # This file
```

### Code Organization
- **SlotMachine Class**: Main game logic
- **AudioManager Class**: Sound effects
- **GameSaver Class**: Data persistence
- **PerformanceOptimizer Class**: Mobile optimizations

## 🎯 Future Enhancements

### Possible Additions
- [ ] Bonus rounds and mini-games
- [ ] Progressive jackpot system
- [ ] More symbol animations
- [ ] Tournament mode
- [ ] Achievement system
- [ ] Social sharing features
- [ ] Additional sound effects
- [ ] Custom symbol sets

### Asset Integration
The game is designed to easily integrate assets from repositories like:
- [StakeEngine/web-sdk](https://github.com/StakeEngine/web-sdk/tree/main/apps/lines/static/assets)
- Custom symbol packs
- Sound effect libraries

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎰 Credits

- Built with modern web technologies
- Emoji symbols from Unicode standard
- Sound effects generated using Web Audio API
- Inspired by classic Vegas slot machines

---

**Disclaimer**: This is a virtual gambling game for entertainment purposes only. No real money is involved. Please gamble responsibly if you choose to play real money games elsewhere. 