"use client";

import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN") : "-";
const formatCurrency = (n) => n ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n) : "-";

const prepareData = (data) => data.map(row => {
  const r = { ...row };
  Object.keys(r).forEach(k => {
    if (!r[k] && r[k] !== 0) r[k] = "-";
    else if (typeof r[k] === "string" && r[k].match(/\d{4}-\d{2}-\d{2}T/)) r[k] = formatDate(r[k]);
    else if (typeof r[k] === "number" && k.toLowerCase().includes("amount") || k.toLowerCase().includes("balance")) r[k] = formatCurrency(r[k]);
  });
  return r;
});

export default function DocumentDownload({ data, title = "Report", buttonText = "Download List" }) {
  const [open, setOpen] = useState(false);

  const handleDownload = async (format) => {
    if (!data?.length) return toast.error("No data to download");

    const filename = `${title.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().slice(0,10)}`;

    if (format === "csv") {
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map(r => Object.values(r).map(v => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(","));
      const csv = [headers, ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${filename}.csv`; a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV downloaded");
    }

    if (format === "xlsx") {
      const { utils, writeFile } = await import("xlsx");
      const ws = utils.json_to_sheet(prepareData(data));
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Data");
      writeFile(wb, `${filename}.xlsx`);
      toast.success("Excel downloaded");
    }

    if (format === "pdf") {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ orientation: "landscape" });

      doc.setFontSize(20);
      doc.text(title, 14, 15);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, 14, 23);
      doc.text(`Total Records: ${data.length}`, 14, 30);

      const headers = Object.keys(data[0]);
      const body = prepareData(data).map(Object.values);

      autoTable(doc, {
        head: [headers.map(h => h.replace(/_/g, " ").toUpperCase())],
        body,
        startY: 38,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 247, 255] },
        margin: { top: 38, left: 8, right: 8 },
      });

      doc.save(`${filename}.pdf`);
      toast.success("PDF downloaded");
    }

    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" size="sm" className="gap-2">
        <Download className="w-4 h-4" />
        {buttonText}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download {title}</DialogTitle>
            <DialogDescription>Choose format</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-green-50" onClick={() => handleDownload("csv")}>
              <FileSpreadsheet className="w-10 h-10 text-green-600" />
              <span>CSV</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-blue-50" onClick={() => handleDownload("xlsx")}>
              <FileSpreadsheet className="w-10 h-10 text-blue-600" />
              <span>Excel</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-red-50" onClick={() => handleDownload("pdf")}>
              <FileText className="w-10 h-10 text-red-600" />
              <span>PDF</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}