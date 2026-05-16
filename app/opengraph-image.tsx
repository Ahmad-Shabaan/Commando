import { ImageResponse } from "next/og";

export const alt = "كوماندو - البوابة المعرفية العسكرية | دليل التجنيد في مصر";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Fetch Noto Sans Arabic for proper Arabic rendering in Satori
  const fontData = await fetch(
    "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyG2vu3CBFQLaig.ttf"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #273312 0%, #3d4a26 40%, #55633d 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          fontFamily: "Noto Sans Arabic",
          direction: "rtl",
        }}
      >
        {/* Decorative top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #d9e9b8, #bdcd9d, #aab98c)",
            display: "flex",
          }}
        />

        {/* Main title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.4,
            marginBottom: "20px",
            display: "flex",
          }}
        >
          البوابة المعرفية العسكرية
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: "#bdcd9d",
            textAlign: "center",
            lineHeight: 1.6,
            marginBottom: "40px",
            display: "flex",
          }}
        >
          دليل شامل عن التجنيد والخدمة العسكرية في مصر
        </div>

        {/* Keywords bar */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["شروط التجنيد", "مدة الخدمة", "الإعفاءات", "الأوراق المطلوبة"].map(
            (keyword) => (
              <div
                key={keyword}
                style={{
                  background: "rgba(217, 233, 184, 0.15)",
                  border: "1px solid rgba(189, 205, 157, 0.3)",
                  borderRadius: "12px",
                  padding: "10px 24px",
                  fontSize: 22,
                  color: "#d9e9b8",
                  display: "flex",
                }}
              >
                {keyword}
              </div>
            )
          )}
        </div>

        {/* Bottom brand */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            fontSize: 24,
            color: "rgba(255,255,255,0.5)",
            display: "flex",
          }}
        >
          komando.store
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Noto Sans Arabic",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
