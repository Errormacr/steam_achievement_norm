import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import { ArrowBack, Update } from '@mui/icons-material';
import i18n from 'i18next';
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  Grid,
  Button,
  IconButton
} from '@mui/material';

import Table from '../components/Table';
import ScrollToTopButton from '../components/ScrollToTopButton';
import AchBox from '../features/AchContainer';
import { GameDataRow, gameDataWithAch } from '../../interfaces';
import { ApiService } from '../../services/api.services';


import CircularProgressSVG from "../components/CircularProgressSVG";

interface Game {
  appid: number;
  last_launch_time: string;
  playtime: number;
  gameName: string;
  all: number;
  gained: number;
  percent: number;
}

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { appid, backWindow } = useParams<{
    appid: string;
    backWindow: string;
  }>();

  const [game, setGame] = useState<Game>({
    appid: 0,
    last_launch_time: '',
    playtime: 0,
    gameName: '',
    all: 0,
    gained: 0,
    percent: 0
  });
  const [loaded, setLoaded] = useState(false);
  const [tableOrBox, setTableOrBox] = useState(true);

  const renderComponent = async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const gameData = await ApiService.get<gameDataWithAch>(
      `user/${dataSteamId}/game/${appid}/data?language=${i18n.language}&achievements=false`
    );
    const userData = gameData.userData[0];
    const newGameData = {
      appid: +appid,
      last_launch_time: userData.lastLaunchTime,
      playtime: userData.playtime,
      gameName: gameData.gamename,
      all: gameData.achievementCount,
      gained: userData.gainedAch,
      percent: userData.percent
    };
    setGame(newGameData);
  };

  const fetchUpdatedGameData = async () => {
    const steamId = localStorage.getItem('steamId');
    const { unlockedCount: gained } = await ApiService.get<GameDataRow>(
      `steam-api/all-user-ach-data/${steamId}/game/${game.appid}?lang=${i18n.language}`
    );
    toast.success(`${t('GameUpdateSuccess')}\n${t('Gained')} ${gained - game.gained}`);
    await renderComponent();
  };

  useEffect(() => {
    try {
      renderComponent();
      const boxView = localStorage.getItem('boxView') === 'true';
      if (!boxView) {
        setTableOrBox(false);
      }
      setLoaded(true);
    } catch (error) {
      window.alert(error.message);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Container maxWidth={false}>
        <ToastContainer />
        <ScrollToTopButton />
        <IconButton
          onClick={() => {
            if (backWindow === 'main') {
              navigate('/');
            } else {
              navigate('/Games');
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {game.gameName}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Card sx={{ mb: 2, width: 'fit-content' }}>
          <Grid container>
            <Grid item xs={12} md={8}>
              <CardMedia
                component="img"
                image={`https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`}
                alt={game.gameName}
                sx={{ objectFit: 'cover' }}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Update />}
            onClick={fetchUpdatedGameData}
          >
            {t('Update')}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              navigate(`/Stats/${game.appid}`);
            }}
          >
            {t('GameStats')}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setTableOrBox(!tableOrBox);
              localStorage.setItem('boxView', String(!tableOrBox));
            }}
          >
            {t('SwitchTable')}
          </Button>
        </Box>
        <Box>
          {loaded &&
            (tableOrBox ? (
              <Table appid={+appid} all={false} />
            ) : (
              <AchBox minPercent={0} maxPercent={100} appid={+appid} all={false} />
            ))}
        </Box>
      </Container>
    </I18nextProvider>
  );
};

export default GamePage;
