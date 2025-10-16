# Bar Feud - Interactive Game Show App

A stunning, fully-functional recreation of the classic Family Feud game show, customized for bar venues with white-label branding capabilities.

## 🎮 Features

### Core Gameplay
- **Interactive Game Board**: 7 answer slots with dramatic 3D flip card animations
- **Dual Team System**: Complete scoring, buzzer mechanics, and active team indicators
- **Strike Counter**: Animated X marks with visual feedback (3 strikes max)
- **Host Controls**: Full game management panel for live hosting
- **Victory Detection**: Automatic winner announcement at 300 points

### Customization
- **Logo Management**: Upload custom bar logos or use presets
- **Team Names**: Editable team names for personalized gameplay
- **Question Library**: Create and manage custom survey questions
- **Bar-Themed Content**: Pre-loaded questions about bar culture

### Visual Design
- **Retro Game Show Aesthetic**: Bold red/gold/black color scheme with metallic gradients
- **Dramatic Typography**: Bebas Neue font with glowing text effects
- **Stage Background**: Professional curtain backdrop with spotlight effects
- **Responsive Layout**: Works on desktop, tablet, and mobile devices

### Interactive Elements
- **Buzzer System**: Visual and audio feedback when teams buzz in
- **Sound Effects**: Console logging with visual notifications for all game actions
- **Animated Reveals**: Smooth card flips with point displays
- **Score Tracking**: Real-time score updates with glowing active team indicators

## 🎯 How to Play

1. **Setup**: 
   - Customize team names using the Team Names panel
   - Upload your bar's logo using the Logo Customizer
   - Select or create questions using the Question Manager

2. **Face-Off Round**:
   - Click a question to load it on the game board
   - Teams buzz in to answer
   - Host clicks answer cards to reveal correct responses
   - Award strikes for wrong answers

3. **Main Game**:
   - Active team tries to reveal all answers
   - Host awards points to teams using "Award Team" buttons
   - Game continues until a team reaches 300 points

4. **Victory**:
   - Automatic victory screen displays when a team hits 300 points
   - Click "Play Again" to reset for a new game

## 🎨 Customization Options

### Logo Upload
- Supports any image URL
- Circular display format
- Appears on game board and victory screen

### Team Configuration
- Custom team names
- Color-coded scoring panels
- Individual buzzer buttons

### Question Management
- Add unlimited custom questions
- 1-8 answers per question with point values
- Bar-specific themes and topics

## 🔧 Technical Details

Built with:
- React + TypeScript
- Tailwind CSS for styling
- Custom hooks for game state management
- 3D CSS transforms for card animations

## 🎪 Host Controls

- **Add Strike**: Penalize wrong answers
- **Reset Strikes**: Clear strike counter
- **Award Team 1/2**: Give points to winning team
- **Next Round**: Progress game flow
- **Reset Game**: Start fresh game

## 📱 Responsive Design

The app adapts to all screen sizes:
- Desktop: Full 3-column layout with controls
- Tablet: Stacked layout with touch-friendly buttons
- Mobile: Vertical layout optimized for portrait mode

## 🎵 Sound Effects

Visual notifications appear for:
- Buzzer presses
- Answer reveals
- Strike additions
- Victory announcements

## 🚀 Future Enhancements

- Real audio file integration
- Fast Money round implementation
- Leaderboard and statistics tracking
- Multiple bar profile management
- Multiplayer networking for remote play
