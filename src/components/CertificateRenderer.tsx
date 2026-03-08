import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface CertificateRendererProps {
  recipientName: string;
  courseName: string | null;
  issueDate: string;
  certificateCode: string;
  certificateId: string;
  issuerName: string;
  logoUrl?: string | null;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
  alignment?: "left" | "center" | "right";
  showQr?: boolean;
}

const CertificateRenderer = forwardRef<HTMLDivElement, CertificateRendererProps>(
  (
    {
      recipientName,
      courseName,
      issueDate,
      certificateCode,
      certificateId,
      issuerName,
      logoUrl,
      backgroundColor = "#001F3F",
      textColor = "#FFFFFF",
      fontFamily = "Bebas Neue",
      fontSize = 24,
      alignment = "center",
      showQr = true,
    },
    ref
  ) => {
    const verifyUrl = `${window.location.origin}/certificate/${certificateId}`;

    return (
      <div
        ref={ref}
        className="relative"
        style={{
          width: 1056,
          height: 816,
          backgroundColor,
          padding: "64px",
          display: "flex",
          flexDirection: "column",
          alignItems: alignment === "center" ? "center" : alignment === "right" ? "flex-end" : "flex-start",
          justifyContent: "center",
          fontFamily: "Urbanist, sans-serif",
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: "absolute",
            inset: 16,
            border: `2px solid ${textColor}33`,
            borderRadius: 8,
            pointerEvents: "none",
          }}
        />

        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo"
            crossOrigin="anonymous"
            style={{
              position: "absolute",
              top: 40,
              left: 40,
              height: 56,
              objectFit: "contain",
            }}
          />
        )}

        <h2
          style={{
            fontFamily: `${fontFamily}, sans-serif`,
            fontSize: fontSize * 1.8,
            color: textColor,
            textAlign: alignment,
            marginBottom: 16,
            letterSpacing: "0.05em",
          }}
        >
          Certificate of Completion
        </h2>

        <p style={{ color: textColor, opacity: 0.8, fontSize: 18, textAlign: alignment, marginBottom: 8 }}>
          This certifies that
        </p>

        <p
          style={{
            fontFamily: `${fontFamily}, sans-serif`,
            fontSize: fontSize * 1.4,
            color: textColor,
            textAlign: alignment,
            marginBottom: 16,
            letterSpacing: "0.02em",
          }}
        >
          {recipientName}
        </p>

        <p style={{ color: textColor, opacity: 0.7, fontSize: 16, textAlign: alignment }}>
          has successfully completed <strong>{courseName || "the program"}</strong>
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginTop: 48,
          }}
        >
          <div style={{ textAlign: alignment }}>
            <p style={{ color: textColor, opacity: 0.5, fontSize: 13 }}>
              Issued on {issueDate}
            </p>
            <p style={{ color: textColor, opacity: 0.5, fontSize: 13 }}>
              ID: {certificateCode}
            </p>
            <p style={{ color: textColor, opacity: 0.4, fontSize: 12, marginTop: 4 }}>
              Issued by {issuerName}
            </p>
          </div>

          {showQr && (
            <div
              style={{
                background: "#FFFFFF",
                padding: 8,
                borderRadius: 8,
              }}
            >
              <QRCodeSVG value={verifyUrl} size={80} />
            </div>
          )}
        </div>
      </div>
    );
  }
);

CertificateRenderer.displayName = "CertificateRenderer";
export default CertificateRenderer;
