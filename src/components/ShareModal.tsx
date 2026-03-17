import { useState, useEffect, useRef } from 'react';
import type { RaceRecord } from '../types';
import { generateShareImage, downloadShareImage, nativeShareImage } from '../lib/canvas';

interface ShareModalProps {
  record: RaceRecord;
  runnerName: string;
  onClose: () => void;
}

export function ShareModal({ record, runnerName, onClose }: ShareModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    generateShareImage(record, runnerName).then((blob) => {
      if (cancelled) return;
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
    };
  }, [record, runnerName]);

  useEffect(() => {
    prevUrlRef.current = previewUrl;
  }, [previewUrl]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = async () => {
    setSharing(true);
    try {
      await downloadShareImage(record, runnerName);
    } finally {
      setSharing(false);
    }
  };

  const handleNativeShare = async () => {
    setSharing(true);
    try {
      await nativeShareImage(record, runnerName);
    } finally {
      setSharing(false);
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
          <div>
            <h2 className="text-white font-semibold">シェア画像</h2>
            <p className="text-[#666] text-xs mt-0.5">SEIKO タイマーボード風デザイン</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-white transition-colors text-xl w-8 h-8 flex items-center justify-center rounded hover:bg-[#1a1a1a]"
          >
            ×
          </button>
        </div>

        {/* Preview */}
        <div className="p-4 bg-[#0A0A0A]">
          {loading ? (
            <div className="w-full aspect-[800/440] bg-[#111] rounded-lg flex items-center justify-center">
              <div className="text-[#444] text-sm animate-pulse">生成中...</div>
            </div>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="Share preview"
              className="w-full rounded-lg border border-[#1a1a1a]"
            />
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#1a1a1a]">
          {canNativeShare && (
            <button
              onClick={handleNativeShare}
              disabled={loading || sharing}
              className="flex-1 py-2.5 bg-[#FFC200] text-black font-bold text-sm rounded-lg hover:bg-[#e6af00] transition-colors disabled:opacity-50 active:scale-95"
            >
              {sharing ? '処理中...' : 'シェア'}
            </button>
          )}
          <button
            onClick={handleDownload}
            disabled={loading || sharing}
            className={`${canNativeShare ? 'flex-1' : 'flex-1'} py-2.5 bg-[#1a1a1a] text-white font-semibold text-sm rounded-lg hover:bg-[#222] transition-colors border border-[#333] disabled:opacity-50 active:scale-95`}
          >
            {sharing ? '処理中...' : 'ダウンロード'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-[#666] text-sm rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
