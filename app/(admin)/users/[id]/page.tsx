type Props = {};

const page = (props: Props) => {
  return <div>page</div>;
};

export default page;
// import { ISearchParams } from '@/types/searchParams';
// import { getUserById, updateUser } from '@/actions/users';
// import { UserForm } from '@/admin/components';

// interface Params {
//   id: string;
// }

// const SingleUserPage = async ({
//   searchParams,
// }: {
//   searchParams: Promise<ISearchParams>;
// }) => {
//   const params = await searchParams;

//   const { id } = params;
//   const user = await getUserById(id);

//   return (
//     <div className="mb-20">
//       <UserForm
//         user={user}
//         title={'Редагувати дані про користувача'}
//         action={updateUser}
//       />
//     </div>
//   );
// };

// export default SingleUserPage;
