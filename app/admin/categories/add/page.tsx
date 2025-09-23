import { addCategory } from '@/actions/categories';
import { CategoryForm } from '@/admin/components';

const AddCategoryPage = () => {
  return (
    <div className="mb-20">
      <CategoryForm title="Додати нову категорію" action={addCategory} />
    </div>
  );
};

export default AddCategoryPage;
