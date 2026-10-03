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

const DEFAULT_HEADER_URL = 'https://steamcdn-a.akamaihd.net/steam/apps';

/**
 * `headerUrl` is a path relative to the store assets host. String concatenation
 * binds tighter than `||`, so the fallback must be chosen before building the
 * URL — otherwise a missing value yields a truthy ".../undefined" source.
 */
const buildHeaderImageUrl = (appid: number, headerUrl?: string | null): string => {
  const fallback = `${DEFAULT_HEADER_URL}/${appid}/header.jpg`;
  if (!headerUrl) return fallback;
  return headerUrl.startsWith('http')
    ? headerUrl
    : `https://shared.akamai.steamstatic.com/store_item_assets/${headerUrl}`;
};

const GameHeader: React.FC<GameHeaderProps> = ({ game }) => {
  const { t } = useTranslation();
  const headerImageUrl = buildHeaderImageUrl(game.appid, game.headerUrl);
  const fallbackUrl = `${DEFAULT_HEADER_URL}/${game.appid}/header.jpg`;

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
                image={headerImageUrl}
                alt={game.gameName}
                onError={(e) => {
                  // Fall back to the public CDN exactly once; re-assigning the
                  // same broken URL would loop forever.
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== fallbackUrl) {
                    target.src = fallbackUrl;
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
