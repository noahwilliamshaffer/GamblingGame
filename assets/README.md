# Assets Integration

This folder is designed to hold game assets such as symbol images, sound effects, and UI elements.

## StakeEngine Assets Integration

To integrate assets from the StakeEngine web-sdk repository:

### 1. Download Assets
From the [StakeEngine web-sdk repository](https://github.com/StakeEngine/web-sdk/tree/main/apps/lines/static/assets), download the following:

```
assets/
├── symbols/
│   ├── cherry.png
│   ├── diamond.png
│   ├── bell.png
│   ├── star.png
│   └── ...other symbols
├── sounds/
│   ├── spin.mp3
│   ├── win.mp3
│   └── ...other sounds
└── ui/
    ├── buttons/
    ├── backgrounds/
    └── ...other UI elements
```

### 2. Update JavaScript (script.js)
Replace emoji symbols with image references:

```javascript
// Instead of emoji symbols
this.symbols = [
    { symbol: '🍒', weight: 5 },
    // ...
];

// Use asset paths
this.symbols = [
    { symbol: 'cherry', weight: 5, image: './assets/symbols/cherry.png' },
    { symbol: 'diamond', weight: 1, image: './assets/symbols/diamond.png' },
    // ...
];
```

### 3. Update CSS (style.css)
Add styles for image symbols:

```css
.symbol[data-symbol="cherry"] {
    background-image: url('./assets/symbols/cherry.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.symbol[data-symbol="diamond"] {
    background-image: url('./assets/symbols/diamond.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}
/* Add more symbol styles... */
```

### 4. Update HTML Structure
Modify the symbol creation to use data attributes:

```javascript
// In script.js, when creating symbols
const symbolEl = document.createElement('div');
symbolEl.className = 'symbol';
symbolEl.setAttribute('data-symbol', symbolData.symbol);
// Remove: symbolEl.textContent = this.getRandomSymbol();
```

### 5. Audio Assets
Replace the generated Web Audio API sounds with actual sound files:

```javascript
// Replace in SlotMachine class
this.elements.spinSound.src = './assets/sounds/spin.mp3';
this.elements.winSound.src = './assets/sounds/win.mp3';
```

### 6. Background and UI Assets
Add background images and UI elements:

```css
.slot-machine {
    background-image: url('./assets/ui/machine-background.png');
    background-size: cover;
}

.spin-btn {
    background-image: url('./assets/ui/buttons/spin-button.png');
    background-size: contain;
}
```

## Asset Optimization

For best performance on Vercel:

1. **Compress images**: Use tools like TinyPNG or ImageOptim
2. **Use WebP format**: For better compression where supported
3. **Optimize file sizes**: Keep assets under 1MB each
4. **Use sprite sheets**: For multiple small icons
5. **Implement lazy loading**: For non-critical assets

## Responsive Assets

Consider providing multiple sizes for different screen densities:

```
assets/symbols/
├── cherry@1x.png
├── cherry@2x.png
├── cherry@3x.png
└── cherry.svg (vector fallback)
```

Then use CSS media queries or JavaScript to load appropriate assets.

## License Considerations

When using StakeEngine or other third-party assets:
- Check the license terms
- Provide proper attribution if required
- Ensure you have permission for commercial use (if applicable)
- Consider creating your own assets for full control

## Current State

The game currently uses emoji symbols and generated sounds, making it fully functional without external assets. This approach ensures:
- ✅ Zero dependencies
- ✅ Fast loading
- ✅ Cross-platform compatibility
- ✅ No copyright concerns

Replace with custom assets when ready for a more polished experience! 