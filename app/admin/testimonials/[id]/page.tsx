import { getTestimonialById, updateTestimonial } from '@/actions/testimonials';
import { TestimonialForm } from '@/admin/components';
import { ISearchParams } from '@/types/searchParams';

const SingleTestimonialPage = async ({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) => {
  const params = await searchParams;

  const { id } = params;
  const testimonial = await getTestimonialById(id);

  return (
    <div className="mb-20">
      <TestimonialForm
        testimonial={testimonial}
        title={'Редагувати відгук'}
        action={updateTestimonial}
      />
    </div>
  );
};

export default SingleTestimonialPage;
