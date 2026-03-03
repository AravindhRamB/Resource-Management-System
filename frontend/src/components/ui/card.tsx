"use client";
import { Card } from 'antd';
import { CustomCardProps } from '@/module/component';
import React from 'react';

const { Meta } = Card;

export function CustomCard({
  title,
  description,
  icon,
  isClickable = false,
  onClick,
  
  className = '',
}: CustomCardProps) {
  // Base classes for the card
  const baseClasses = "transition-all duration-200";
  const interactiveClasses = isClickable 
    ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg" 
    : "cursor-default";
  
  // Combine all classes
  const cardClasses = `${baseClasses} ${interactiveClasses} ${className}`;

 

  return (
    <Card
      hoverable={isClickable}
      
      className={cardClasses}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="flex items-center h-full">
        <div className="mr-4 flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <Meta title={title} description={description} />
        </div>
      </div>
    </Card>
  );
}