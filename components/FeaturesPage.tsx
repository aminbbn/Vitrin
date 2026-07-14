import React from 'react';
import { FeaturesHero } from './FeaturesHero';
import { ModuleNavigator } from './ModuleNavigator';
import { DesignStudioModule } from './DesignStudioModule';
import { ProductManagementModule } from './ProductManagementModule';
import { CustomerJourneyModule } from './CustomerJourneyModule';
import { OrderManagementModule } from './OrderManagementModule';
import { ComparisonSection } from './ComparisonSection';
import { FeaturesFinalCTA } from './FeaturesFinalCTA';
import { MarketingFooter } from './MarketingFooter';
import { useTheme } from './ThemeProvider';

interface FeaturesPageProps {
  onLoginClick: () => void;
  onStartFreeClick: () => void;
  onNavigateHome: () => void;
  onNavigateSolutions?: () => void;
  theme?: 'light' | 'dark';
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ 
  onLoginClick, 
  onStartFreeClick, 
  onNavigateHome,
  onNavigateSolutions,
  theme: propTheme
}) => {
  const { theme: globalTheme } = useTheme();
  const resolvedTheme = propTheme || globalTheme;

  return (
    <div 
      className="min-h-screen bg-[#F5F7F6] dark:bg-[#080A09] text-slate-900 dark:text-slate-100 font-['Vazirmatn'] selection:bg-[#10b981]/10 selection:text-[#10b981] overflow-x-hidden leading-relaxed transition-colors duration-300"
      style={{ direction: 'rtl' }}
    >
      
      {/* 1. Brand Cinematic Hero with Feature Atlas */}
      <FeaturesHero 
        onStartFreeClick={onStartFreeClick} 
        theme={resolvedTheme} 
      />

      {/* 2. Sticky Module Navigation Rail */}
      <ModuleNavigator theme={resolvedTheme} />

      {/* 3. Core Modules (The 4 connected pillars of the operating system) */}
      <div className="space-y-0">
        
        {/* Module A: Menu Design Studio */}
        <DesignStudioModule theme={resolvedTheme} />

        {/* Module B: Product Management with Real-Time Previews */}
        <ProductManagementModule theme={resolvedTheme} />

        {/* Module C: Interactive Customer Journey & Mobile Screens */}
        <CustomerJourneyModule theme={resolvedTheme} />

        {/* Module D: Smart Kitchen Order Stepper & Print Emulator */}
        <OrderManagementModule theme={resolvedTheme} />

      </div>

      {/* 4. Tabular Before/After Comparison Grid */}
      <ComparisonSection theme={resolvedTheme} />

      {/* 5. Direct and Impactful Final Call to Action */}
      <FeaturesFinalCTA 
        onStartFreeClick={onStartFreeClick} 
        theme={resolvedTheme} 
      />

      {/* 6. Unified Theme-Aware Marketing Footer */}
      <MarketingFooter 
        onNavigateHome={onNavigateHome} 
        onNavigateSolutions={onNavigateSolutions} 
        theme={resolvedTheme} 
      />

    </div>
  );
};
