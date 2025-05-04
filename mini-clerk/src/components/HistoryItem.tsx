
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface HistoryItemProps {
  id: string;
  prompt: string;
  timestamp: Date;
  onClick: () => void;
}

const HistoryItem = ({ prompt, timestamp, onClick }: HistoryItemProps) => {
  const formattedTime = formatDistanceToNow(timestamp, { addSuffix: true });
  
  // Truncate the prompt if it's too long
  const truncatedPrompt = 
    prompt.length > 60 ? `${prompt.substring(0, 60)}...` : prompt;
    
  return (
    <motion.div 
      className="p-3 rounded-md hover:bg-sidebar-accent cursor-pointer transition-all duration-200"
      onClick={onClick}
      whileHover={{ 
        x: 5,
        backgroundColor: 'var(--sidebar-accent)',
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-sm font-medium">{truncatedPrompt}</p>
      <p className="text-xs text-sidebar-foreground/70 mt-1">{formattedTime}</p>
    </motion.div>
  );
};

export default HistoryItem;
