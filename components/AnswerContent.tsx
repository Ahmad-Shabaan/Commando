import { MapPin, ExternalLink } from "lucide-react";
import type { AnswerItem } from "@/lib/types";

export default function AnswerContent({ items }: { items: AnswerItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="space-y-3 list-decimal list-inside">
      {items.map((item, i) => {
        switch (item.type) {
          case "text":
            return (
              <li key={i} className="text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                {item.text}
              </li>
            );

          case "location":
            return (
              <li key={i} className="text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center gap-2 text-primary font-bold text-label-md hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 rounded-lg  transition-colors"
                >
                  <MapPin size={16} aria-hidden="true" />
                  <span>{item.text}</span>
                  {item.label && (
                    <span className="font-normal text-body-md text-on-surface-variant">
                      — {item.label}
                    </span>
                  )}
                </a>
              </li>
            );
          case "link":
            return (
              <li key={i}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center gap-2 text-primary font-bold text-label-md hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 rounded-lg px-3 py-1.5 -mx-1.5 transition-colors"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  {item.label}
                  {item.text && (
                    <span className="font-normal text-body-md text-on-surface-variant">
                      — {item.text}
                    </span>
                  )}
                </a>
              </li>
            );
          default:
            return null;
        }
      })}
    </ul>
  );
}
