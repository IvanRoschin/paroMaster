import { getSlideById, updateSlide } from '@/actions/slider';
import { SlideForm } from '@/admin/components';
import { ISearchParams } from '@/types/searchParams';

const SingleSlidePage = async ({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) => {
  const params = await searchParams;
  const { id } = params;
  const slide = await getSlideById(id);
  return (
    <div className="mb-20">
      <SlideForm
        title={'Редагувати слайд'}
        slide={slide}
        action={updateSlide}
      />
    </div>
  );
};

export default SingleSlidePage;
