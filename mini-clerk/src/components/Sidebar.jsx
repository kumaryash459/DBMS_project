import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import HistoryItem from './HistoryItem';

const Sidebar = ({ isOpen, queryHistory, onSelectQuery }) => {
  return (
    <aside 
      className={`bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-[calc(100vh-4rem)] fixed left-0 top-16 z-10 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:w-72 md:translate-x-0'
      }`}
    >
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="font-semibold text-lg">History</h2>
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-2">
          {queryHistory.length > 0 ? (
            queryHistory.map((item) => (
              <HistoryItem
                key={item.id}
                id={item.id}
                prompt={item.prompt}
                timestamp={item.timestamp}
                onClick={() => onSelectQuery(item.id)}
              />
            ))
          ) : (
            <div className="text-center text-sidebar-foreground/70 py-8">
              <p>No history yet</p>
              <p className="text-sm mt-2">Your queries will appear here</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar; 