'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Loader2 } from 'lucide-react';
import { CreateModuleRequest } from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { addModule, updateModule } from '@/redux/features/adminSlice';
import { moduleSchema } from '@/schema';

interface ModuleDialogProps {
  courseId: string;
  module?: any;
  open: boolean;
  onClose: () => void;
}

const ModuleDialog = ({ courseId, module, open, onClose }: ModuleDialogProps) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.admin);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateModuleRequest>({
    resolver: yupResolver(moduleSchema),
    defaultValues: module
      ? {
          title: module.title,
          description: module.description || '',
          order: module.order,
        }
      : undefined,
  });

  const onSubmit: SubmitHandler<CreateModuleRequest> = async (data) => {
    if (module) {
      await dispatch(updateModule({ courseId, moduleId: module._id, data }));
    } else {
      await dispatch(addModule({ courseId, data }));
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-xl font-bold'>{module ? 'Edit Module' : 'Add Module'}</h2>
          <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-lg'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='p-6 space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>
              Title <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='title'
              type='text'
              placeholder='e.g., Introduction to React'
              {...register('title')}
            />
            {errors.title && <p className='text-sm text-red-600'>{errors.title.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description (Optional)</Label>
            <textarea
              id='description'
              rows={4}
              className='flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600'
              placeholder='Brief description of this module...'
              {...register('description')}
            />
            {errors.description && (
              <p className='text-sm text-red-600'>{errors.description.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='order'>Order (Optional)</Label>
            <Input id='order' type='number' min='1' placeholder='1' {...register('order')} />
            {errors.order && <p className='text-sm text-red-600'>{errors.order.message}</p>}
            <p className='text-xs text-gray-500'>Leave empty to add at the end</p>
          </div>

          <div className='flex items-center space-x-3 pt-4'>
            <Button type='submit' disabled={isLoading} className='flex-1'>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : module ? (
                'Update Module'
              ) : (
                'Add Module'
              )}
            </Button>
            <Button type='button' variant='outline' onClick={onClose} className='flex-1'>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleDialog;
