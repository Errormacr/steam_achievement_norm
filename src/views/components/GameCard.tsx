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
import { styled } from '@mui/material/styles';
import { Achievements, AchievmentsFromView, gameDataWithAch, GamePageProps } from '../../interfaces';
import { ApiService } from '../../services/api.services';

const StyledCard = styled(Card)(({ theme }) => ({
  width: 400,
  minHeight: 230,
  margin: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10]
  }
}));

const FullGameCard = styled(StyledCard)(({ theme }) => ({
  boxShadow: '0 0 15px rgba(255, 165, 0, 0.7)',
  border: `2px solid ${theme.palette.warning.main}`,
  animation: '$shine 2s ease-in-out infinite',
  '@keyframes shine': {
    '0%': {
      boxShadow: '0 0 15px rgba(255, 165, 0, 0.7)'
    },
    '50%': {
      boxShadow: '0 0 25px rgba(255, 165, 0, 1)'
    },
    '100%': {
      boxShadow: '0 0 15px rgba(255, 165, 0, 0.7)'
    }
  }
}));

const GameCard: React.FC<GamePageProps> = ({ appid, backWindow }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);

  const [percent, setPercent] = useState(0.0);
  const [lastLaunchTime, setLastLaunchTime] = useState('');
  const [playtime, setPlaytime] = useState(0.0);
  const [all, setAll] = useState(0);
  const [gained, setGained] = useState(0);
  const [gameName, setGameName] = useState('');
  const [aches, setAches] = useState<AchievmentsFromView[]>([]);
  const [isProgressBarAnimated, setIsProgressBarAnimated] = useState(false);

  const logging = (appid: number, backWindow: string) => {
    navigate(`/GamePage/${appid}/${backWindow}`);
  };

  const updateGame = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const gameData = await ApiService.get<gameDataWithAch>(
            `user/${dataSteamId}/game/${appid}/data?language=${i18n.language}`
    );

    setPercent(gameData.userData[0].percent);
    setAll(gameData.achievmentsFromView.length);
    setGained(gameData.userData[0].gainedAch);
    setPlaytime(+gameData.userData[0].playtime.toFixed(2));
    setGameName(gameData.gamename);
    setLastLaunchTime(`${gameData.userData[0].lastLaunchTime}`);
    setAches(
      gameData.achievmentsFromView
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

  const CardComponent = percent === 100 ? FullGameCard : StyledCard;

  return (
        <CardComponent ref={cardRef}>
            <CardActionArea onClick={() => logging(appid, backWindow)} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', width: '100%', padding: 2, flexWrap: 'wrap' }}>
                    <CardMedia
                        component="img"
                        sx={{ width: 184, height: 69, borderRadius: 1 }}
                        image={`https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_sm_120.jpg`}
                        alt={gameName}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', ml: 2, flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="div" sx={{ overflow: 'hidden' }}>
                            {gameName}
                        </Typography>
                         <Chip label={`${playtime} ${t('Hours')}`} size="small" />
                    </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, width: '100%', pt: 0 }}>
                    <Box sx={{ width: '100%', mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap' }}>
                             <Typography variant="body2" color="text.secondary">{`Получено ${gained} из ${all}`}</Typography>
                             <Typography variant="body2" color="text.secondary">{`${percent.toFixed(2)}%`}</Typography>
                             <Typography variant="body2" color="text.secondary" title={t('LastLaunch')}>
                                 {lastLaunchTime.substring(0, 10)}
                             </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={isProgressBarAnimated ? percent : 0}
                            sx={{ height: 10, borderRadius: 5 }}
                        />
                    </Box>

                    <Grid container spacing={1} justifyContent="center">
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
                                         src={achievement.unlocked ? achievement.icon : achievement.grayIcon}
                                         alt={achievement.displayName}
                                         sx={{ width: 32, height: 32 }}
                                     />
                                 </Tooltip>
                             </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </CardActionArea>
        </CardComponent>
  );
};

export default GameCard;
