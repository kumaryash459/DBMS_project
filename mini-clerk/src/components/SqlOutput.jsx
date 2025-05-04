import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Copy, CheckCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import TableDisplay from './TableDisplay';

// Register the SQL language
SyntaxHighlighter.registerLanguage('sql', sql);

// Hardcoded table data
const hardcodedTables = {
  'employees': {
    columns: ['id', 'name', 'age', 'department', 'salary', 'hire_date'],
    data: [
      { id: 1, name: 'John Doe', age: 30, department: 'IT', salary: 75000, hire_date: '2020-01-15' },
      { id: 2, name: 'Jane Smith', age: 28, department: 'HR', salary: 65000, hire_date: '2021-03-20' },
      { id: 3, name: 'Mike Johnson', age: 35, department: 'Finance', salary: 85000, hire_date: '2019-11-10' },
      { id: 4, name: 'Sarah Williams', age: 32, department: 'Marketing', salary: 70000, hire_date: '2020-06-05' },
      { id: 5, name: 'David Brown', age: 40, department: 'IT', salary: 90000, hire_date: '2018-09-12' }
    ]
  },
  'customers': {
    columns: ['customer_id', 'name', 'email', 'phone', 'address', 'join_date'],
    data: [
      { customer_id: 101, name: 'Alice Cooper', email: 'alice@example.com', phone: '123-456-7890', address: '123 Main St', join_date: '2022-01-10' },
      { customer_id: 102, name: 'Bob Wilson', email: 'bob@example.com', phone: '234-567-8901', address: '456 Oak Ave', join_date: '2022-02-15' },
      { customer_id: 103, name: 'Carol Davis', email: 'carol@example.com', phone: '345-678-9012', address: '789 Pine Rd', join_date: '2022-03-20' },
      { customer_id: 104, name: 'Dave Miller', email: 'dave@example.com', phone: '456-789-0123', address: '321 Elm St', join_date: '2022-04-25' },
      { customer_id: 105, name: 'Eve Taylor', email: 'eve@example.com', phone: '567-890-1234', address: '654 Maple Dr', join_date: '2022-05-30' }
    ]
  },
  'products': {
    columns: ['product_id', 'name', 'category', 'price', 'stock', 'created_at'],
    data: [
      { product_id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 50, created_at: '2021-01-01' },
      { product_id: 2, name: 'Smartphone', category: 'Electronics', price: 699.99, stock: 100, created_at: '2021-02-01' },
      { product_id: 3, name: 'Headphones', category: 'Electronics', price: 199.99, stock: 200, created_at: '2021-03-01' },
      { product_id: 4, name: 'Tablet', category: 'Electronics', price: 499.99, stock: 75, created_at: '2021-04-01' },
      { product_id: 5, name: 'Smartwatch', category: 'Electronics', price: 299.99, stock: 150, created_at: '2021-05-01' }
    ]
  }
};

const SqlOutput = ({ sql, explanation, isLoading, tableData, tableColumns }) => {
  const { toast } = useToast();
  const [showExplanation, setShowExplanation] = useState(false);
  const [displayedSql, setDisplayedSql] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check theme preference for syntax highlighting
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
    
    // Add event listener for theme changes
    const handleThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    document.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      document.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);
  
  useEffect(() => {
    if (sql && !isLoading) {
      setIsTyping(true);
      let i = 0;
      setDisplayedSql('');
      
      // Simulate typing effect
      const typing = setInterval(() => {
        setDisplayedSql(sql.substring(0, i));
        i++;
        
        if (i > sql.length) {
          clearInterval(typing);
          setIsTyping(false);
        }
      }, 20);
      
      return () => clearInterval(typing);
    }
  }, [sql, isLoading]);
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "SQL query has been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (isLoading) {
    return (
      <div className="rounded-lg bg-accent/50 p-8 animate-pulse flex items-center justify-center min-h-[250px]">
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <p className="text-lg font-medium">Generating SQL query...</p>
          <p className="text-sm text-muted-foreground mt-2">Converting natural language to SQL</p>
        </div>
      </div>
    );
  }
  
  if (!sql) {
    return (
      <div className="rounded-lg bg-accent/50 p-8 flex items-center justify-center min-h-[250px]">
        <div className="text-center">
          <svg 
            className="mx-auto h-12 w-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium">No query generated yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Type a prompt above to generate a SQL query
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card transform transition-all duration-200 hover:shadow-md">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h3 className="font-medium">Generated SQL</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExplanation(!showExplanation)}
              className="transition-colors duration-200"
            >
              {showExplanation ? 'Hide' : 'Show'} Explanation
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyToClipboard}
              className="transition-all duration-200"
            >
              {copied ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="p-4 relative">
          <SyntaxHighlighter
            language="sql"
            style={isDarkMode ? atomOneDark : atomOneLight}
            customStyle={{
              margin: 0,
              padding: '1rem',
              borderRadius: '0.375rem',
              fontSize: '0.9rem',
              lineHeight: 1.5
            }}
            wrapLines={true}
            wrapLongLines={true}
          >
            {displayedSql}
          </SyntaxHighlighter>
          {isTyping && (
            <div className="absolute bottom-4 right-4 h-4 w-1 bg-primary animate-blink"></div>
          )}
        </div>
        
        {showExplanation && explanation && (
          <div className="p-4 border-t border-border bg-accent/50 animate-fade-in">
            <h4 className="font-medium mb-2">Explanation</h4>
            <p className="text-sm">{explanation}</p>
          </div>
        )}
      </div>

      {tableData && tableColumns && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Query Results</h3>
          <div className="rounded-lg border border-border bg-card p-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {tableColumns.map((column, index) => (
                    <th key={index} className="text-left p-2 font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-border hover:bg-accent/50">
                    {tableColumns.map((column, colIndex) => (
                      <td key={colIndex} className="p-2">
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SqlOutput; 