import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import i18n from 'i18next';
import { Box, Button, Container, IconButton, Typography } from '@mui/material';

import { useAchievementsPageData } from '../hooks/useAchievementsPageData';
import AchievementsDisplay from '../features/AchievementsDisplay';
import '../styles/scss/PageShell.scss';

interface AchievementPageScrollState {
  scrollY: number;
}

function getAchievementsStateKey (
  minPercent?: string,
  maxPercent?: string,
  date?: string,
  backWindow?: string,
  gameAppid?: string
) {
  return `achievementsPageState:${minPercent ?? '0'}:${maxPercent ?? '100'}:${date ?? 'undefined'}:${backWindow ?? 'main'}:${gameAppid ?? 'undefined'}`;
}

const AchPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { minPercent, maxPercent, date, backWindow, gameAppid } = useParams<{
    minPercent?: string;
    maxPercent?: string;
    date?: string;
    backWindow?: string;
    gameAppid?: string;
  }>();
  const storageKey = useMemo(
    () => getAchievementsStateKey(minPercent, maxPercent, date, backWindow, gameAppid),
    [minPercent, maxPercent, date, backWindow, gameAppid]
  );
  const savedState = useMemo(() => {
    const value = sessionStorage.getItem(storageKey);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as AchievementPageScrollState;
    } catch {
      sessionStorage.removeItem(storageKey);
      return null;
    }
  }, [storageKey]);
  const restoreScrollRef = useRef(savedState?.scrollY ?? 0);
  const [shouldRestoreScroll, setShouldRestoreScroll] = useState(
    Boolean(savedState && savedState.scrollY > 0)
  );

  const { tableOrBox, setTableOrBox, loaded, achCount } = useAchievementsPageData({
    minPercent,
    maxPercent,
    date,
    gameAppid,
    unlocked: 1
  });

  const handleToggleView = () => {
    const newTableView = !tableOrBox;
    setTableOrBox(newTableView);
    localStorage.setItem('boxView', String(newTableView));
  };

  const handleGoBack = () => {
    if (globalThis.history.length > 1) {
      navigate(-1);
      return;
    }

    if (backWindow === 'Stats') {
      navigate(`/${backWindow}${gameAppid ? '/' + gameAppid : ''}`);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify({ scrollY: window.scrollY }));
  }, [storageKey]);

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(storageKey, JSON.stringify({ scrollY: window.scrollY }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [storageKey]);

  useEffect(() => {
    if (!shouldRestoreScroll || !loaded) {
      return;
    }

    const savedScrollY = restoreScrollRef.current;

    const animationFrameId = globalThis.requestAnimationFrame(() => {
      window.scrollTo(0, savedScrollY);

      globalThis.setTimeout(() => {
        window.scrollTo(0, savedScrollY);
        setShouldRestoreScroll(false);
      }, 150);
    });

    return () => {
      globalThis.cancelAnimationFrame(animationFrameId);
    };
  }, [loaded, shouldRestoreScroll]);

  return (
    <I18nextProvider i18n={i18n}>
      <Container maxWidth={false} className="page-shell">
        <Box className="page-shell__header">
          <IconButton onClick={handleGoBack} className="page-shell__back">
            <FaArrowLeft />
          </IconButton>
          <Typography variant="h6" className="page-shell__title">
            {achCount} {t('Ach')}
          </Typography>
          <Box className="page-shell__actions">
            <Button variant="contained" onClick={handleToggleView} className="page-shell__button">
              {t('SwitchTable')}
            </Button>
          </Box>
        </Box>
        <Box>
          {loaded && (
            <AchievementsDisplay
              tableOrBox={tableOrBox}
              minPercent={+minPercent}
              maxPercent={+maxPercent}
              date={date === 'undefined' ? undefined : date}
              appid={Number(gameAppid) || undefined}
              unlocked={1}
              all={!+gameAppid}
            />
          )}
        </Box>
      </Container>
    </I18nextProvider>
  );
};

export default AchPage;
