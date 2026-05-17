export default function Hero() {
  return (
    <section
      className="relative w-full h-[500px] md:h-[600px] bg-surface-container-high overflow-hidden"
      aria-label="دليل المعرفة للخدمة العسكرية"
    >
      <img
        alt="صورة خلفية تمثل الخدمة العسكرية في مصر"
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
        src="/army.png"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-primary/80 to-transparent" aria-hidden="true" />
      <div className="relative z-10 flex items-center h-full container w-full mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="max-w-2xl text-on-primary">
          <h1 className="text-display-lg text-on-primary mb-4 px-2 md:px-4">
            دليل المعرفة للخدمة العسكرية
          </h1>
          <p className="text-headline-lg-mobile md:text-headline-lg text-on-primary mb-6 px-2 md:px-4 text-inverse-primary">
            معلومات وإرشادات مهمة لكل من يبدأ أو يؤدي خدمته العسكرية
          </p>
          <p className="text-body-lg text-on-primary/90 bg-primary/40 p-4 rounded-xl border border-inverse-primary/20 backdrop-blur-sm">
            إجابات واضحة ومباشرة على أكثر الأسئلة شيوعًا داخل الخدمة العسكرية
          </p>
        </div>
      </div>
    </section>
  );
}
