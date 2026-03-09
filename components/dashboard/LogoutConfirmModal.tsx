"use client";

import { useState, useEffect } from "react";
import {
  LogOut,
  AlertTriangle,
  X
} from "lucide-react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm }: LogoutConfirmModalProps) {
  const [animateIn, setAnimateIn] = useState(false);

  // Fix: useEffect use karo, useState mein do arguments mat do
  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleConfirm = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onConfirm();
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className={`logout-modal-overlay ${animateIn ? 'show' : ''}`} onClick={handleClose}>
      <div className={`logout-modal-container ${animateIn ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="logout-modal-header">
          <div className="warning-icon">
            <AlertTriangle />
          </div>
          <button className="logout-modal-close" onClick={handleClose}>
            <X />
          </button>
        </div>

        {/* Modal Body */}
        <div className="logout-modal-body">
          <h3>Logout Confirmation</h3>
          <p>Are you sure you want to logout?</p>
          
          <div className="logout-info">
            <LogOut className="info-icon" />
            <div className="info-text">
              <span>You will be redirected to login page</span>
              <small>Any unsaved changes will be lost</small>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="logout-modal-footer">
          <button className="logout-cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button className="logout-confirm-btn" onClick={handleConfirm}>
            <LogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}