import React, { useRef, useEffect } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

// ==========================================
// SYSTEM-WIDE EASING AND SPRING CONSTANTS
// ==========================================
export const PRIMARY_EASE = [0.16, 1, 0.3, 1]; // Premium cubic-bezier
export const SPRING_PRESET = {
  type: "spring",
  stiffness: 180,
  damping: 22,
  mass: 0.8
};

// Global Motion Configuration
export const globalTransition = (delay = 0, duration = 0.65) => ({
  ease: PRIMARY_EASE,
  duration,
  delay
});

// ==========================================
// SHARED MOTION VARIANTS FOR REUSE
// ==========================================
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (custom: { delay?: number; duration?: number } = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      ease: PRIMARY_EASE,
      duration: custom.duration || 0.65,
      delay: custom.delay || 0
    }
  })
};

export const fadeDown = {
  hidden: { opacity: 0, y: -24 },
  visible: (custom: { delay?: number; duration?: number } = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      ease: PRIMARY_EASE,
      duration: custom.duration || 0.65,
      delay: custom.delay || 0
    }
  })
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: (custom: { delay?: number; duration?: number } = {}) => ({
    opacity: 1,
    x: 0,
    transition: {
      ease: PRIMARY_EASE,
      duration: custom.duration || 0.65,
      delay: custom.delay || 0
    }
  })
};

export const fadeRight = {
  hidden: { opacity: 0, x: 24 },
  visible: (custom: { delay?: number; duration?: number } = {}) => ({
    opacity: 1,
    x: 0,
    transition: {
      ease: PRIMARY_EASE,
      duration: custom.duration || 0.65,
      delay: custom.delay || 0
    }
  })
};

export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (custom: { delay?: number; duration?: number } = {}) => ({
    opacity: 1,
    scale: 1,
    transition: {
      ease: PRIMARY_EASE,
      duration: custom.duration || 0.7,
      delay: custom.delay || 0
    }
  })
};

export const blurReveal = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 16 },
  visible: (custom: { delay?: number; duration?: number } = {}) => ({
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      ease: PRIMARY_EASE,
      duration: custom.duration || 0.8,
      delay: custom.delay || 0
    }
  })
};

// ==========================================
// 1. REVEAL COMPONENT
// ==========================================
interface RevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
  amount?: number;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  className = '',
  amount = 0.15
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount }}
        transition={{ duration: 0.15, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  const getInitial = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: 30 };
      case 'down': return { opacity: 0, y: -30 };
      case 'left': return { opacity: 0, x: -30 };
      case 'right': return { opacity: 0, x: 30 };
      case 'none': return { opacity: 0 };
    }
  };

  const getAnimate = () => {
    switch (direction) {
      case 'up':
      case 'down': return { opacity: 1, y: 0 };
      case 'left':
      case 'right': return { opacity: 1, x: 0 };
      case 'none': return { opacity: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once: true, amount, margin: "0px 0px -10% 0px" }}
      transition={{ ease: PRIMARY_EASE, duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// 2. STAGGER GROUP COMPONENT
// ==========================================
interface StaggerGroupProps {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
}

export const StaggerGroup: React.FC<StaggerGroupProps> = ({
  children,
  stagger = 0.1,
  delay = 0,
  className = ''
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerChildProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
  className?: string;
}

export const StaggerChild: React.FC<StaggerChildProps> = ({
  children,
  direction = 'up',
  className = ''
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const fadeOnlyVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.15 } }
    };
    return (
      <motion.div variants={fadeOnlyVariants} className={className}>
        {children}
      </motion.div>
    );
  }

  const getVariants = () => {
    switch (direction) {
      case 'up':
        return {
          hidden: { opacity: 0, y: 24 },
          visible: { opacity: 1, y: 0, transition: { ease: PRIMARY_EASE, duration: 0.6 } }
        };
      case 'down':
        return {
          hidden: { opacity: 0, y: -24 },
          visible: { opacity: 1, y: 0, transition: { ease: PRIMARY_EASE, duration: 0.6 } }
        };
      case 'left':
        return {
          hidden: { opacity: 0, x: -24 },
          visible: { opacity: 1, x: 0, transition: { ease: PRIMARY_EASE, duration: 0.6 } }
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: 24 },
          visible: { opacity: 1, x: 0, transition: { ease: PRIMARY_EASE, duration: 0.6 } }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.94 },
          visible: { opacity: 1, scale: 1, transition: { ease: PRIMARY_EASE, duration: 0.6 } }
        };
      case 'none':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { ease: PRIMARY_EASE, duration: 0.6 } }
        };
    }
  };

  return (
    <motion.div variants={getVariants()} className={className}>
      {children}
    </motion.div>
  );
};

