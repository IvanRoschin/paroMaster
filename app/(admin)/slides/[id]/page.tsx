import { getSlideById, updateSlide } from '@/actions/slider';
import { SlideForm } from '@/app/(admin)/components';

const SingleSlidePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
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
