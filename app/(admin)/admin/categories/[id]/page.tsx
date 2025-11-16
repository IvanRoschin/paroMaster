import {
  getCategoryByIdAction,
  updateCategoryAction,
} from '@/actions/categories';
import { CategoryForm } from '@/app/(admin)/components';

export type paramsType = Promise<{ id: string }>;

export default async function SingleCategoryPage(props: {
  params: paramsType;
}) {
  const { id } = await props.params;

  const category = await getCategoryByIdAction(id);
  return (
    <div className="mb-20">
      <CategoryForm
        title={'Редагувати категорію'}
        category={category}
        action={values => updateCategoryAction(category._id, values)}
      />
    </div>
  );
}
