import { SlideForm } from '@/app/(admin)/components';
import { getSlideByIdAction, updateSlideAction } from '@/app/actions/slides';

const SingleSlidePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const slide = await getSlideByIdAction(id);
  return (
    <div className="mb-20">
      <SlideForm
        title={'Редагувати слайд'}
        slide={slide}
        action={values => updateSlideAction(slide._id, values)}
      />
    </div>
  );
};

export default SingleSlidePage;
