import { useState } from 'react'
import { 
  FileText, CheckCircle2, AlertCircle, Clock, UploadCloud, 
  XCircle, History, Trash2, X, Eye, MoreVertical, 
  ChevronRight, Calendar, Info
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { TopBar } from '../../components/layout/TopBar'
import { cn } from '../../lib/utils'

type DocStatus = 'not_uploaded' | 'pending' | 'approved' | 'rejected'

interface DocVersion {
  id: string
  version: number
  date: string
  status: DocStatus
  reason?: string
  fileName: string
}

interface DocumentItem {
  id: string
  name: string
  description: string
  status: DocStatus
  uploadDate?: string
  version?: number
  reason?: string
  history: DocVersion[]
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      name: "Transport Operator's Licence",
      description: 'Heavy vehicle operator licence issued by your state authority',
      status: 'pending',
      uploadDate: '2026-04-20',
      version: 1,
      history: [
        { id: 'v1', version: 1, date: '2026-04-20', status: 'pending', fileName: 'license_v1.pdf' }
      ]
    },
    {
      id: 'doc-2',
      name: 'Public Liability Insurance',
      description: 'Minimum $10M cover — certificate of currency',
      status: 'rejected',
      uploadDate: '2026-04-18',
      version: 2,
      reason: 'The provided document has expired. Please upload a valid certificate of currency for the current year.',
      history: [
        { id: 'v2', version: 2, date: '2026-04-18', status: 'rejected', reason: 'The provided document has expired.', fileName: 'insurance_v2.pdf' },
        { id: 'v1', version: 1, date: '2026-04-15', status: 'rejected', reason: 'Incorrect file format.', fileName: 'insurance_v1.jpg' }
      ]
    },
    {
      id: 'doc-3',
      name: 'NHVAS Accreditation',
      description: 'Mass Management, Maintenance Management or Basic Fatigue',
      status: 'not_uploaded',
      history: []
    },
    {
      id: 'doc-4',
      name: 'Business Registration (ABN)',
      description: 'Proof of business registration',
      status: 'approved',
      uploadDate: '2026-04-10',
      version: 1,
      history: [
        { id: 'v1', version: 1, date: '2026-04-10', status: 'approved', fileName: 'abn_cert.pdf' }
      ]
    }
  ])

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null)
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, status: 'not_uploaded', uploadDate: undefined, version: undefined, history: [] } : doc
      ))
    }
  }

  const openUploadModal = (docId: string) => {
    setUploadingDocId(docId)
    setIsUploadModalOpen(true)
  }

  const openHistoryModal = (doc: DocumentItem) => {
    setSelectedDoc(doc)
    setIsHistoryModalOpen(true)
  }

  const getStatusBadge = (status: DocStatus) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 uppercase tracking-wider">
            <CheckCircle2 size={12} strokeWidth={3} /> Approved
          </div>
        )
      case 'pending':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-200 uppercase tracking-wider">
            <Clock size={12} strokeWidth={3} /> Pending
          </div>
        )
      case 'rejected':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-black border border-red-200 uppercase tracking-wider">
            <XCircle size={12} strokeWidth={3} /> Rejected
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black border border-slate-200 uppercase tracking-wider">
            <AlertCircle size={12} strokeWidth={3} /> Not Uploaded
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-slate-50/50">
      <TopBar title="Settings > Documents" subtitle="Manage your compliance documents" />
      
      <div className="flex-1 p-3 md:p-6 w-full">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div className="hidden md:block">
              <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Documents</h1>
              <p className="text-slate-500 text-sm font-medium">Upload and manage your required compliance documents.</p>
            </div>
            <Button 
              onClick={() => openUploadModal('new')}
              className="bg-brand text-white font-black text-xs uppercase tracking-widest h-10 px-6 rounded-xl shadow-lg shadow-brand/20 hover:scale-105 active:scale-95 transition-all"
            >
              <UploadCloud size={16} className="mr-2" /> Upload New
            </Button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-5 pl-8">Document Name</th>
                    <th className="p-5 text-center">Status</th>
                    <th className="p-5">Note</th>
                    <th className="p-5 text-center">Version</th>
                    <th className="p-5 text-center">Last Updated</th>
                    <th className="p-5 pr-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm shadow-indigo-100/50">
                            <FileText size={18} className="text-indigo-600" />
                          </div>
                          <div className="text-sm font-black text-slate-800 tracking-tight">{doc.name}</div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center">
                          {getStatusBadge(doc.status)}
                        </div>
                      </td>
                      <td className="p-5">
                        {doc.status === 'rejected' && doc.reason ? (
                          <div className="flex items-start gap-2 bg-red-50/50 p-2.5 rounded-xl border border-red-100 max-w-xs animate-in fade-in slide-in-from-left-2 duration-300">
                            <Info size={14} className="text-red-400 shrink-0 mt-0.5" />
                            <div className="text-[10px] text-red-600 font-bold leading-relaxed">
                              {doc.reason}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">—</span>
                        )}
                      </td>
                      <td className="p-5 text-center">
                        <span className="text-xs font-black text-slate-400 font-mono">
                          {doc.version ? `v${doc.version}` : '—'}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[11px] font-black text-slate-600 mb-0.5">{doc.uploadDate || '—'}</span>
                          {doc.uploadDate && <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Processed</span>}
                        </div>
                      </td>
                      <td className="p-5 pr-8">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {doc.status !== 'not_uploaded' && (
                            <button 
                              onClick={() => openHistoryModal(doc)}
                              className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all flex items-center justify-center"
                              title="View History"
                            >
                              <History size={16} />
                            </button>
                          )}
                          
                          {(doc.status === 'not_uploaded' || doc.status === 'rejected' || doc.status === 'pending') && (
                            <button 
                              onClick={() => openUploadModal(doc.id)}
                              className="w-8 h-8 rounded-lg bg-brand/5 text-brand hover:bg-brand hover:text-white transition-all flex items-center justify-center"
                              title="Upload / Update"
                            >
                              <UploadCloud size={16} />
                            </button>
                          )}

                          {doc.status !== 'approved' && doc.status !== 'not_uploaded' && (
                            <button 
                              onClick={() => handleDelete(doc.id)}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {isHistoryModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-brand p-6 flex items-center justify-between">
              <div>
                <h3 className="text-white font-black text-lg leading-none mb-1.5">Document History</h3>
                <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest">{selectedDoc.name}</p>
              </div>
              <button 
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                {selectedDoc.history.map((ver, idx) => (
                  <div key={ver.id} className="relative">
                    <div className={cn(
                      "absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ring-4 ring-slate-50 transition-colors",
                      idx === 0 ? "bg-brand" : "bg-slate-200"
                    )} />
                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800">Version {ver.version}</span>
                          {idx === 0 && <span className="text-[9px] font-black bg-brand/10 text-brand px-1.5 py-0.5 rounded uppercase tracking-tighter leading-none">Current</span>}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 font-mono">{ver.date}</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                          <FileText size={12} className="text-slate-300" />
                          {ver.fileName}
                        </div>
                        {getStatusBadge(ver.status)}
                      </div>
                      {ver.reason && (
                        <div className="mt-2 text-[10px] text-red-500 bg-red-50/50 p-2 rounded-lg border border-red-100 font-medium italic">
                          "{ver.reason}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <Button 
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-full bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest h-11 rounded-xl hover:bg-slate-300 transition-all"
              >
                Close History
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-slate-900 font-black text-lg">Upload Document</h3>
                <button 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Fill in details to continue</p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Document Name <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand transition-all font-bold placeholder:text-slate-300 shadow-sm"
                  placeholder="e.g. Public Liability Insurance"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Select File <span className="text-red-500">*</span></label>
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center bg-slate-50/30 hover:bg-slate-50 transition-all group cursor-pointer border-brand/20">
                  <div className="w-12 h-12 rounded-2xl bg-brand/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} className="text-brand" />
                  </div>
                  <div className="text-xs font-black text-slate-800 mb-1">Drop file or click to browse</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">PDF, PNG, JPG (Max 5MB)</div>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Description (Optional)</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:border-brand transition-all resize-none h-24 font-medium placeholder:text-slate-300"
                  placeholder="Add notes about this upload..."
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setIsUploadModalOpen(false)}
                className="flex-1 font-black text-xs uppercase tracking-widest h-12 rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setIsUploadModalOpen(false)}
                className="flex-1 bg-brand text-white font-black text-xs uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-brand/20"
              >
                Upload File
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
