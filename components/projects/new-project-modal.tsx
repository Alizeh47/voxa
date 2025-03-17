import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { DayPicker } from "react-day-picker";
import type { DayPickerProps } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ProjectFormData {
  name: string;
  description: string;
  category: string;
  dueDate: Date | null;
  teamMembers: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  category?: string;
  dueDate?: string;
  teamMembers?: string;
  submit?: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  dueDate: string;
  teamMembers: string[];
  progress: number;
}

const CATEGORIES = [
  "Development",
  "Design",
  "Marketing",
  "Research",
  "Planning",
  "Operations"
];

export function NewProjectModal({ open, onOpenChange }: NewProjectModalProps) {
  const router = useRouter();
  const [formData, setFormData] = React.useState<ProjectFormData>({
    name: '',
    description: '',
    category: '',
    dueDate: null,
    teamMembers: ''
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (formData.dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    // Validate team members email format
    if (formData.teamMembers.trim()) {
      const emails = formData.teamMembers.split(',').map(email => email.trim());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = emails.filter(email => !emailRegex.test(email));
      if (invalidEmails.length > 0) {
        newErrors.teamMembers = 'Please enter valid email addresses';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Ensure the time is set to end of day for due date
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      setFormData(prev => ({
        ...prev,
        dueDate: endOfDay
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dueDate: null
      }));
    }
    setErrors(prev => ({
      ...prev,
      dueDate: undefined
    }));
  };

  const createProject = async (projectData: Omit<Project, 'id' | 'progress'>): Promise<Project> => {
    // This would be your API call
    // For now, we'll simulate it
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: Math.floor(Math.random() * 10000),
      ...projectData,
      progress: 0
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        dueDate: formData.dueDate!.toISOString(),
        teamMembers: formData.teamMembers
          .split(',')
          .map(email => email.trim())
          .filter(email => email.length > 0)
      };

      const newProject = await createProject(projectData);
      console.log('Created project:', newProject);

      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        category: '',
        dueDate: null,
        teamMembers: ''
      });
      onOpenChange(false);
      
      // Refresh the projects list
      router.refresh();
      
    } catch (error) {
      console.error('Failed to create project:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create project. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable past dates and weekends in the calendar
  const disabledDays = {
    before: new Date(),
    after: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Max 1 year ahead
  };

  const footer = formData.dueDate ? (
    <p className="text-sm text-center mt-4">
      Due date set to {format(formData.dueDate, "PPP")}
    </p>
  ) : (
    <p className="text-sm text-center mt-4">Please pick a due date</p>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cal">Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={handleInputChange}
                className={cn(
                  errors.name && 'border-red-500 focus-visible:ring-red-500'
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={handleInputChange}
                className={cn(
                  errors.description && 'border-red-500 focus-visible:ring-red-500'
                )}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => handleInputChange(e as any)}
                className={cn(
                  "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",
                  errors.category && 'border-red-500 focus-visible:ring-red-500'
                )}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground",
                      errors.dueDate && "border-red-500 focus-visible:ring-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DayPicker
                    mode="single"
                    selected={formData.dueDate || undefined}
                    onSelect={handleDateSelect}
                    disabled={disabledDays}
                    initialFocus
                    footer={footer}
                    fromDate={new Date()}
                    toDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
                    modifiersClassNames={{
                      selected: 'bg-blue-600 text-white hover:bg-blue-700',
                      today: 'bg-gray-100 font-bold',
                      disabled: 'text-gray-400 line-through',
                    }}
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
              {errors.dueDate && (
                <p className="text-sm text-red-500">{errors.dueDate}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teamMembers">Team Members</Label>
              <Input
                id="teamMembers"
                name="teamMembers"
                placeholder="Enter team member emails (comma-separated)"
                value={formData.teamMembers}
                onChange={handleInputChange}
                className={cn(
                  errors.teamMembers && 'border-red-500 focus-visible:ring-red-500'
                )}
              />
              <p className="text-sm text-gray-500">Separate multiple emails with commas</p>
              {errors.teamMembers && (
                <p className="text-sm text-red-500">{errors.teamMembers}</p>
              )}
            </div>
          </div>
          
          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 