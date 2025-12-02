import { addCategoryAction } from '@/actions/categories';
import { CategoryForm } from '@/app/(admin)/components';

const AddCategoryPage = () => {
  return (
    <div className="mb-20">
      <CategoryForm title="Додати нову категорію" action={addCategoryAction} />
    </div>
  );
};

export default AddCategoryPage;
