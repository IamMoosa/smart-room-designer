# Smart Room Designer 🏠

A modern, interactive room design tool built with Next.js and TypeScript. Place and arrange furniture in a grid-based system with smooth drag-and-drop interactions and rotation mechanics.

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or later
- npm or yarn
- Git

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/IamMoosa/smart-room-designer.git
cd smart-room-designer
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open the application**
- Navigate to [http://localhost:3000](http://localhost:3000) in your browser
- You should see the landing page with a "Start Designing" button

## 🎮 Core Features

- **Grid-based furniture placement**: Snap-to-grid system for precise alignment
- **Rotation system**: Select objects and press 'R' to rotate 90 degrees
- **Collision detection**: Prevents furniture overlap
- **Undo functionality**: Track and reverse actions
- **Responsive design**: Works on different screen sizes

## 🏗️ Project Structure

```
smart-room-designer/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Landing page
│   │   ├── room/             # Room designer component
│   │   │   ├── page.tsx     # Main room designer logic
│   │   │   └── RoomObject.ts # Room object types and utilities
│   │   └── help/            # Help page
│   └── ...
├── public/                    # Static assets
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies
└── tsconfig.json            # TypeScript configuration
```

## 💻 Development Guide

### Key Components

1. **RoomObject Type (`src/app/room/RoomObject.ts`)**
```typescript
type RoomObject = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: string;
  rotation: number; // degrees: 0, 90, 180, 270
};
```

2. **Room Designer (`src/app/room/page.tsx`)**
- Main canvas-based room designer component
- Handles drag-and-drop, rotation, and collision detection
- Uses grid system for placement (gridSize = 50px)

### Adding New Features

1. **Adding New Furniture**
- Update `defaultFurniture` array in `src/app/room/page.tsx`
- Follow the existing pattern for size and positioning
```typescript
{
  id: 'newItem',
  x: roomX + roomWidth + gridSize * 2,
  y: roomY + gridSize * position,
  w: gridSize * width,
  h: gridSize * height,
  color: '#hexcolor',
  label: '',
  rotation: 0
}
```

2. **Modifying Grid System**
- Grid size is set to 50px (configurable in `RoomDesigner` component)
- All measurements should be in multiples of `gridSize`

3. **Adding UI Elements**
- Use Tailwind CSS for styling
- Follow the existing component patterns

## 🎨 Styling Guidelines

- Use Tailwind CSS for styling components
- Follow the existing color scheme:
  - Primary: Purple (#8B5CF6)
  - Secondary: Indigo (#4F46E5)
  - Background: Slate (#1e1e1e)
- Use motion.div from Framer Motion for animations

## 🧪 Testing

Currently using manual testing through the development server. When adding new features:
1. Test furniture placement
2. Verify rotation mechanics
3. Check collision detection
4. Ensure undo functionality works
5. Verify responsive design

## 📝 Git Workflow

1. **Creating a new feature**
```bash
git checkout -b feature/your-feature-name
```

2. **Making commits**
```bash
git add .
git commit -m "feat: your descriptive commit message"
```

3. **Pushing changes**
```bash
git push origin feature/your-feature-name
```

4. **Create a Pull Request**
- Go to GitHub repository
- Create a new Pull Request from your feature branch
- Add description of changes
- Request review

## 🐛 Common Issues & Solutions

1. **Grid Alignment Issues**
- Check if furniture sizes are multiples of gridSize (50px)
- Verify snap calculations in handleMouseMove

2. **Rotation Problems**
- Ensure rotation is in 90-degree increments
- Check bbox calculations for rotated objects

3. **Overlap Detection**
- Debug using console.logs in isOverlapping function
- Verify bounding box calculations

## 🔜 Planned Features

- [ ] Save/load room layouts
- [ ] More furniture pieces
- [ ] Custom furniture colors
- [ ] Room templates
- [ ] Export functionality

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
