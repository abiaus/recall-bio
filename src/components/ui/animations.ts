import { Variants } from "framer-motion";

// Stagger container for children
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Organic entrance animation (from bottom with spring)
export const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      damping: 20, 
      stiffness: 100 
    }
  },
};

// Floating blob animation
export const floatVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [0, 5, 0, -5, 0],
    transition: { 
      duration: 8, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  }
};

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 120,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.2,
    },
  },
};

// Card hover variants
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: "0 12px 40px rgba(196, 144, 124, 0.15)",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
};

// Glow pulse animation
export const glowVariants: Variants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(196, 144, 124, 0.3)",
      "0 0 40px rgba(196, 144, 124, 0.5)",
      "0 0 20px rgba(196, 144, 124, 0.3)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Scale on press
export const pressVariants: Variants = {
  rest: { scale: 1 },
  press: { scale: 0.95 },
};

// Fade in from bottom
export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};
