import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users, Sparkles, Code } from 'lucide-react';

const About = () => {
  const [openSection, setOpenSection] = useState('mission');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const teamMembers = [
    {
      name: 'Mahantesh',
      role: 'Frontend Developer',
      description: 'Specializes in creating beautiful and responsive user interfaces using React and modern web technologies.',
      icon: Code
    },
    {
      name: 'Yash',
      role: 'Full Stack Developer',
      description: 'Expert in both frontend and backend development, bringing the entire application together seamlessly.',
      icon: Sparkles
    },
    {
      name: 'Ramya',
      role: 'AI Specialist',
      description: 'Leads the AI and machine learning initiatives, focusing on natural language processing and query optimization.',
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar toggleSidebar={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-6 text-center"
          >
            About Prompt2Query
          </motion.h1>

          {/* Mission Section */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => toggleSection('mission')}
              className="w-full flex items-center justify-between p-4 bg-card rounded-lg shadow-sm hover:bg-card/80 transition-colors"
            >
              <h2 className="text-2xl font-semibold">Our Mission</h2>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openSection === 'mission' ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {openSection === 'mission' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-card/50 rounded-b-lg p-4"
                >
                  <p className="text-muted-foreground">
                    Prompt2Query aims to revolutionize database querying by making it accessible to everyone. 
                    We bridge the gap between natural language and SQL, enabling users to interact with their 
                    databases more intuitively and efficiently.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Features Section */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => toggleSection('features')}
              className="w-full flex items-center justify-between p-4 bg-card rounded-lg shadow-sm hover:bg-card/80 transition-colors"
            >
              <h2 className="text-2xl font-semibold">Key Features</h2>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openSection === 'features' ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {openSection === 'features' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-card/50 rounded-b-lg p-4"
                >
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 mt-1 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</div>
                      <div>
                        <h3 className="font-medium">Natural Language Processing</h3>
                        <p className="text-muted-foreground">Convert plain English to SQL with high accuracy</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 mt-1 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</div>
                      <div>
                        <h3 className="font-medium">Query Optimization</h3>
                        <p className="text-muted-foreground">Automatically optimized queries for better performance</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 mt-1 rounded-full bg-primary/20 flex items-center justify-center text-primary">✓</div>
                      <div>
                        <h3 className="font-medium">Educational Resources</h3>
                        <p className="text-muted-foreground">Learn SQL through our comprehensive documentation</p>
                      </div>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Team Section */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => toggleSection('team')}
              className="w-full flex items-center justify-between p-4 bg-card rounded-lg shadow-sm hover:bg-card/80 transition-colors"
            >
              <h2 className="text-2xl font-semibold">Our Team</h2>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openSection === 'team' ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {openSection === 'team' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-card/50 rounded-b-lg p-4"
                >
                  <div className="grid gap-6 md:grid-cols-3">
                    {teamMembers.map((member, index) => (
                      <motion.div
                        key={member.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card p-6 rounded-lg shadow-sm"
                      >
                        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                          <member.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                        <p className="text-sm text-primary mb-2">{member.role}</p>
                        <p className="text-muted-foreground text-sm">{member.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Get Started Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Transform how you work with databases using Prompt2Query.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition"
            >
              Try It Now
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default About; 