const LoadingCard = () => (
  <div className="rounded-xl h-16 w-full bg-white/65 animate-pulse" />
);

export default function Loading() {
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 12 }).map((_, index) => (
        <LoadingCard key={index} />
      ))}
    </section>
  );
}
