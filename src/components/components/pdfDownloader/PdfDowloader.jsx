import React, { useState, useEffect } from 'react';
import { notify } from '../../../lib/notify';



const PDFErrorBoundary = ({ children, onRetry }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error('PDF Error Boundary caught:', error, errorInfo);
      notify( 'PDF is corrupted or failed to load.','Error');
      setHasError(true);
      setError(error);
    };

    // Simulate getDerivedStateFromError and componentDidCatch
    const errorHandler = (event) => {
      if (event.error) {
        handleError(event.error, event.errorInfo);
      }
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-lg p-5">
        <p className="text-red-500 text-base mb-4 text-center">Failed to load PDF</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => {
            setHasError(false);
            setError(null);
            onRetry();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return children;
};

const PDFDownloader = ({ pdfUrl, fileName, token, autoView = false }) => {
  const [downloading, setDownloading] = useState(false);
  const [modalVisible, setModalVisible] = useState(autoView);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  const handleDownloadAndView = async () => {
    if (!pdfUrl) {
      notify('Error', 'PDF URL is missing.');
      return;
    }
    setDownloading(true);
    try {
      const response = await fetch(pdfUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setPdfBlobUrl(blobUrl);
      setModalVisible(true);

      // Trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notify('Success', 'PDF downloaded');
    } catch (error) {
      console.error('Download Error:', error);
      notify('Error', `Failed to download the PDF: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (autoView && pdfUrl && !downloading) {
      handleDownloadAndView();
    }
  }, [autoView, pdfUrl, downloading]);

  console.log(pdfUrl, 'url');

  return (
    <PDFErrorBoundary onRetry={handleDownloadAndView}>
      <button
        className="flex items-center p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
        onClick={handleDownloadAndView}
        disabled={downloading}
      >
        {downloading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        ) : (
          <span className="text-gray-600 border p-2">Download</span>
        )}
      </button>
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[90%] h-[80%] bg-white rounded-lg p-5 flex flex-col items-center">
            {pdfBlobUrl ? (
              <>
                <iframe
                  src={pdfBlobUrl}
                  className="flex-1 w-full h-[90%] border-none"
                  title="PDF Viewer"
                  onError={(error) => {
                    console.error('PDF Error:', error);
                    notify('Error', 'PDF is corrupted or failed to load.');
                    setModalVisible(false);
                    URL.revokeObjectURL(pdfBlobUrl);
                    setPdfBlobUrl(null);
                  }}
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600"
                  onClick={() => {
                    setModalVisible(false);
                    URL.revokeObjectURL(pdfBlobUrl);
                    setPdfBlobUrl(null);
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            )}
          </div>
        </div>
      )}
    </PDFErrorBoundary>
  );
};

export default PDFDownloader;