'use client';

import { useEffect, useState, useRef } from 'react';
import { Award, Download, Eye, Search, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/utils';
import { certificateApi } from '@/helpers/axios/api';
import Loading from '@/app/loading';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CERTIFICATE_STATS } from '@/constants/student';

interface Certificate {
  _id: string;
  course: { _id: string; title: string; thumbnail?: string; category: string };
  certificateNumber: string;
  issuedAt: string;
  courseTitleAtIssue: string;
  studentNameAtIssue: string;
}

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [downloading, setDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await certificateApi.getUserCertificates();
        setCertificates(response.data.data || []);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.courseTitleAtIssue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = async (certificate: Certificate) => {
    setDownloading(true);

    try {
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = `
                position: fixed;
                top: -9999px;
                left: -9999px;
                width: 1056px;
                height: 816px;
                background: linear-gradient(to bottom right, #eff6ff, #faf5ff);
                border: 4px solid #2563eb;
                border-radius: 8px;
                padding: 48px;
                text-align: center;
                font-family: Arial, sans-serif;
                box-sizing: border-box;
            `;

      tempContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 24px;">
                        <circle cx="12" cy="8" r="6"/>
                        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                    </svg>
                    <h2 style="font-size: 32px; font-weight: bold; color: #111827; margin: 0 0 16px 0;">Certificate of Completion</h2>
                    <p style="font-size: 18px; color: #4b5563; margin: 0 0 24px 0;">This is to certify that</p>
                    <p style="font-size: 42px; font-weight: bold; color: #2563eb; margin: 0 0 24px 0;">${
                      certificate.studentNameAtIssue
                    }</p>
                    <p style="font-size: 18px; color: #4b5563; margin: 0 0 24px 0;">has successfully completed the course</p>
                    <p style="font-size: 28px; font-weight: 600; color: #111827; margin: 0 0 32px 0;">${
                      certificate.courseTitleAtIssue
                    }</p>
                    <p style="font-size: 16px; color: #6b7280; margin: 0;">Issued on ${formatDate(
                      certificate.issuedAt
                    )}</p>
                    <p style="font-size: 14px; color: #9ca3af; margin: 16px 0 0 0; font-family: monospace;">Certificate ID: ${
                      certificate.certificateNumber
                    }</p>
                </div>
            `;

      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        removeContainer: true,
      });

      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate-${certificate.certificateNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>My Certificates</h1>
        <p className='text-gray-600'>View and download your course completion certificates</p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {CERTIFICATE_STATS({
          certificateCount: certificates.length,
          latestCertificateDate:
            certificates.length > 0 ? formatDate(certificates[0].issuedAt) : 'N/A',
        })?.map((stat, index) => (
          <Card key={index}>
            <CardContent className='p-6 flex items-center space-x-4'>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.iconBgColor} ${stat.iconColor}`}
              >
                <stat.icon className='w-6 h-6' />
              </div>
              <div>
                <h3
                  className={`${
                    stat.label === 'Latest Certificate' ? '' : 'text-2xl'
                  } font-bold text-gray-900 mb-1`}
                >
                  {stat.value}
                </h3>
                <p className='text-sm text-gray-600'>{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className='relative mb-6'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
        <Input
          type='text'
          placeholder='Search certificates...'
          className='pl-10'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Certificates Grid */}
      {filteredCertificates.length === 0 ? (
        <Card>
          <CardContent className='p-12 text-center'>
            <Award className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>No certificates yet</h3>
            <p className='text-gray-600'>Complete a course to earn your first certificate!</p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredCertificates.map((certificate) => (
            <Card
              key={certificate._id}
              className='overflow-hidden hover:shadow-lg transition-shadow'
            >
              {/* Certificate Preview */}
              <div className='h-40 bg-linear-to-br from-blue-600 to-purple-600 relative'>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='text-center text-white'>
                    <Award className='w-12 h-12 mx-auto mb-2 opacity-80' />
                    <p className='text-sm font-medium opacity-90'>Certificate of Completion</p>
                  </div>
                </div>
                <Badge className='absolute top-3 right-3 bg-white/20 text-white'>
                  {certificate?.course?.category}
                </Badge>
              </div>

              <CardContent className='p-4'>
                <h3 className='font-bold text-gray-900 mb-2 line-clamp-2'>
                  {certificate?.courseTitleAtIssue}
                </h3>
                <p className='text-sm text-gray-500 mb-3'>
                  Issued: {formatDate(certificate.issuedAt)}
                </p>
                <p className='text-xs text-gray-400 font-mono mb-4'>
                  {certificate?.certificateNumber}
                </p>

                <div className='flex space-x-2 '>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1'
                    onClick={() => setSelectedCertificate(certificate)}
                  >
                    <Eye className='w-4 h-4 mr-1' />
                    View
                  </Button>
                  <Button
                    size='sm'
                    className='flex-1'
                    onClick={() => handleDownloadPDF(certificate)}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <Loader2 className='w-4 h-4 mr-1 animate-spin' />
                    ) : (
                      <Download className='w-4 h-4 mr-1' />
                    )}
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <Card className='w-full max-w-3xl max-h-[90vh] overflow-auto'>
            <CardHeader className='border-b'>
              <CardTitle className='flex items-center justify-between'>
                <span>Certificate Details</span>
                <Button variant='ghost' size='sm' onClick={() => setSelectedCertificate(null)}>
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className='p-8'>
              {/* Certificate Preview - This will be captured for PDF */}
              <div
                ref={certificateRef}
                style={{
                  border: '4px solid #2563eb',
                  borderRadius: '8px',
                  padding: '32px',
                  background: 'linear-gradient(to bottom right, #eff6ff, #faf5ff)',
                  textAlign: 'center',
                  minHeight: '400px',
                }}
              >
                <Award
                  style={{ width: '80px', height: '80px', color: '#2563eb', margin: '0 auto 16px' }}
                />
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '8px',
                  }}
                >
                  Certificate of Completion
                </h2>
                <p style={{ color: '#4b5563', marginBottom: '16px' }}>This is to certify that</p>
                <p
                  style={{
                    fontSize: '30px',
                    fontWeight: 'bold',
                    color: '#2563eb',
                    marginBottom: '16px',
                  }}
                >
                  {selectedCertificate.studentNameAtIssue}
                </p>
                <p style={{ color: '#4b5563', marginBottom: '16px' }}>
                  has successfully completed the course
                </p>
                <p
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '24px',
                  }}
                >
                  {selectedCertificate.courseTitleAtIssue}
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  Issued on {formatDate(selectedCertificate.issuedAt)}
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    marginTop: '8px',
                    fontFamily: 'monospace',
                  }}
                >
                  Certificate ID: {selectedCertificate.certificateNumber}
                </p>
              </div>

              <div className='flex justify-center space-x-4 mt-2'>
                <Button variant='outline' onClick={() => setSelectedCertificate(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => handleDownloadPDF(selectedCertificate)}
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className='w-4 h-4 mr-2' />
                      Download PDF
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
