import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PromptInput from '@/components/PromptInput';
import SqlOutput from '@/components/SqlOutput';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [sql, setSql] = useState('');
  const [explanation, setExplanation] = useState('');
  const [queryHistory, setQueryHistory] = useState([]);
  const [tableData, setTableData] = useState(null);
  const [tableColumns, setTableColumns] = useState([]);
  const { toast } = useToast();

  // Example suggestions
  const suggestions = [
    "Show me all customers who made a purchase in the last month",
    "Find all orders with total value above $1000",
    "List the top 5 products by sales volume",
    "Show all employees in the IT department hired after 2020",
    "Count the number of orders per customer in descending order"
  ];

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('queryHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert string timestamps back to Date objects
        const historyWithDates = parsedHistory.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setQueryHistory(historyWithDates);
      } catch (error) {
        console.error('Failed to parse saved history', error);
        toast({
          title: "Error Loading History",
          description: "Could not load your previous queries.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);
  
  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (queryHistory.length > 0) {
      localStorage.setItem('queryHistory', JSON.stringify(queryHistory));
    }
  }, [queryHistory]);
  
  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    handleResize(); // Run once on load
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePromptSubmit = (inputPrompt) => {
    setPrompt(inputPrompt);
    setIsLoading(true);
    
    // Simulate API call to generate SQL
    setTimeout(() => {
      try {
        // Mock response based on the prompt
        let generatedSql = '';
        let generatedExplanation = '';
        let tableData = null;
        let tableColumns = [];
        
        // Check if the prompt is about creating a table
        if (inputPrompt.toLowerCase().includes('create table') || 
            inputPrompt.toLowerCase().includes('create a table') ||
            inputPrompt.toLowerCase().includes('make a table') ||
            inputPrompt.toLowerCase().includes('create table named')) {
          // Extract table name and columns from the prompt
          const tableName = inputPrompt.match(/table\s+(?:named\s+)?(\w+)/i)?.[1] || 'table_name';
          const columns = inputPrompt.match(/columns?\s+([^.]+)/i)?.[1] || 'id INT, name VARCHAR(255)';
          
          generatedSql = `CREATE TABLE ${tableName} (\n  ${columns}\n);`;
          generatedExplanation = `This query creates a new table named '${tableName}' with the specified columns.`;
          
          // Generate mock data for the new table
          const mockColumns = columns.split(',').map(col => {
            const [name, type] = col.trim().split(/\s+/);
            return { name, type };
          });
          
          const mockData = [];
          for (let i = 1; i <= 5; i++) {
            const row = {};
            mockColumns.forEach(column => {
              switch (column.type.toLowerCase()) {
                case 'int':
                  row[column.name] = i;
                  break;
                case 'varchar':
                case 'text':
                  row[column.name] = `Sample ${column.name} ${i}`;
                  break;
                case 'date':
                  row[column.name] = new Date().toISOString().split('T')[0];
                  break;
                case 'boolean':
                  row[column.name] = i % 2 === 0;
                  break;
                default:
                  row[column.name] = `Value ${i}`;
              }
            });
            mockData.push(row);
          }
          
          tableData = mockData;
          tableColumns = mockColumns.map(col => col.name);
        } else {
          // For any other prompt, generate a sample query and table
          const tableName = 'sample_table';
          const columns = ['id', 'name', 'description', 'value', 'created_at'];
          
          generatedSql = `SELECT * FROM ${tableName};\n-- This is a sample query based on your prompt: "${inputPrompt}"`;
          generatedExplanation = `This is a sample query showing how to retrieve data from a table.`;
          
          // Generate sample data
          tableData = [
            { id: 1, name: 'Sample Item 1', description: 'This is a sample description', value: 100, created_at: '2023-01-01' },
            { id: 2, name: 'Sample Item 2', description: 'Another sample description', value: 200, created_at: '2023-01-02' },
            { id: 3, name: 'Sample Item 3', description: 'Yet another sample', value: 300, created_at: '2023-01-03' },
            { id: 4, name: 'Sample Item 4', description: 'More sample data', value: 400, created_at: '2023-01-04' },
            { id: 5, name: 'Sample Item 5', description: 'Final sample item', value: 500, created_at: '2023-01-05' }
          ];
          tableColumns = columns;
        }
        
        // Update state with the generated SQL and table data
        setSql(generatedSql);
        setExplanation(generatedExplanation);
        setTableData(tableData);
        setTableColumns(tableColumns);
        setIsLoading(false);
        
        // Add to query history
        const newQuery = {
          id: uuidv4(),
          prompt: inputPrompt,
          sql: generatedSql,
          explanation: generatedExplanation,
          tableData,
          tableColumns,
          timestamp: new Date()
        };
        setQueryHistory(prev => [newQuery, ...prev]);
        
        // Show success toast
        toast({
          title: "SQL Generated",
          description: "Your SQL query has been generated successfully",
        });
      } catch (error) {
        setIsLoading(false);
        toast({
          title: "Generation Failed",
          description: "There was an error generating your SQL query.",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const handleSelectQuery = (id) => {
    const selectedQuery = queryHistory.find(q => q.id === id);
    if (selectedQuery) {
      setPrompt(selectedQuery.prompt);
      setSql(selectedQuery.sql);
      setExplanation(selectedQuery.explanation);
      setTableData(selectedQuery.tableData);
      setTableColumns(selectedQuery.tableColumns);
      
      toast({
        title: "Query Loaded",
        description: "Previous query loaded from history",
      });
      
      // On mobile, close sidebar after selection
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar 
          isOpen={isSidebarOpen} 
          queryHistory={queryHistory}
          onSelectQuery={handleSelectQuery}
        />
        
        <motion.main 
          className={`flex-1 p-4 md:p-6 transition-all duration-300 ${
            isSidebarOpen ? 'md:ml-72' : ''
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div 
              className="text-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-2">
                Transform <span className="text-primary">Natural Language</span> to <span className="text-primary">SQL</span>
              </h1>
              <p className="text-muted-foreground">
                Type your request in plain English and get the SQL query you need
              </p>
            </motion.div>
            
            <div className="space-y-6">
              <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-lg font-medium mb-3">What do you want to query?</h2>
                <PromptInput 
                  onSubmit={handlePromptSubmit}
                  isLoading={isLoading}
                  suggestions={suggestions}
                />
              </motion.section>
              
              <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-lg font-medium mb-3">Generated SQL Query</h2>
                <SqlOutput 
                  sql={sql} 
                  explanation={explanation}
                  isLoading={isLoading}
                  tableData={tableData}
                  tableColumns={tableColumns}
                />
              </motion.section>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Index; 