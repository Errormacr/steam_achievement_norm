import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Update } from '@mui/icons-material';
import '../styles/scss/ActionBar.scss';

interface ActionBarProps {
  gameAppid: number;
  onUpdate: () => void;
  onToggleView: () => void;
  unlockedFilter: -1 | 0 | 1;
  onUnlockedFilterChange: (_: React.MouseEvent<HTMLElement>, value: string | null) => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  gameAppid,
  onUpdate,
  onToggleView,
  unlockedFilter,
  onUnlockedFilterChange
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box className="action-bar">
      <Box className="action-bar__buttons">
        <Button
          className="action-bar__button"
          variant="contained"
          startIcon={<Update />}
          onClick={onUpdate}
        >
          {t('Update')}
        </Button>
        <Button
          className="action-bar__button"
          variant="contained"
          onClick={() => {
            navigate(`/Stats/${gameAppid}`);
          }}
        >
          {t('GameStats')}
        </Button>
        <Button
          className="action-bar__button"
          variant="contained"
          onClick={onToggleView}
        >
          {t('SwitchTable')}
        </Button>
      </Box>

      <Box className="action-bar__filter-panel">
        <Typography variant="caption" className="action-bar__filter-title">
          {t('CompletedFilter')}
        </Typography>
        <ToggleButtonGroup
          className="action-bar__toggle-group"
          exclusive
          value={String(unlockedFilter)}
          onChange={onUnlockedFilterChange}
          size="medium"
        >
          <ToggleButton value="-1">{t('AllAChInGameSort')}</ToggleButton>
          <ToggleButton value="1">{t('GainedAchSort')}</ToggleButton>
          <ToggleButton value="0">{t('NonGainedAchSort')}</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default ActionBar;
