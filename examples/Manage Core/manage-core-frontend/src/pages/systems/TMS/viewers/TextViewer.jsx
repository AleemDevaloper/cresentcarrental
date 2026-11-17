import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faCopy, faPrint, faDownload } from '@fortawesome/free-solid-svg-icons';

const CODE_SAMPLE = `<?php
namespace App\\Http\\Controllers\\Api;

use App\\Models\\Document;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = Document::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $documents = $query->with('uploader')
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($documents);
    }
}`;

const TextViewer = () => (
  <div className="tdc-viewer-content">
    <div className="tdc-text-toolbar">
      <button className="tdc-tb-btn"><FontAwesomeIcon icon={faPaintBrush} /></button>
      <span className="tdc-tb-divider"></span>
      <button className="tdc-tb-btn"><FontAwesomeIcon icon={faCopy} /></button>
      <button className="tdc-tb-btn"><FontAwesomeIcon icon={faPrint} /></button>
      <button className="tdc-tb-btn"><FontAwesomeIcon icon={faDownload} /></button>
      <div className="ms-auto d-flex align-items-center gap-2"><span className="text-muted small">Line 42 · UTF-8</span></div>
    </div>
    <pre className="tdc-code-viewer">{CODE_SAMPLE}</pre>
  </div>
);

export default TextViewer;
