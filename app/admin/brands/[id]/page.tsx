import { getBrandById, updateBrand } from '@/actions/brands';
import { BrandForm } from '@/admin/components';

export type paramsType = Promise<{ id: string }>;

export default async function SingleBrandPage(props: { params: paramsType }) {
  const { id } = await props.params;

  const brand = await getBrandById(id);
  return (
    <div className="mb-20">
      <BrandForm
        title={'Редагувати бренд'}
        brand={brand}
        action={updateBrand}
      />
    </div>
  );
}
