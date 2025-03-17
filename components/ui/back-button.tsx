import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FiArrowLeft } from 'react-icons/fi';

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      onClick={() => router.back()}
    >
      <FiArrowLeft className="h-4 w-4" />
      <span>Back</span>
    </Button>
  );
} 