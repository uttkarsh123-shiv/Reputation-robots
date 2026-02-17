import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loading;
