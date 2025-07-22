import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { Update } from '@mui/icons-material';

interface ActionBarProps {
  gameAppid: number;
  onUpdate: () => void;
  onToggleView: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ gameAppid, onUpdate, onToggleView }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
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
  );
};

export default ActionBar;
