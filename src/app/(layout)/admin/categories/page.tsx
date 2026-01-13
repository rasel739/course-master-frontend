'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Loader2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { fetchCategories } from '@/redux/features/categorySlice';
import { adminApi } from '@/helpers/axios/api';
import { Category } from '@/types';
import { formatDate } from '@/utils';
import Loading from '@/app/loading';
import { CATEGORY_STATS, CATEGORY_TABLE_ITEMS } from '@/constants';

const AdminCategories = () => {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.category);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', order: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCategories(true));
  }, [dispatch]);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        order: category.order,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', order: categories.length + 1 });
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', order: 0 });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory._id, formData);
      } else {
        await adminApi.createCategory(formData);
      }
      handleCloseModal();
      dispatch(fetchCategories(true));
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      try {
        await adminApi.deleteCategory(id);
        setDeleteConfirm(null);
        dispatch(fetchCategories(true));
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      await adminApi.updateCategory(category._id, { isActive: !category.isActive });
      dispatch(fetchCategories(true));
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Category Management</h1>
          <p className='text-gray-600 mt-2'>Create and manage course categories</p>
        </div>
        <Button className='cursor-pointer' onClick={() => handleOpenModal()}>
          <Plus className='w-4 h-4 mr-2' />
          Add Category
        </Button>
      </div>

      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
        <Input
          type='text'
          placeholder='Search categories...'
          className='pl-10'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {CATEGORY_STATS({
          categoriesCount: categories?.length || 0,
          activeCount: categories?.filter((c) => c.isActive).length || 0,
          inactiveCount: categories?.filter((c) => !c.isActive).length || 0,
        }).map((stat) => (
          <Card key={stat.label}>
            <CardContent className='p-4'>
              <p className='text-sm text-gray-600'>{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  {CATEGORY_TABLE_ITEMS.map((item) => (
                    <th key={item.title} className={item.style}>
                      {item.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredCategories?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className='px-6 py-12 text-center text-gray-500'>
                      No categories found
                    </td>
                  </tr>
                ) : (
                  filteredCategories?.map((category) => (
                    <tr key={category._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {category.order}
                      </td>
                      <td className='px-6 py-4'>
                        <p className='font-medium text-gray-900'>{category.name}</p>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {category.slug}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                        {category.description || '-'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <button
                          onClick={() => handleToggleActive(category)}
                          className='cursor-pointer'
                        >
                          {category.isActive ? (
                            <span className='px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800'>
                              Active
                            </span>
                          ) : (
                            <span className='px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800'>
                              Inactive
                            </span>
                          )}
                        </button>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {formatDate(category.createdAt)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <div className='flex items-center justify-end space-x-2'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='cursor-pointer'
                            onClick={() => handleOpenModal(category)}
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDelete(category._id)}
                            className={
                              deleteConfirm === category._id
                                ? 'text-red-600 hover:text-red-700 cursor-pointer'
                                : 'text-gray-600'
                            }
                          >
                            {deleteConfirm === category._id ? (
                              <span className='text-xs'>Confirm?</span>
                            ) : (
                              <Trash2 className='w-4 h-4' />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/50' onClick={handleCloseModal} />
          <Card className='relative z-10 w-full max-w-md mx-4'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</CardTitle>
              <Button variant='ghost' size='sm' onClick={handleCloseModal}>
                <X className='w-4 h-4' />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                {error && (
                  <div className='p-3 bg-red-50 text-red-600 rounded-md text-sm'>{error}</div>
                )}
                <div className='space-y-2'>
                  <Label htmlFor='name'>
                    Category Name <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='name'
                    type='text'
                    placeholder='e.g., Web Development'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='description'>Description (Optional)</Label>
                  <textarea
                    id='description'
                    rows={3}
                    className='flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2'
                    placeholder='Brief description of this category...'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='order'>Display Order</Label>
                  <Input
                    id='order'
                    type='number'
                    min='0'
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className='flex items-center space-x-4 pt-4'>
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        {editingCategory ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Check className='mr-2 h-4 w-4' />
                        {editingCategory ? 'Update Category' : 'Create Category'}
                      </>
                    )}
                  </Button>
                  <Button type='button' variant='outline' onClick={handleCloseModal}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
