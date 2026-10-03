import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  LinearProgress,
  Tooltip,
  Avatar,
  Grid,
  Chip,
} from '@mui/material';
import { Achievements, AchievmentsFromView, Game, GameDataWithAch, GamePageProps } from '../types';
import { ApiService } from '../services/api.services';
import { logger } from '../utils/logger';
import AchievementFallbackIcon from './AchievementFallbackIcon';
import '../styles/scss/GameCard.scss';

const DEFAULT_CDN = 'https://steamcdn-a.akamaihd.net/steam/apps';
const STORE_ASSETS_CDN = 'https://shared.akamai.steamstatic.com/store_item_assets/';

/**
 * `capsuleUrl` is a path relative to the store assets host. Concatenation binds
 * tighter than `||`, so a missing value would produce a truthy ".../undefined"
 * source and the fallback would never apply.
 */
const buildCapsuleImageUrl = (appid: number, capsuleUrl?: string | null): string => {
  const fallback = `${DEFAULT_CDN}/${appid}/capsule_sm_120.jpg`;
  if (!capsuleUrl) return fallback;
  return capsuleUrl.startsWith('http')
    ? capsuleUrl
    : `${STORE_ASSETS_CDN}${capsuleUrl}`;
};

const GameCard: React.FC<GamePageProps> = ({ appid, backWindow }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);

  const [percent, setPercent] = useState(0);
  const [lastLaunchTime, setLastLaunchTime] = useState('');
  const [playtime, setPlaytime] = useState(0);
  const [all, setAll] = useState(0);
  const [gained, setGained] = useState(0);
  const [gameName, setGameName] = useState('');
  const [game, setGame] = useState<Game | null>(null);
  const [aches, setAches] = useState<AchievmentsFromView[]>([]);
  const [isProgressBarAnimated, setIsProgressBarAnimated] = useState(false);

  const logging = (currentAppid: number, currentBackWindow: string) => {
    navigate(`/GamePage/${currentAppid}/${currentBackWindow}`);
  };

  const updateGame = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    if (!dataSteamId) return;

    try {
      const gameData = await ApiService.get<GameDataWithAch>(
        `user/${dataSteamId}/game/${appid}/data?language=${i18n.language}`
      );

      // A freshly added game has no userData row yet; treat it as zeroed
      // instead of throwing on userData[0].
      const userData = gameData?.userData?.[0];

      setPercent(userData?.percent ?? 0);
      setAll(gameData.achievementCount ?? gameData.achievementsFromView?.length ?? 0);
      setGained(userData?.gainedAch ?? 0);
      setPlaytime(Number(userData?.playtime?.toFixed(2) ?? 0));
      setGameName(gameData.gamename);
      setGame({
        appid: gameData.appid,
        gamename: gameData.gamename,
        lowerGamename: gameData.lowerGamename,
        capsuleUrl: gameData.capsuleUrl,
        headerUrl: gameData.headerUrl,
        libraryCapsule2xUrl: gameData.libraryCapsule2xUrl,
        imageUrlUpdatedAt: gameData.imageUrlUpdatedAt,
      });
      setLastLaunchTime(`${userData?.lastLaunchTime ?? ''}`);
      setAches(
        (gameData.achievementsFromView ?? [])
          .toSorted((a: Achievements, b: Achievements) =>
            new Date(b.unlockedDate).getTime() - new Date(a.unlockedDate).getTime()
          )
          .slice(0, 7)
      );
    } catch (error) {
      logger.error(`Failed to load game data for appid ${appid}`, error);
    }
  }, [appid]);

  useEffect(() => {
    updateGame();

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsProgressBarAnimated(true);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    });

    if (cardRef.current) {
      intersectionObserver.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        intersectionObserver.unobserve(cardRef.current);
      }
    };
  }, [updateGame]);

  const fallbackImageUrl = `${DEFAULT_CDN}/${appid}/capsule_sm_120.jpg`;
  const capsuleImageUrl = buildCapsuleImageUrl(appid, game?.capsuleUrl);

  return (
    <Card ref={cardRef} className={`game-card${percent === 100 ? ' game-card--complete' : ''}`}>
      <CardActionArea onClick={() => logging(appid, backWindow)} className="game-card__action">
        <Box className="game-card__top">
          <Box className="game-card__top-row">
            <CardMedia
              component="img"
              className="game-card__image"
              image={capsuleImageUrl}
              alt={gameName}
              onError={(e) => {
                // Fall back to the public CDN exactly once; re-assigning the
                // same broken URL would loop forever.
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== fallbackImageUrl) {
                  target.src = fallbackImageUrl;
                }
              }}
            />
            <Chip className="game-card__chip" label={`${playtime} ${t('Hours')}`} size="small" />
          </Box>
          <Box className="game-card__meta">
            <Typography gutterBottom variant="h6" component="div" className="game-card__title">
              {gameName}
            </Typography>
          </Box>
        </Box>

        <CardContent className="game-card__content">
          <Box className="game-card__progress-wrap">
            <Box className="game-card__progress-header">
              <Typography variant="body2" className="game-card__muted">{`${t('GainedFromAll')}: ${gained}/${all}`}</Typography>
              <Typography variant="body2" className="game-card__muted">{`${percent.toFixed(2)}%`}</Typography>
              <Typography variant="body2" className="game-card__muted" title={t('LastLaunch')}>
                {lastLaunchTime.substring(0, 10)}
              </Typography>
            </Box>
            <LinearProgress
              className="game-card__progress"
              variant="determinate"
              value={isProgressBarAnimated ? percent : 0}
            />
          </Box>

          <Grid container spacing={1} className="game-card__achievements">
            {aches.map((achievement) => {
              const icon = achievement.unlocked ? achievement.icon : achievement.grayIcon;
              const hasIcon = Boolean(icon);
              return (
                <Grid key={achievement.name}>
                  <Tooltip title={
                    <React.Fragment>
                      <Typography color="inherit" variant="subtitle2">{achievement.displayName}</Typography>
                      <Typography variant="body2">{achievement.description}</Typography>
                      <Typography variant="caption" color="text.secondary">{`Rarity: ${achievement.percent.toFixed(2)}%`}</Typography>
                      {achievement.unlocked && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {t('Unlocked')}: {new Date(achievement.unlockedDate).toLocaleString()}
                        </Typography>
                      )}
                    </React.Fragment>
                  }>
                    {hasIcon ? (
                      <Avatar
                        className="game-card__avatar"
                        src={icon}
                        alt={achievement.displayName}
                      />
                    ) : (
                      <AchievementFallbackIcon
                        className="game-card__avatar"
                        gray={!achievement.unlocked}
                        size={40}
                      />
                    )}
                  </Tooltip>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default GameCard;
