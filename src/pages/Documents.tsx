import React, { useMemo, useState } from 'react';
import { Eye, FileUp, Files, PenTool } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { PageHero } from '../components/features/PageHero';
import { MetricCard } from '../components/features/MetricCard';
import { StatusBadge } from '../components/features/StatusBadge';

type DocumentStatus = 'draft' | 'in_review' | 'signed';

interface ChamberDocument {
  id: string;
  name: string;
  status: DocumentStatus;
  owner: string;
  updatedAt: string;
  previewUrl?: string;
}

const initialDocuments: ChamberDocument[] = [
  { id: 'doc-1', name: 'SAFE Note Packet.pdf', status: 'draft', owner: 'Founder Ops', updatedAt: '2026-03-20' },
  { id: 'doc-2', name: 'Due Diligence Checklist.pdf', status: 'in_review', owner: 'Legal Counsel', updatedAt: '2026-03-18' },
  { id: 'doc-3', name: 'Board Consent Resolution.pdf', status: 'signed', owner: 'Investor Relations', updatedAt: '2026-03-16' },
];

export const DocumentsChamberPage: React.FC = () => {
  const [documents, setDocuments] = useState<ChamberDocument[]>(initialDocuments);
  const [selectedDocumentId, setSelectedDocumentId] = useState(initialDocuments[0].id);
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>('draft');
  const [signature, setSignature] = useState('');

  const selectedDocument = useMemo(
    () => documents.find((document) => document.id === selectedDocumentId) ?? documents[0],
    [documents, selectedDocumentId]
  );

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const newDocument: ChamberDocument = {
      id: `doc-${documents.length + 1}`,
      name: file.name,
      status: documentStatus,
      owner: 'You',
      updatedAt: new Date().toISOString().slice(0, 10),
      previewUrl,
    };

    setDocuments((currentDocuments) => [newDocument, ...currentDocuments]);
    setSelectedDocumentId(newDocument.id);
    setDocumentStatus('draft');
    event.target.value = '';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title="Document Chamber"
        description="Upload investor-facing PDFs, track review state, preview files instantly, and capture a lightweight signature note for the demo flow."
        actions={
          <label className="inline-flex cursor-pointer items-center">
            <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />
            <span className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700">
              <FileUp size={18} className="mr-2" />
              Upload PDF
            </span>
          </label>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Files in chamber" value={documents.length.toString()} hint="Across draft to signed" icon={<Files size={22} />} />
        <MetricCard label="In review" value={documents.filter((document) => document.status === 'in_review').length.toString()} hint="Waiting for approval" icon={<Eye size={22} />} accentClassName="bg-secondary-50 text-secondary-700" />
        <MetricCard label="Signed" value={documents.filter((document) => document.status === 'signed').length.toString()} hint="Ready for archive" icon={<PenTool size={22} />} accentClassName="bg-success-50 text-success-700" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,1.6fr]">
        <div className="space-y-6">
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Document queue</h2>
                <p className="text-sm text-gray-500">Select a file to preview it on the right.</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {documents.map((document) => (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => setSelectedDocumentId(document.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedDocumentId === document.id ? 'border-primary-200 bg-primary-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{document.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {document.owner} • Updated {document.updatedAt}
                      </p>
                    </div>
                    <StatusBadge status={document.status} />
                  </div>
                </button>
              ))}
            </CardBody>
          </Card>

          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Signature note</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input fullWidth label="Signer name" placeholder="Type a demo signature" value={signature} onChange={(event) => setSignature(event.target.value)} />
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Signature preview</p>
                <p className="mt-4 text-2xl italic text-gray-700">{signature || 'Your signature will appear here'}</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Upload status</label>
                <select
                  value={documentStatus}
                  onChange={(event) => setDocumentStatus(event.target.value as DocumentStatus)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 sm:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="in_review">In Review</option>
                  <option value="signed">Signed</option>
                </select>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">PDF preview</h2>
              <p className="text-sm text-gray-500">{selectedDocument?.name}</p>
            </div>
            {selectedDocument ? <StatusBadge status={selectedDocument.status} /> : null}
          </CardHeader>
          <CardBody>
            {selectedDocument?.previewUrl ? (
              <iframe title={selectedDocument.name} src={selectedDocument.previewUrl} className="h-[720px] w-full rounded-2xl border border-gray-200" />
            ) : (
              <div className="flex h-[720px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">No embedded preview yet</p>
                  <p className="mt-2 text-sm text-gray-500">Upload a PDF to render it in the chamber preview.</p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
