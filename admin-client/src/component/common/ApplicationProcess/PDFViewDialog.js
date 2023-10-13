import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Document, Page } from "react-pdf";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import PDFJSWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJSWorker;

const PDFViewDialog = ({ open, onClose, pdfContent, fileName }) => {

  console.log(pdfContent)
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>View PDF Notes - {fileName}</DialogTitle> {/* Display the file name */}
      <DialogContent>
        <div style={{ width: "500px" }}>
          {pdfContent ? (
            <Document file={pdfContent}>
              <Page pageNumber={1} /> {/* Display the first page */}
            </Document>
          ) : (
            <p>No PDF content available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewDialog;
