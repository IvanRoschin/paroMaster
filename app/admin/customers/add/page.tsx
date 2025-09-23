import { addCustomer } from '@/actions/customers';
import { CustomerForm } from '@/admin/components';

const AddCustomerPage = () => {
  return (
    <div className="mb-20">
      <CustomerForm title="Додати нового клієнта" action={addCustomer} />
    </div>
  );
};

export default AddCustomerPage;
