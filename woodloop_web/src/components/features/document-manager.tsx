"use client";

import { useState } from "react";
import { useEnablerUserDocuments, useUpdateDocumentReview } from "@/lib/hooks/use-enabler";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, CheckCircle2, XCircle, Loader2, ExternalLink, ScrollText } from "lucide-react";
import { toast } from "sonner";
import type { UserDocWithUrl } from "@/lib/pocketbase/types";

const DOC_TYPE_LABELS: Record<string, string> = {
  NIB: "NIB",
  SVLK: "SVLK",
  SK_Pengesahan: "SK Pengesahan",
  Izin_Usaha: "Izin Usaha",
  Sertifikat_Lainnya: "Sertifikat Lainnya",
  Lainnya: "Lainnya",
};

interface DocumentManagerProps {
  userId: string;
  userName?: string;
}

export function DocumentManager({ userId, userName }: DocumentManagerProps) {
  const { data: documents, isLoading } = useEnablerUserDocuments(userId);
  const updateReview = useUpdateDocumentReview();
  const [selectedDoc, setSelectedDoc] = useState<UserDocWithUrl | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  async function handleApprove(doc: UserDocWithUrl) {
    updateReview.mutate(
      { docId: doc.id, verified: true, notes: reviewNotes || undefined },
      {
        onSuccess: () => {
          toast.success("Dokumen diverifikasi");
          setSelectedDoc(null);
          setReviewNotes("");
        },
        onError: () => toast.error("Gagal memverifikasi dokumen"),
      },
    );
  }

  async function handleReject(doc: UserDocWithUrl) {
    if (!reviewNotes.trim()) {
      toast.error("Berikan alasan penolakan");
      return;
    }
    updateReview.mutate(
      { docId: doc.id, verified: false, notes: reviewNotes },
      {
        onSuccess: () => {
          toast.success("Dokumen ditolak");
          setSelectedDoc(null);
          setReviewNotes("");
        },
        onError: () => toast.error("Gagal menolak dokumen"),
      },
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dokumen Legalitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Memuat dokumen...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dokumen Legalitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-8 text-muted-foreground">
            <ScrollText className="h-10 w-10 mb-3" />
            <p className="text-sm">Belum ada dokumen</p>
            <p className="text-xs mt-1">{userName || "Pengguna"} belum mengunggah dokumen legalitas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Dokumen Legalitas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {doc.doc_name || DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {doc.verified ? (
                  <Badge variant="default" className="bg-green-600">Terverifikasi</Badge>
                ) : (
                  <Badge variant="secondary">Menunggu</Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDoc(doc);
                    setReviewNotes(doc.notes || "");
                  }}
                >
                  Review
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedDoc} onOpenChange={(open) => {
        if (!open) { setSelectedDoc(null); setReviewNotes(""); }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review Dokumen</DialogTitle>
            <DialogDescription>
              {selectedDoc?.doc_name || (selectedDoc && DOC_TYPE_LABELS[selectedDoc.doc_type])}
            </DialogDescription>
          </DialogHeader>

          {selectedDoc && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href={selectedDoc.fileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Buka Dokumen
                  </a>
                </Button>
                {selectedDoc.verified && (
                  <Badge variant="default" className="bg-green-600">Terverifikasi</Badge>
                )}
              </div>

              {selectedDoc.notes && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Catatan sebelumnya:</p>
                  <p className="text-sm">{selectedDoc.notes}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="review-notes">Catatan Review</Label>
                <Textarea
                  id="review-notes"
                  placeholder="Tambahkan catatan (wajib jika menolak)"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setSelectedDoc(null); setReviewNotes(""); }}>
              Batal
            </Button>
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => selectedDoc && handleReject(selectedDoc)}
              disabled={updateReview.isPending || !reviewNotes.trim()}
            >
              {updateReview.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              Tolak
            </Button>
            <Button
              variant="default"
              className="gap-2 bg-green-600 hover:bg-green-700"
              onClick={() => selectedDoc && handleApprove(selectedDoc)}
              disabled={updateReview.isPending}
            >
              {updateReview.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Setujui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
