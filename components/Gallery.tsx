const photos = ["/Hero.jpg", "/promo.jpg", "/image5.jpg", "/image2.jpg", "/image4.jpg"];

export default function Gallery() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Life in Maestro</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {photos.map((src, i) => (
          <div
            key={i}
            className="aspect-square rounded bg-cover bg-center bg-gray-700"
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>
    </section>
  );
}