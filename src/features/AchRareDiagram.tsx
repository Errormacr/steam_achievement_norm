import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRareAchievementCount } from '../hooks/useRareAchievementCount';
import { RARE_ACHIEVEMENT_CATEGORIES } from '../constants/achRareDiagram';
import { CustomPieChart } from '../components/CustomPieChart';
import '../styles/scss/DashboardWidgets.scss';

interface AchRareDiagramProps {
  gameAppid?: number;
}

interface PieData {
  id: string;
  label: string;
  value: number;
  color: string;
}

export default function AchRareDiagram({
  gameAppid,
}: Readonly<AchRareDiagramProps>) {
  const { t } = useTranslation();
  const counts = useRareAchievementCount(gameAppid);
  const dataToShow: PieData[] = RARE_ACHIEVEMENT_CATEGORIES.map((section) => ({
    id: t(section.nameKey),
    label: t(section.nameKey),
    value: counts[section.apiKey] || 0,
    color: section.color,
  })).filter((d) => d.value > 0);

  return (
    <div className="chart-center chart-center--pie">
      <CustomPieChart data={dataToShow} width={600} height={300} />
    </div>
  );
}
