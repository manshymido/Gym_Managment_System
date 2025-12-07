import React, { memo } from 'react';
import cardStyles from '../../styles/Card.module.css';

const Card = ({
  children,
  title,
  subtitle,
  padding,
  hover = false,
  className = '',
  style = {},
  ...props
}) => {
  const classes = [
    cardStyles.card,
    hover && cardStyles.cardHover,
    className
  ].filter(Boolean).join(' ');

  const cardStyle = {
    ...(padding && { padding }),
    ...style
  };

  return (
    <div
      className={classes}
      style={cardStyle}
      {...props}
    >
      {title && (
        <div className={subtitle ? cardStyles.cardTitleContainerWithSubtitle : cardStyles.cardTitleContainer}>
          <h3 className={cardStyles.cardTitle}>
            {title}
          </h3>
          {subtitle && (
            <p className={cardStyles.cardSubtitle}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default memo(Card);

