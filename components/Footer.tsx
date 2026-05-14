export default function Footer() {
  return (
    <footer
      className="container w-full mx-auto bg-surface-container-lowest dark:bg-surface-container-low border-t border-outline-variant/20 mt-auto"
      suppressHydrationWarning
    >
      <div className="flex flex-col md:flex-row-reverse justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-8 gap-6 max-w-container-max mx-auto">
        <div className="text-label-md text-primary font-bold">
          © ٢٠٢٦ البوابة المعرفية العسكرية. جميع الحقوق محفوظة.
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a
            className="text-body-md text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
            href="#"
          >
            الخصوصية
          </a>
          <a
            className="text-body-md text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
            href="#"
          >
            الشروط والأحكام
          </a>
          <a
            className="text-body-md text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
            href="#"
          >
            اتصل بنا
          </a>
        </div>
      </div>
    </footer>
  );
}
