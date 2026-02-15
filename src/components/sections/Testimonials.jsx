export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">
          What Students Say
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="testimonial-card">
            <p>"Amazing platform for students!"</p>
            <h4>- Shanmukha</h4>
          </div>

          <div className="testimonial-card">
            <p>"Best academic dashboard I’ve used."</p>
            <h4>- Ravi Kumar</h4>
          </div>
          <div className="bg-red-500 text-white p-10">
  TEST
</div>
        </div>
      </div>
    </section>
  );
}
