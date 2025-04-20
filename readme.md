## Setup

```
npm install
```

## Running

```
npx vite
```

----

## Folder structure
```
src/
├── index.js
├── game/
│   ├── Game.js
│   ├── Controls.js
│   └── World.js
├── objects/
│   ├── Terrain.js
│   └── Block.js
├── utils/
│   ├── TextureLoader.js
│   └── CoordinatesDisplay.js
└── config/
    └── constants.js
```

# Unit testing

```
npm install --save-dev mocha chai @babel/core @babel/preset-env @babel/register
```

```
npm test
```
