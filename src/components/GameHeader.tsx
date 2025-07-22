import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Card, CardMedia, Grid } from '@mui/material';
import CircularProgressSVG from './CircularProgressSVG';

interface GameHeaderProps {
  game: {
    appid: number;
    gameName: string;
    percent: number;
    gained: number;
    all: number;
  };
}

const GameHeader: React.FC<GameHeaderProps> = ({ game }) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {game.gameName}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Card sx={{ mb: 2, width: 'fit-content' }}>
          <Grid container>
            <Grid>
              <CardMedia
                component="img"
                image={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`}
                alt={game.gameName}
                sx={{ objectFit: 'cover' }}
              />
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
              <CircularProgressSVG
                percent={game.percent}
                size={150}
                strokeWidth={15}
              />
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                {t('AveragePercent')}
              </Typography>
              <Box sx={{ border: '1px solid grey', borderRadius: '4px', p: 1, mt: 2 }}>
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
