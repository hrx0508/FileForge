function Hero({ type }) {
  const isImage = type === "image";

  return (
    <section className="mx-auto w-[92%] max-w-[720px] pb-8 pt-12 text-center sm:pt-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
        Compress {isImage ? "images" : "PDFs"}
      </h1>
      <p className="mx-auto mt-3 max-w-[520px] text-sm leading-6 text-[var(--muted)] sm:text-base">
        {isImage
          ? "Shrink image files in your browser. Enter the size you want, or choose quality, format and dimensions."
          : "Reduce PDF size in your browser. Text and vector graphics stay sharp."}
      </p>
    </section>
  );
}

export default Hero;