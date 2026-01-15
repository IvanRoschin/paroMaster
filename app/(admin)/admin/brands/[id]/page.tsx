import { getBrandByIdAction, updateBrandAction } from '@/actions/brands';
import { BrandForm } from '@/app/(admin)/components';

export type paramsType = Promise<{ id: string }>;

export default async function SingleBrandPage(props: { params: paramsType }) {
  const { id } = await props.params;

  const brand = await getBrandByIdAction(id);
  return (
    <div className="mb-20">
      <BrandForm
        title={'Редагувати бренд'}
        brand={brand}
        action={values => updateBrandAction(brand._id, values)}
      />
    </div>
  );
}
