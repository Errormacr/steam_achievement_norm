import React, { useState, useEffect } from 'react';

interface AchievementImageProps {
  name: string;
  icon: string;
  displayName: string;
  description: string;
  percent: number;
  unlockedDate: Date | null;
  gameName?: string;
}

const AchievementImage: React.FC<AchievementImageProps> = ({
  name,
  icon,
  displayName,
  description,
  percent,
  unlockedDate,
  gameName
}) => {
  const [imgSrc, setImgSrc] = useState('');

  const getImage = async (iconUrl: string): Promise<string> => {
    const url = `http://localhost:8888/api/image-cache?url=${encodeURIComponent(iconUrl)}`;
    console.log('Image URL:', url);
    const response = await fetch(url);
    const data = await response.text();
    return data;
  };

  useEffect(() => {
    getImage(icon).then((data) => {
      setImgSrc(data);
    });
  }, [icon]);

  const getAchievementClass = (percent: number): string => {
    if (percent <= 5) return 'rare1';
    if (percent <= 20) return 'rare2';
    if (percent <= 45) return 'rare3';
    if (percent <= 60) return 'rare4';
    return 'rare5';
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleString();
  };

  const title = [
    gameName,
    displayName,
    description,
    `${percent.toFixed(2)}%`,
    formatDate(unlockedDate)
  ]
    .filter(Boolean)
    .join('\n');

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image load error:', {
      icon,
      src: e.currentTarget.src,
      name,
      displayName
    });
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image loaded successfully:', {
      src: e.currentTarget.src,
      name,
      displayName
    });
  };

  return (
    <div className="Cont">
      {imgSrc && (
        <img
          className={getAchievementClass(percent)}
          src={imgSrc}
          alt={displayName}
          title={title}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
    </div>
  );
};

export default AchievementImage;
