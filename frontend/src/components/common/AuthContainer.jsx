import React from 'react';
import layoutStyles from '../../styles/Layout.module.css';
import cardStyles from '../../styles/Card.module.css';
import Card from './Card';

const AuthContainer = ({ 
  children, 
  maxWidth = '400px',
  cardStyle = {},
  containerStyle = {}
}) => {
  return (
    <div 
      className={layoutStyles.containerCentered}
      style={containerStyle}
    >
      <Card 
        className={cardStyles.cardMedium}
        style={{
          maxWidth,
          ...cardStyle
        }}
      >
        {children}
      </Card>
    </div>
  );
};

export default AuthContainer;

