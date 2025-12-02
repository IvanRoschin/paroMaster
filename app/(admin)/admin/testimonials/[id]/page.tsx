import { getTestimonialByIdAction } from '@/actions/testimonials';
import { ISearchParams } from '@/types/searchParams';

const SingleTestimonialPage = async ({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) => {
  const params = await searchParams;

  const { id } = params;
  const testimonial = await getTestimonialByIdAction(id);

  return (
    <div className="mb-20">
      Update Testimonial Page
      {/* <TestimonialForm
        testimonial={testimonial}
        title={'Редагувати відгук'}
        action={updateTestimonial}
      /> */}
    </div>
  );
};

export default SingleTestimonialPage;
