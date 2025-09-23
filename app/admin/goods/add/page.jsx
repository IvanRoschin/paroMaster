import { addGood } from '@/actions/goods';
import { GoodForm } from '@/admin/components';

const AddGoodPage = () => {
  return (
    <div className="mb-20">
      <GoodForm title="Додати новий товар" action={addGood} />
    </div>
  );
};

export default AddGoodPage;
