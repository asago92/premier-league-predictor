# GitHub & CodeSandbox Setup Guide

This guide walks you through setting up this Premier League Predictor on GitHub and CodeSandbox so you can easily update the simulation data.

## Quick Start

### Option 1: Deploy to GitHub Pages (Recommended)

1. **Create a new GitHub repository**
   ```bash
   # On GitHub, create a new repository named "premier-league-predictor"
   ```

2. **Push this code to GitHub**
   ```bash
   cd /mnt/okcomputer/output/app
   git init
   git add .
   git commit -m "Initial commit with real EPL data"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/premier-league-predictor.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Source: Select "GitHub Actions"
   - The included workflow (`.github/workflows/deploy.yml`) will auto-deploy

4. **Your site will be live at**
   ```
   https://YOUR_USERNAME.github.io/premier-league-predictor
   ```

---

## Updating the Simulation Data

### Method 1: Edit Directly on GitHub (Easiest)

1. Go to your repository on GitHub
2. Navigate to `src/data/epl_data.csv`
3. Click the **Edit** button (pencil icon)
4. Add new season data following the existing format
5. Commit changes with a message like "Add 2026-2027 season data"
6. GitHub Actions will automatically rebuild and deploy!

### Method 2: Edit Locally and Push

1. Edit `src/data/epl_data.csv` in your local copy
2. Add new rows with season data:
   ```csv
   2026 - 2027,1,Arsenal,19,12,4,3,40,18,22,40,2.11,19,10,5,4,35,22,13,35,1.84
   ```
3. Commit and push:
   ```bash
   git add src/data/epl_data.csv
   git commit -m "Add 2026-2027 season data"
   git push
   ```
4. GitHub Actions will auto-deploy the updated site

---

## CodeSandbox Integration

### Open in CodeSandbox

1. Go to [CodeSandbox](https://codesandbox.io)
2. Click **Create** → **Import from GitHub**
3. Paste your repository URL
4. CodeSandbox will automatically detect the configuration

### Or Use the Direct Link

```
https://codesandbox.io/p/github/YOUR_USERNAME/premier-league-predictor
```

### CodeSandbox Features

- **Live Preview**: See changes instantly as you edit
- **Edit CSV**: Modify `src/data/epl_data.csv` directly in the editor
- **Auto-reload**: The preview updates automatically when you save

---

## CSV Data Format

### Column Reference

| Column | Description | Example |
|--------|-------------|---------|
| Season | Season years | `2025 - 2026` |
| Rk | Final rank | `1` |
| Squad | Team name | `Arsenal` |
| H-MP | Home matches played | `19` |
| H-W | Home wins | `12` |
| H-D | Home draws | `4` |
| H-L | Home losses | `3` |
| H-GF | Home goals for | `35` |
| H-GA | Home goals against | `18` |
| H-GD | Home goal difference | `17` |
| H-Pts | Home points | `40` |
| H-Pts/MP | Home points per match | `2.11` |
| A-MP | Away matches played | `19` |
| A-W | Away wins | `10` |
| A-D | Away draws | `5` |
| A-L | Away losses | `4` |
| A-GF | Away goals for | `30` |
| A-GA | Away goals against | `22` |
| A-GD | Away goal difference | `8` |
| A-Pts | Away points | `35` |
| A-Pts/MP | Away points per match | `1.84` |

### Example Row

```csv
2025 - 2026,1,Arsenal,19,12,4,3,35,18,17,40,2.11,19,10,5,4,30,22,8,35,1.84
```

---

## Supported Team Names

The following team names are recognized (case-insensitive):

- Arsenal
- Aston Villa
- Bournemouth
- Brentford
- Brighton
- Burnley
- Chelsea
- Crystal Palace
- Everton
- Fulham
- Leeds United
- Leicester City
- Liverpool
- Luton Town
- Manchester City
- Manchester United / Manchester Utd
- Newcastle United
- Norwich City
- Nottingham Forest
- Queens Park Rangers / QPR
- Sheffield United
- Southampton
- Stoke City
- Sunderland
- Swansea City / Swansea
- Tottenham Hotspur / Tottenham
- Watford
- West Bromwich Albion / West Brom
- West Ham United / West Ham
- Wolves

---

## Data Sources

Get historical Premier League data from:

1. **[FBref](https://fbref.com/en/comps/9/Premier-League-Stats)** - Most comprehensive
2. **[Premier League Official](https://www.premierleague.com/tables)** - Official stats
3. **[Transfermarkt](https://www.transfermarkt.com/premier-league/tabelle/wettbewerb/GB1)** - Detailed stats
4. **[WorldFootball.net](https://www.worldfootball.net/england-premier-league/)** - Historical tables

---

## How the Simulation Works

### Attack/Defense Strength Calculation

```
Attack Strength = (Home GF/Home MP + Away GF/Away MP) / 2 / 90
Defense Strength = (Home GA/Home MP + Away GA/Away MP) / 2 / 90
```

### Expected Goals Formula

```
Expected Goals = Base Goals × Attack Ratio × Defense Ratio × Modifier × Home Advantage

Where:
- Base Goals = Team's historical average goals per match
- Attack Ratio = Team Attack Strength / League Average
- Defense Ratio = Opponent Defense Strength / League Average
- Modifier = User-adjustable probability slider (0-0.1)
- Home Advantage = 1.15 (home) or 0.92 (away)
```

### Monte Carlo Simulation

1. Run 10,000 simulated matches
2. Use Poisson distribution for goal scoring
3. Count win/draw/lose outcomes
4. Calculate probabilities from results

---

## Troubleshooting

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CSV Not Loading

- Ensure CSV is in `src/data/epl_data.csv`
- Check for proper comma separation
- Verify no extra blank lines at end

### Team Not Found

- Check team name matches supported names
- Team names are case-insensitive
- Use full names (e.g., "Manchester City" not "Man City")

---

## Customization

### Change Default Teams

Edit `src/data/teams.ts`:

```typescript
export const getDefaultMatchup = (): { home: Team; away: Team } => {
  return {
    home: premierLeagueTeams.find(t => t.id === 'liverpool')!, // Change this
    away: premierLeagueTeams.find(t => t.id === 'city')!       // Change this
  };
};
```

### Change Team Colors

Edit team colors in `src/data/teams.ts`:

```typescript
{
  id: 'arsenal',
  name: 'Arsenal',
  shortName: 'ARS',
  color: '#EF0107',  // Change this hex color
  flagColors: ['#EF0107', '#FFFFFF'],
}
```

### Adjust Simulation Parameters

Edit `src/lib/simulation.ts`:

```typescript
const homeAdvantage = isHomeTeam ? 1.15 : 0.92;  // Adjust multipliers
return Math.max(0.1, Math.min(expectedGoals, 4.5));  // Adjust min/max goals
```

---

## Need Help?

- Open an issue on GitHub
- Check the [UPDATE_DATA.md](.github/UPDATE_DATA.md) guide
- Review example data in `src/data/epl_data.csv`

---

## License

MIT - Feel free to use and modify!
