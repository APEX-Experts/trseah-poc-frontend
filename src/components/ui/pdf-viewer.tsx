"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);

  const goToPreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    if (!numPages) return;
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };
  const t = useTranslations("AdminRequests");

  return (
    <div className="flex flex-col gap-4">
      {numPages && (
        <div className="flex items-center justify-center gap-4" dir="ltr">
          <Button
            type="button"
            variant={"outline"}
            size={"icon"}
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            className="rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={24} />
          </Button>

          <span className="text-sm font-medium">
            {t("pageOf", { page: pageNumber, totalPages: numPages })}
          </span>

          <Button
            type="button"
            variant={"outline"}
            size={"icon"}
            onClick={goToNextPage}
            disabled={!numPages || pageNumber >= numPages}
            className="rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight size={24} />
          </Button>
        </div>
      )}

      <div className="flex justify-center overflow-auto">
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setPageNumber(1);
          }}
          loading={<div>Loading PDF...</div>}
        >
          <Page
            pageNumber={pageNumber}
            width={800}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
}
