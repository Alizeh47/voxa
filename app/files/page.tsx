'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, FolderPlus, Search, Download, Trash2, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import SharedLayout from '@/components/Layout/SharedLayout';

interface FileItem {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
}

const FilesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [files, setFiles] = useState<FileItem[]>([
    { id: 1, name: 'Project Proposal.pdf', type: 'pdf', size: '2.5 MB', lastModified: '2024-03-10' },
    { id: 2, name: 'Meeting Notes.docx', type: 'doc', size: '1.2 MB', lastModified: '2024-03-09' },
    { id: 3, name: 'Budget Report.xlsx', type: 'excel', size: '3.8 MB', lastModified: '2024-03-08' },
    { id: 4, name: 'Presentation.pptx', type: 'powerpoint', size: '5.1 MB', lastModified: '2024-03-07' },
    { id: 5, name: 'Design Assets.zip', type: 'archive', size: '15.7 MB', lastModified: '2024-03-06' },
  ]);

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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      // Here you would typically make an API call to upload the file
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating upload
      
      const newFile: FileItem = {
        id: files.length + 1,
        name: selectedFile.name,
        type: selectedFile.name.split('.').pop() || 'unknown',
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        lastModified: format(new Date(), 'yyyy-MM-dd')
      };

      setFiles([newFile, ...files]);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleDownload = (file: FileItem) => {
    // Here you would typically make an API call to download the file
    console.log('Downloading file:', file.name);
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="text-blue-500" />;
      case 'excel':
      case 'xlsx':
        return <FileText className="text-green-500" />;
      case 'powerpoint':
      case 'pptx':
        return <FileText className="text-orange-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };

  return (
    <SharedLayout>
      <div className="container mx-auto p-6 relative">
        {/* Geometric Decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="space-y-8"
          initial="hidden"
          animate="show"
          variants={container}
        >
          {/* Header */}
          <motion.div 
            className="flex justify-between items-center"
            variants={item}
          >
            <h1 className="text-4xl font-['Audiowide'] bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
              Files
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3E7BFA] font-['Tomorrow'] bg-white/80 backdrop-blur-sm"
                />
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-['Tomorrow'] flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload File
              </Button>
            </div>
          </motion.div>

          {/* Files Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={item}
          >
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -5 }}
                variants={item}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      {getFileIcon(file.type)}
                    </div>
                    <div>
                      <h3 className="font-['Bruno_Ace_SC'] text-lg mb-1">{file.name}</h3>
                      <p className="text-sm text-gray-500 font-['Tomorrow']">
                        {file.size} • {format(new Date(file.lastModified), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 font-['Tomorrow']"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 font-['Tomorrow'] text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Upload Modal */}
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-['Bruno_Ace_SC']">Upload File</DialogTitle>
                <DialogDescription className="font-['Tomorrow']">
                  Choose a file to upload to your workspace.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-['Michroma']">Select File</label>
                  <Input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="font-['Tomorrow']"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="font-['Tomorrow']"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-['Tomorrow']"
                  disabled={!selectedFile || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    'Upload'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </SharedLayout>
  );
};

export default FilesPage; 