import { addBrandAction } from '@/actions/brands';
import { BrandForm } from '@/app/(admin)/components';

const AddBrandPage = () => {
  return (
    <div className="mb-20">
      <BrandForm title="Додати новий бренд" action={addBrandAction} />
    </div>
  );
};

export default AddBrandPage;
