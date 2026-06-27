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
  Chip
} from '@mui/material';
import { Achievements, AchievmentsFromView, Game, GameDataWithAch, GamePageProps } from '../types';
import { ApiService } from '../services/api.services';
import '../styles/scss/GameCard.scss';

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
    const gameData = await ApiService.get<GameDataWithAch>(
      `user/${dataSteamId}/game/${appid}/data?language=${i18n.language}`
    );

    setPercent(gameData.userData[0].percent);
    setAll(gameData.achievementsFromView?.length ?? 0);
    setGained(gameData.userData[0].gainedAch);
    setPlaytime(+gameData.userData[0].playtime.toFixed(2));
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
    setLastLaunchTime(`${gameData.userData[0].lastLaunchTime}`);
    setAches(
      (gameData.achievementsFromView ?? [])
        .toSorted((a: Achievements, b: Achievements) =>
          new Date(b.unlockedDate).getTime() - new Date(a.unlockedDate).getTime()
        )
        .slice(0, 7)
    );
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

  return (
    <Card ref={cardRef} className={`game-card${percent === 100 ? ' game-card--complete' : ''}`}>
      <CardActionArea onClick={() => logging(appid, backWindow)} className="game-card__action">
        <Box className="game-card__top">
          <Box className="game-card__top-row">
            <CardMedia
              component="img"
              className="game-card__image"
              image={'https://shared.akamai.steamstatic.com/store_item_assets/' + game?.capsuleUrl || `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_sm_120.jpg`}
              alt={gameName}
              onError={(e) => {
                // Fallback to default Steam CDN if the API URL fails
                e.currentTarget.src = `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_sm_120.jpg`;
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
            {aches.map((achievement) => (
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
                  <Avatar
                    className="game-card__avatar"
                    src={achievement.unlocked ? achievement.icon : achievement.grayIcon}
                    alt={achievement.displayName}
                  />
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default GameCard;
