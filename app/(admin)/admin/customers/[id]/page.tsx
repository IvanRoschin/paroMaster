import { getCustomerByIdAction } from '@/actions/customers';
import { CustomerForm } from '@/admin/components/index';

const SingleCustomerPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const customer = await getCustomerByIdAction(id);
  return (
    <div className="mb-20">
      <CustomerForm customer={customer} />
    </div>
  );
};

export default SingleCustomerPage;
