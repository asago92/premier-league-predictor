# Premier League Predictor

A Monte Carlo simulation webapp for predicting English Premier League match outcomes using real historical data.

![Preview](https://i.imgur.com/preview.png)

## Features

- **Real Historical Data**: Uses 10+ seasons of EPL data from 2014-2025
- **Monte Carlo Simulation**: Runs 10,000+ simulations for accurate predictions
- **Poisson Distribution**: Realistic goal scoring modeling
- **Interactive UI**: Adjust probabilities and see live predictions
- **Team Statistics**: View attack/defense strengths based on historical performance

## Live Demo

[View Live Demo](https://your-github-pages-url.com)

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/premier-league-predictor.git
cd premier-league-predictor
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173)

## Updating the Data

The simulation uses data from `src/data/epl_data.csv`. To update with new season data:

1. Edit `src/data/epl_data.csv`
2. Add new rows following the existing format
3. Commit and push changes
4. The app will automatically use the new data

See [UPDATE_DATA.md](.github/UPDATE_DATA.md) for detailed instructions.

## How It Works

### Simulation Model

The prediction model uses:

1. **Historical Performance**: Attack/defense strengths calculated from past seasons
2. **Home Advantage**: Separate stats for home and away performance
3. **Poisson Distribution**: Models goal scoring probability
4. **Monte Carlo Method**: Runs thousands of simulations for accurate probabilities

### Formula

```
Expected Goals = Base Goals × Attack Ratio × Defense Ratio × Modifier × Home Advantage

Where:
- Base Goals = Team's historical average goals per match
- Attack Ratio = Team Attack Strength / League Average
- Defense Ratio = Opponent Defense Strength / League Average
- Modifier = User-adjustable probability slider
- Home Advantage = 1.15 (home) or 0.92 (away)
```

## Data Structure

### CSV Columns

| Column | Description |
|--------|-------------|
| Season | Season year (e.g., "2025 - 2026") |
| Rk | Final league rank |
| Squad | Team name |
| H-MP | Home matches played |
| H-W/D/L | Home wins/draws/losses |
| H-GF/GA | Home goals for/against |
| A-MP | Away matches played |
| A-W/D/L | Away wins/draws/losses |
| A-GF/GA | Away goals for/against |

## CodeSandbox

Open this project in CodeSandbox:

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/p/github/yourusername/premier-league-predictor)

## GitHub Integration

### Fork and Customize

1. Fork this repository
2. Update `src/data/epl_data.csv` with your data
3. Enable GitHub Pages in repository settings
4. Your site will auto-deploy on every push to main

### Environment Variables

No environment variables required - all data is stored in the CSV file.

## Project Structure

```
premier-league-predictor/
├── src/
│   ├── components/        # React components
│   ├── data/             # Team data and CSV
│   ├── lib/              # Simulation engine
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main app
│   └── main.tsx          # Entry point
├── .codesandbox/         # CodeSandbox config
├── .github/              # GitHub Actions & docs
├── public/               # Static assets
└── package.json
```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Poisson Distribution** - Goal scoring model

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own predictions!

## Acknowledgments

- Data sourced from [FBref](https://fbref.com)
- Inspired by football analytics research
- Built with ❤️ for football fans

---

**Note**: This is a prediction tool for educational purposes. Match outcomes are never guaranteed!