// ==========================================
// 3. ANIMATED HEADING
// ==========================================
interface AnimatedHeadingProps {
  text: string;
  className?: string;
  mode?: 'words' | 'lines' | 'character';
  delay?: number;
  highlightWords?: string[];
  highlightClass?: string;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  className = '',
  mode = 'words',
  delay = 0,
  highlightWords = [],
  highlightClass = 'text-[#10b981]'
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <h2 className={className}>{text}</h2>;
  }

  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        ease: PRIMARY_EASE,
        duration: 0.6
      }
    }
  };

  return (
    <motion.h2
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={`${className} flex flex-wrap gap-x-[0.3em] gap-y-1`}
    >
      {words.map((word, i) => {
        // Clean word for matching highlights
        const cleanWord = word.replace(/[؛،؟.!]/g, '');
        const isHighlight = highlightWords.some(h => cleanWord.includes(h) || h.includes(cleanWord));

        return (
          <span key={i} className="inline-block overflow-hidden py-1">
            <motion.span
              variants={wordVariants}
              className={`inline-block ${isHighlight ? highlightClass : ''}`}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </motion.h2>
  );
};

// ==========================================
// 4. ANIMATED ICON
// ==========================================
interface AnimatedIconProps {
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  hoverType?: 'rotate' | 'scale' | 'bounce' | 'pulse';
  delay?: number;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon: IconComponent,
  className = '',
  hoverType = 'scale',
  delay = 0
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <IconComponent className={className} />;
  }

  const getHoverProps = () => {
    switch (hoverType) {
      case 'rotate':
        return { rotate: 12, scale: 1.1 };
      case 'bounce':
        return { y: -3, scale: 1.05 };
      case 'pulse':
        return { scale: 1.1, filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.3))' };
      case 'scale':
      default:
        return { scale: 1.12 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      whileHover={getHoverProps()}
      transition={SPRING_PRESET}
      className="inline-block shrink-0"
    >
      <IconComponent className={className} />
    </motion.div>
  );
};

// ==========================================
// 5. ANIMATED CARD
// ==========================================
interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  hoverLift?: boolean;
  spotlight?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  hoverLift = true,
  spotlight = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mouse spotlight tracking state
  useEffect(() => {
    if (!spotlight || shouldReduceMotion || window.innerWidth < 768) return;
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, [spotlight, shouldReduceMotion]);

  const shouldAnimate = !shouldReduceMotion;

  const getInitial = () => {
    if (!shouldAnimate) return { opacity: 0 };
    switch (direction) {
      case 'up': return { opacity: 0, y: 35, scale: 0.96, filter: 'blur(4px)' };
      case 'down': return { opacity: 0, y: -35, scale: 0.96, filter: 'blur(4px)' };
      case 'left': return { opacity: 0, x: -35, scale: 0.96, filter: 'blur(4px)' };
      case 'right': return { opacity: 0, x: 35, scale: 0.96, filter: 'blur(4px)' };
      case 'scale': return { opacity: 0, scale: 0.94, filter: 'blur(4px)' };
    }
  };

  const getAnimate = () => {
    if (!shouldAnimate) return { opacity: 1 };
    return {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: 'blur(0px)'
    };
  };

  return (
    <motion.div
      ref={cardRef}
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      whileHover={shouldAnimate && hoverLift ? { y: -4, borderColor: 'rgba(16, 185, 129, 0.35)' } : undefined}
      transition={{ ease: PRIMARY_EASE, duration: 0.75, delay }}
      className={`relative overflow-hidden transition-all duration-300 ${className} group`}
    >
      {/* Subtle pointer-following gradient for desktop spotlight */}
      {spotlight && !shouldReduceMotion && (
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.05), transparent 80%)`,
            zIndex: 1
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

// ==========================================
// 6. MOTION BUTTON
// ==========================================
interface MotionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'none';
  id?: string;
  href?: string;
}

export const MotionButton: React.FC<MotionButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'none',
  id,
  href
}) => {
  const shouldReduceMotion = useReducedMotion();

  const getHoverStyle = () => {
    if (shouldReduceMotion) return {};
    return { y: -2 };
  };

  const getPressStyle = () => {
    if (shouldReduceMotion) return {};
    return { scale: 0.97 };
  };

  const content = (
    <motion.div
      whileHover={getHoverStyle()}
      whileTap={getPressStyle()}
      transition={SPRING_PRESET}
      className="inline-flex items-center justify-center gap-2.5 w-full h-full"
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className={className} id={id}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className} id={id} style={{ border: 0 }}>
      {content}
    </button>
  );
};

// ==========================================
// 7. GLOBAL SCROLL PROGRESS INDICATOR
// ==========================================
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-[#10b981] z-[9999] origin-right"
    />
  );
};

// ==========================================
// 8. MOTION SECTION CONTAINER
// ==========================================
interface MotionSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const MotionSection: React.FC<MotionSectionProps> = ({
  children,
  id,
  className = ''
}) => {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      {children}
    </section>
  );
};
