
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Loader2 } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  suggestions: string[];
}

const PromptInput = ({ onSubmit, isLoading, suggestions }: PromptInputProps) => {
  const [prompt, setPrompt] = useState('');
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  useEffect(() => {
    // Cycle through suggestions every 5 seconds
    if (!isLoading && suggestions.length > 0) {
      const interval = setInterval(() => {
        setActiveSuggestion((prev) => (prev + 1) % suggestions.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isLoading, suggestions.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Textarea
            placeholder={suggestions[activeSuggestion] || "Describe the SQL query you need..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full min-h-[100px] p-4 border rounded-lg bg-card text-card-foreground resize-y focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200"
            disabled={isLoading}
          />
          
          <Button 
            type="submit" 
            className="absolute bottom-4 right-4 transition-all duration-200 hover:scale-105"
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Generating</span>
              </div>
            ) : (
              "Generate SQL"
            )}
          </Button>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-card border border-border shadow-lg rounded-lg p-2 animate-fade-in">
            <p className="px-2 py-1 text-sm text-muted-foreground">Suggestions:</p>
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="px-2 py-2 hover:bg-accent rounded cursor-pointer flex items-start transition-colors duration-200 hover:translate-x-1"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="suggestion-bullet mt-1.5"></span>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default PromptInput;
