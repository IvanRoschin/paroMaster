type Props = {};

const page = (props: Props) => {
  return <div>page</div>;
};

export default page;
// import { getCustomerById, updateCustomer } from '@/actions/customers';
// import { CustomerForm } from '@/admin/components/index';

// const SingleCustomerPage = async ({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) => {
//   const { id } = await params;

//   const customer = await getCustomerById(id);
//   return (
//     <div className="mb-20">
//       <CustomerForm
//         title={'Редагувати дані про замовника'}
//         customer={customer}
//         action={updateCustomer}
//       />
//     </div>
//   );
// };

// export default SingleCustomerPage;
