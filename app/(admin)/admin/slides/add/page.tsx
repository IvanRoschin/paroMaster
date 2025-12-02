import { SlideForm } from '@/app/(admin)/components';
import { addSlideAction } from '@/app/actions/slides';

const AddSlidePage = () => {
  return (
    <div className="mb-20">
      <SlideForm title="Додати новий слайд" action={addSlideAction} />
    </div>
  );
};

export default AddSlidePage;
