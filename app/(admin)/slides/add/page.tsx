import { addSlide } from '@/actions/slider';
import { SlideForm } from '@/app/(admin)/components';

const AddSlidePage = () => {
  return (
    <div className="mb-20">
      <SlideForm title="Додати новий слайд" action={addSlide} />
    </div>
  );
};

export default AddSlidePage;
