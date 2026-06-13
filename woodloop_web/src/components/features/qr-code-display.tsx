"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";

interface QRCodeDisplayProps {
  qrCodeId: string;
  baseUrl?: string;
}

export function QRCodeDisplay({ qrCodeId, baseUrl }: QRCodeDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const url = baseUrl
    ? `${baseUrl}/p/${qrCodeId}`
    : `${window.location.origin}/p/${qrCodeId}`;

  async function handleDownload() {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx?.drawImage(img, 0, 0, 512, 512);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `woodloop-${qrCodeId}.png`;
      a.click();
      toast.success("QR Code downloaded!");
    };

    img.src = url;
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `WoodLoop - ${qrCodeId}`,
          text: `Scan QR untuk lihat traceability produk WoodLoop`,
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center bg-white p-4 rounded-lg">
          <QRCodeSVG
            ref={svgRef}
            value={url}
            size={200}
            level="M"
            includeMargin
          />
        </div>
        <p className="text-xs text-center text-muted-foreground break-all">
          {url}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
