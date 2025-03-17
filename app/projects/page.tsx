'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NewProjectModal } from '@/components/projects/new-project-modal';
import Link from 'next/link';
import { BackButton } from '@/components/ui/back-button';
import SharedLayout from '@/components/Layout/SharedLayout';

const projects = [
  {
    id: 1,
    name: "Marketing Campaign",
    description: "Q4 Digital Marketing Strategy",
    progress: 75,
    dueDate: "2024-04-15",
    category: "Marketing",
    teamSize: 5
  },
  {
    id: 2,
    name: "Website Redesign",
    description: "Company Website Overhaul",
    progress: 30,
    dueDate: "2024-05-01",
    category: "Design",
    teamSize: 3
  },
  {
    id: 3,
    name: "Mobile App Development",
    description: "Customer Portal App",
    progress: 60,
    dueDate: "2024-06-30",
    category: "Development",
    teamSize: 4
  }
];

export default function ProjectsPage() {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <SharedLayout>
      <div className="container mx-auto p-6 relative">
        {/* Geometric Decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl" />
        </div>

        {/* Header with Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Title and New Project Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-cal font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
              Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 font-grotesque">
              Manage and track all your ongoing projects
            </p>
          </div>
          <Button 
            onClick={() => setIsNewProjectModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-cal font-semibold mb-2">{project.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-grotesque">{project.description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400 font-inter">Progress</span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium font-inter">{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="flex justify-between text-sm">
                      <div className="text-gray-600 dark:text-gray-400 font-inter">
                        <p>Due: {new Date(project.dueDate).toLocaleDateString()}</p>
                        <p>Team: {project.teamSize} members</p>
                      </div>
                      <div className="flex items-end">
                        <Link href={`/projects/${project.id}`}>
                          <Button
                            variant="outline"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors duration-200"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <NewProjectModal 
        open={isNewProjectModalOpen} 
        onOpenChange={setIsNewProjectModalOpen} 
      />
    </SharedLayout>
  );
} 