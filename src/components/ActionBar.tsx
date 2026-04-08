import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Update } from '@mui/icons-material';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<Update />}
          onClick={onUpdate}
        >
          {t('Update')}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            navigate(`/Stats/${gameAppid}`);
          }}
        >
          {t('GameStats')}
        </Button>
        <Button
          variant="contained"
          onClick={onToggleView}
        >
          {t('SwitchTable')}
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.5,
          borderRadius: 3,
          background: 'linear-gradient(180deg, rgba(33, 46, 70, 0.96) 0%, rgba(20, 29, 47, 0.96) 100%)',
          border: '1px solid rgba(116, 156, 255, 0.45)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}
        >
          {t('Gained')}
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={String(unlockedFilter)}
          onChange={onUnlockedFilterChange}
          size="medium"
          sx={{
            gap: 1,
            '& .MuiToggleButtonGroup-grouped': {
              border: '1px solid rgba(128, 157, 210, 0.35)',
              borderRadius: '12px !important',
              color: 'rgba(255, 255, 255, 0.88)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              px: 1.75,
              py: 0.75,
              fontWeight: 700,
              textTransform: 'none',
              transition: 'all 0.18s ease',
              '&:hover': {
                backgroundColor: 'rgba(116, 156, 255, 0.14)',
                borderColor: 'rgba(116, 156, 255, 0.6)'
              },
              '&.Mui-selected': {
                color: '#0f1726',
                background: 'linear-gradient(180deg, #8fb3ff 0%, #5f8fff 100%)',
                borderColor: '#9cc1ff',
                boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.18), 0 8px 18px rgba(95, 143, 255, 0.35)'
              },
              '&.Mui-selected:hover': {
                background: 'linear-gradient(180deg, #9abbff 0%, #6c99ff 100%)'
              }
            }
          }}
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
