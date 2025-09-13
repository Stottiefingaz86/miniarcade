# Mini Arcade Chat Head

A mobile-first React component that mimics Facebook Messenger's old "chat head" functionality with a floating circular bubble that opens a bottom drawer containing casino game tiles.

## Features

- 🎯 **Floating Chat Head**: Draggable circular bubble that stays fixed above page content
- 📱 **Mobile-First Design**: Optimized for mobile devices with touch interactions
- 🎮 **Casino Game Grid**: Bottom drawer with 6 casino game tiles (Crash, Plinko, Mines, Roulette, Slots, Keno)
- 🎨 **Smooth Animations**: Spring physics animations using Framer Motion
- 📐 **Safe Area Support**: Respects iOS safe areas (notch, home bar)
- 🎪 **Snap to Edge**: Automatically snaps to left or right edge when released
- 🎭 **Multiple Dismiss Options**: Close via drag down, tap outside, or close button

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Vite** - Build tool

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Usage

### Chat Head Interactions

- **Tap**: Opens the bottom drawer with casino games
- **Drag**: Move the bubble around the screen
- **Release**: Automatically snaps to the nearest edge (left or right)
- **Long Press**: Visual feedback with scale animation

### Bottom Drawer Interactions

- **Tap Game Tile**: Shows alert with game description (placeholder)
- **Drag Down**: Dismisses the drawer
- **Tap Outside**: Dismisses the drawer
- **Close Button**: Dismisses the drawer

## Component Structure

```
src/
├── components/
│   ├── ChatHead.tsx          # Main floating bubble component
│   ├── BottomDrawer.tsx      # Bottom sheet with game grid
│   └── GameTile.tsx          # Individual casino game tile
├── App.tsx                   # Main app component
├── main.tsx                  # React entry point
└── index.css                 # Global styles and Tailwind imports
```

## Customization

### Adding New Games

Edit the `casinoGames` array in `BottomDrawer.tsx`:

```typescript
const casinoGames = [
  {
    id: 'new-game',
    name: 'New Game',
    icon: YourIcon,
    color: 'from-purple-500 to-pink-500',
    description: 'Your game description'
  }
]
```

### Styling

- Modify colors in `tailwind.config.js`
- Update CSS classes in component files
- Customize animations in Framer Motion props

### Safe Areas

The component automatically handles iOS safe areas using CSS environment variables:
- `env(safe-area-inset-top)`
- `env(safe-area-inset-bottom)`
- `env(safe-area-inset-left)`
- `env(safe-area-inset-right)`

## Browser Support

- iOS Safari 11.2+
- Chrome 69+
- Firefox 62+
- Edge 79+

## Performance

- Optimized for 60fps animations
- Minimal re-renders with proper React patterns
- Efficient drag handling with Framer Motion
- CSS transforms for smooth hardware acceleration

## License

MIT License - feel free to use in your projects!


