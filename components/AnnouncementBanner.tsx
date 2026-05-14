import { BellRing, TriangleAlert, CheckCircle, ChevronLeft } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  link: string | null;
  link_label: string | null;
}

const typeStyles = {
  info: {
    bg: "bg-[#e0f2f1] dark:bg-tertiary-container/20",
    border: "border-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    Icon: BellRing,
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-600",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600",
    Icon: TriangleAlert,
  },
  success: {
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-600",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600",
    Icon: CheckCircle,
  },
};

async function getAnnouncement(): Promise<Announcement | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/announcement`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AnnouncementBanner() {
  const announcement = await getAnnouncement();

  if (!announcement) return null;

  const styles = typeStyles[announcement.type] ?? typeStyles.info;
  const { Icon } = styles;
  return (
    <section className="w-full bg-background py-8">
      <div className="container w-full mx-auto px-margin-mobile md:px-margin-desktop">
        <div className={`${styles.bg} rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-r-4 ${styles.border}`}>
          <div className="flex items-center gap-4">
            <div className={`${styles.iconBg} p-2 rounded-full flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${styles.iconColor}`} />
            </div>
            <div>
              <h4 className="text-label-md text-primary font-bold mb-1">{announcement.title}</h4>
              <p className="text-body-md text-on-surface-variant">{announcement.message}</p>
            </div>
          </div>
          {announcement.link && (
            <a
              href={announcement.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-label-md text-primary hover:underline group shrink-0"
            >
              <span>{announcement.link_label}</span>
              <ChevronLeft className="w-[18px] h-[18px] group-hover:-translate-x-1 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
