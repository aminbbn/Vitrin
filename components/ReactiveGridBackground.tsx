import React from 'react';
import { ReactiveVitrinField } from './ReactiveVitrinField';

interface ReactiveGridBackgroundProps {
  containerRef?: React.RefObject<HTMLDivElement | null>;
  intensity?: 'quiet' | 'normal' | 'hero';
}

export const ReactiveGridBackground: React.FC<ReactiveGridBackgroundProps> = ({ intensity = 'normal' }) => {
  return <ReactiveVitrinField intensity={intensity} />;
};
