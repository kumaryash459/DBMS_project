
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PromptInput from '@/components/PromptInput';
import SqlOutput from '@/components/SqlOutput';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

interface QueryHistory {
  id: string;
  prompt: string;
  sql: string;
  explanation: string;
  timestamp: Date;
}

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [sql, setSql] = useState('');
  const [explanation, setExplanation] = useState('');
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([]);
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
        const historyWithDates = parsedHistory.map((item: any) => ({
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

  const handlePromptSubmit = (inputPrompt: string) => {
    setPrompt(inputPrompt);
    setIsLoading(true);
    
    // Simulate API call to generate SQL
    setTimeout(() => {
      try {
        // Mock response based on the prompt
        let generatedSql = '';
        let generatedExplanation = '';
        
        // Very simple mock logic to generate different SQL based on the prompt
        if (inputPrompt.toLowerCase().includes('customer')) {
          generatedSql = `SELECT c.customer_id, c.name, c.email, COUNT(o.order_id) as order_count\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id\nWHERE o.purchase_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)\nGROUP BY c.customer_id\nORDER BY order_count DESC;`;
          generatedExplanation = "This query selects customer information and counts their orders from the past month. It joins the customers and orders tables, filters for recent purchases, and sorts by the number of orders.";
        } else if (inputPrompt.toLowerCase().includes('order')) {
          generatedSql = `SELECT o.order_id, o.order_date, c.name as customer_name, o.total_amount\nFROM orders o\nJOIN customers c ON o.customer_id = c.customer_id\nWHERE o.total_amount > 1000\nORDER BY o.total_amount DESC;`;
          generatedExplanation = "This query finds all orders with a total value above $1,000. It joins the orders table with customers to show who placed each order, and sorts the results by the order amount in descending order.";
        } else if (inputPrompt.toLowerCase().includes('product')) {
          generatedSql = `SELECT p.product_id, p.name, p.category, SUM(oi.quantity) as total_sold\nFROM products p\nJOIN order_items oi ON p.product_id = oi.product_id\nJOIN orders o ON oi.order_id = o.order_id\nGROUP BY p.product_id\nORDER BY total_sold DESC\nLIMIT 5;`;
          generatedExplanation = "This query identifies the top 5 best-selling products. It joins the products table with order_items to calculate the total quantity sold for each product, then limits the results to the top 5 products by sales volume.";
        } else if (inputPrompt.toLowerCase().includes('employee')) {
          generatedSql = `SELECT e.employee_id, e.first_name, e.last_name, e.email, e.hire_date\nFROM employees e\nJOIN departments d ON e.department_id = d.department_id\nWHERE d.name = 'IT' AND e.hire_date >= '2020-01-01'\nORDER BY e.hire_date ASC;`;
          generatedExplanation = "This query lists all employees in the IT department who were hired after January 1, 2020. It joins the employees and departments tables, filters by department name and hire date, and sorts the results by hire date.";
        } else {
          generatedSql = `-- Generated SQL based on: "${inputPrompt}"\nSELECT *\nFROM table_name\nWHERE condition = true\nLIMIT 10;`;
          generatedExplanation = "This is a basic SQL query template. Replace 'table_name' with your actual table and 'condition' with your specific filtering criteria.";
        }
        
        // Update state with the generated SQL
        setSql(generatedSql);
        setExplanation(generatedExplanation);
        setIsLoading(false);
        
        // Add to query history
        const newQuery = {
          id: uuidv4(),
          prompt: inputPrompt,
          sql: generatedSql,
          explanation: generatedExplanation,
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

  const handleSelectQuery = (id: string) => {
    const selectedQuery = queryHistory.find(q => q.id === id);
    if (selectedQuery) {
      setPrompt(selectedQuery.prompt);
      setSql(selectedQuery.sql);
      setExplanation(selectedQuery.explanation);
      
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
