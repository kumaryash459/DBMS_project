import React from 'react';
import { motion } from 'framer-motion';

const TableDisplay = ({ data, columns }) => {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-center">
        <p className="text-muted-foreground">No data to display</p>
      </div>
    );
  }
  return (
    <motion.div 
      className="rounded-lg border border-border bg-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-accent/50">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="px-4 py-2 text-left text-sm font-medium text-accent-foreground"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className="border-t border-border hover:bg-accent/30 transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={`${rowIndex}-${colIndex}`}
                    className="px-4 py-2 text-sm"
                  >
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TableDisplay; 