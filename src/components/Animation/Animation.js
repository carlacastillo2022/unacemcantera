import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAnimation, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Animation = ({
  children,
  typeAnimation,
  durationAnimation,
  handleAnimation,
  startAnimation,
  onAnimationComplete,
}) => {
  const variantsSlide = {
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: durationAnimation ? durationAnimation : 1 },
    },
    hidden: { opacity: 0, x: -100 },
  };

  const variantsFade = {
    visible: {
      opacity: 1,
      transition: { duration: durationAnimation ? durationAnimation : 1 },
    },
    hidden: { opacity: 0 },
  };

  const controls = useAnimation();
  const [ref, inView] = useInView();

  if (handleAnimation && startAnimation) controls.start('visible');

  useEffect(() => {
    if (inView && !handleAnimation) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={typeAnimation === 'slide' ? variantsSlide : variantsFade}
      onAnimationComplete={() => onAnimationComplete && onAnimationComplete()}
    >
      {children}
    </motion.div>
  );
};

Animation.propTypes = {
  onAnimationComplete: PropTypes.func,
  handleAnimation: PropTypes.bool,
  startAnimation: PropTypes.bool,
  children: PropTypes.node,
  typeAnimation: PropTypes.oneOf(['slide', 'fade']),
  durationAnimation: PropTypes.number,
};
export default Animation;
