export default function Hero() {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] bg-surface-container-high overflow-hidden" suppressHydrationWarning>
      <img
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
        src="https://lh3.googleusercontent.com/aida/ADBb0uhONoKsQ5fdujqDZrdY7ASJe5YLADJSo-h1AZcB-lnk_fPyxF40MfrlW5bqteXbbxqkpz2-inus7Ls1Y0z9BMUN7sTUWin7iRTeF-2NsI0AdBvH4P9nkRbp82eZas6WEjyLxfZBNrY5984lcpTEoE8TJ9IrwQRaLQdzFa5WmIdPS3EKYmdrxqG4qs0mlewgVCbk9FYZG3-vUZoPOCgLBZPu1QsPP_w3iwwEkqLkklhPDV1e_u8tThPTTjc"
        suppressHydrationWarning
      />
      <div className="absolute inset-0 bg-gradient-to-l from-primary/80 to-transparent" suppressHydrationWarning />
      <div className="relative z-10 flex items-center h-full container w-full mx-auto px-margin-mobile md:px-margin-desktop" suppressHydrationWarning>
        <div className="max-w-2xl text-on-primary" suppressHydrationWarning>
          <h2 className="text-display-lg text-on-primary mb-4 px-2 md:px-4" suppressHydrationWarning>
            دليل المعرفة للخدمة العسكرية
          </h2>
          <p className="text-headline-lg-mobile md:text-headline-lg text-on-primary mb-6 px-2 md:px-4 text-inverse-primary" suppressHydrationWarning>
            معلومات وإرشادات مهمة لكل من يبدأ أو يؤدي خدمته العسكرية
          </p>
          <p className="text-body-lg text-on-primary/90 bg-primary/40 p-4 rounded-xl border border-inverse-primary/20 backdrop-blur-sm" suppressHydrationWarning>
            إجابات واضحة ومباشرة على أكثر الأسئلة شيوعًا داخل الخدمة العسكرية
          </p>
        </div>
      </div>
    </section>
  );
}
