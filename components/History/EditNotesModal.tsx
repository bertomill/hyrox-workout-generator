/**
 * Edit Notes Modal Component
 * 
 * Modal for editing workout notes after completion.
 * Simple textarea with save/cancel actions.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export interface EditNotesModalProps {
  isOpen: boolean;
  workoutId: number;
  currentNotes?: string;
  onClose: () => void;
  onSave: (workoutId: number, notes: string) => Promise<void>;
}

export function EditNotesModal({ 
  isOpen, 
  workoutId, 
  currentNotes = '', 
  onClose, 
  onSave 
}: EditNotesModalProps) {
  const [notes, setNotes] = useState(currentNotes);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update notes when modal opens with new workout
  useEffect(() => {
    if (isOpen) {
      setNotes(currentNotes);
      setError(null);
    }
  }, [isOpen, currentNotes]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await onSave(workoutId, notes);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save notes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSaving) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-2xl max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Edit Notes</h2>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-600 mb-4 text-sm">
              Add notes about how the workout felt, what worked well, or areas to improve.
            </p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Felt strong on runs, struggled with wall balls..."
              disabled={isSaving}
              className="w-full min-h-[120px] p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-[#E63946] focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-50"
              maxLength={500}
            />

            <div className="text-right text-xs text-gray-500 mt-1">
              {notes.length} / 500 characters
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleSave}
                isLoading={isSaving}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditNotesModal;
