import { addCategory } from '@/actions/categories';
import { CategoryForm } from '@/app/(admin)/components';

const AddCategoryPage = () => {
  return (
    <div className="mb-20">
      <CategoryForm title="Додати нову категорію" action={addCategory} />
    </div>
  );
};

export default AddCategoryPage;
