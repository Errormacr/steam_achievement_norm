import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Card, CardMedia, Grid } from '@mui/material';
import CircularProgressSVG from './CircularProgressSVG';
import '../styles/scss/GameHeader.scss';

interface GameHeaderProps {
  game: {
    appid: number;
    gameName: string;
    percent: number;
    gained: number;
    all: number;
    headerUrl?: string | null;
  };
}

const GameHeader: React.FC<GameHeaderProps> = ({ game }) => {
  const { t } = useTranslation();
console.log(game);
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom align="center" className="game-header__title">
        {game.gameName}
      </Typography>
      <Box className="game-header">
        <Card className="game-header__card">
          <Grid container>
            <Grid>
              <CardMedia
                className="game-header__image"
                component="img"
                image={'https://shared.akamai.steamstatic.com/store_item_assets/' + game.headerUrl || `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`}
                alt={game.gameName}
                onError={(e) => {
                  // Fallback to default Steam CDN if the API URL fails
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`) {
                    target.src = `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`;
                  }
                }}
              />
            </Grid>
            <Grid className="game-header__stats">
              <CircularProgressSVG
                percent={game.percent}
                size={150}
                strokeWidth={15}
              />
              <Typography variant="subtitle1" className="game-header__subtitle">
                {t('AveragePercent')}
              </Typography>
              <Box className="game-header__counter">
                <Typography variant="h6" title={t('GainedFromAll')}>
                  {game.gained}/{game.all}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </>
  );
};

export default GameHeader;
