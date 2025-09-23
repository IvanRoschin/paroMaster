import { getGoodById, updateGood } from '@/actions/goods';
import { GoodForm } from '@/admin/components';
import { ISearchParams } from '@/types/searchParams';

const SingleGoodPage = async ({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) => {
  const params = await searchParams;

  const { id } = params;
  const good = await getGoodById(id);

  return (
    <div className="mb-20">
      <GoodForm
        title={'Редагувати дані про товар'}
        good={good}
        action={updateGood}
      />
    </div>
  );
};

export default SingleGoodPage;
