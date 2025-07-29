import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogPanel, DialogTitle, Button } from '@headlessui/react';
import { XMarkIcon, PlayIcon, StopIcon, ClockIcon, ExclamationTriangleIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { usePlaygroundStore } from '../../store/PlaygroundProvider';
import { getOrchestrationEvents, getOrchestrationStatus } from '../../utils/orchestrationHelper';
import OrchestrationProgressContent from '../shared/OrchestrationProgressContent';

const OrchestrationProgressDialog = ({ 
  isOpen = false, 
  onClose = () => {}, 
  workflowLogs = [],
  isOrchestrationRunning = false,
  onStopOrchestration = null 
}) => {
  // Validate props
  if (typeof isOpen !== 'boolean') {
    console.warn('OrchestrationProgressDialog: isOpen prop should be a boolean');
  }
  if (typeof onClose !== 'function') {
    console.warn('OrchestrationProgressDialog: onClose prop should be a function');
  }
  if (!Array.isArray(workflowLogs)) {
    console.warn('OrchestrationProgressDialog: workflowLogs prop should be an array');
  }
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Get orchestration data for header (memoized for performance)
  const orchestrationData = useMemo(() => {
    const events = getOrchestrationEvents(workflowLogs);
    const statusObject = getOrchestrationStatus(events);
    return {
      events,
      statusObject,
      isActive: statusObject?.isActive || false
    };
  }, [workflowLogs]);

  // Track elapsed time with proper cleanup and error handling
  useEffect(() => {
    if (isOrchestrationRunning && !startTime) {
      const now = Date.now();
      if (isNaN(now)) return; // Validate timestamp
      setStartTime(now);
    } else if (!isOrchestrationRunning && startTime) {
      setStartTime(null);
      setElapsedTime(0); // Reset elapsed time when stopping
    }
  }, [isOrchestrationRunning, startTime]);

  useEffect(() => {
    let interval = null;
    
    if (isOrchestrationRunning && startTime && !isNaN(startTime)) {
      interval = setInterval(() => {
        const now = Date.now();
        if (!isNaN(now) && !isNaN(startTime)) {
          setElapsedTime(now - startTime);
        }
      }, 1000);
    }
    
    // Always clear interval on cleanup
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOrchestrationRunning, startTime]);

  const formatElapsedTime = (milliseconds) => {
    // Handle invalid inputs
    if (typeof milliseconds !== 'number' || isNaN(milliseconds) || milliseconds < 0) {
      return '0:00';
    }
    
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Handle edge cases for very long running times
    if (minutes > 99) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="kb-relative kb-z-50">
      {/* Backdrop */}
      <div className="kb-fixed kb-inset-0 kb-bg-black/50" aria-hidden="true" />
      
      {/* Dialog */}
      <div className="kb-fixed kb-inset-0 kb-flex kb-items-center kb-justify-center kb-p-4">
        <DialogPanel className="kb-w-full kb-max-w-6xl kb-max-h-[90vh] kb-bg-slate-900 kb-rounded-xl kb-shadow-2xl kb-border kb-border-slate-700 kb-flex kb-flex-col">
          
          {/* Header */}
          <div className="kb-flex kb-items-center kb-justify-between kb-p-6 kb-border-b kb-border-slate-700">
            <div className="kb-flex kb-items-center kb-gap-3">
              <div className={`kb-w-10 kb-h-10 kb-rounded-full kb-flex kb-items-center kb-justify-center ${
                orchestrationData.isActive ? 'kb-bg-blue-600' : 'kb-bg-slate-700'
              }`}>
                {orchestrationData.isActive ? (
                  <PlayIcon className="kb-w-5 kb-h-5 kb-text-white" />
                ) : (
                  <CpuChipIcon className="kb-w-5 kb-h-5 kb-text-slate-400" />
                )}
              </div>
              <div>
                <DialogTitle className="kb-text-lg kb-font-semibold kb-text-slate-200">
                  Orchestration Progress
                </DialogTitle>
                <p className="kb-text-sm kb-text-slate-400">
                  {orchestrationData.isActive ? 'Orchestration is running...' : 'Orchestration completed'}
                </p>
              </div>
            </div>
            
            <div className="kb-flex kb-items-center kb-gap-3">
              {/* Elapsed Time */}
              {(isOrchestrationRunning || elapsedTime > 0) && (
                <div className="kb-flex kb-items-center kb-gap-2 kb-text-slate-400">
                  <ClockIcon className="kb-w-4 kb-h-4" />
                  <span className="kb-text-sm">{formatElapsedTime(elapsedTime)}</span>
                </div>
              )}
              
              {/* Stop Button */}
              {isOrchestrationRunning && onStopOrchestration && (
                <Button
                  onClick={onStopOrchestration}
                  className="kb-inline-flex kb-items-center kb-gap-2 kb-px-3 kb-py-1.5 kb-bg-red-600 kb-text-white kb-rounded-lg kb-text-sm hover:kb-bg-red-700 focus:kb-outline-none"
                >
                  <StopIcon className="kb-w-4 kb-h-4" />
                  Stop
                </Button>
              )}
              
              {/* Close Button */}
              <Button
                onClick={onClose}
                className="kb-p-2 kb-text-slate-400 hover:kb-text-slate-200 focus:kb-outline-none"
              >
                <XMarkIcon className="kb-w-5 kb-h-5" />
              </Button>
            </div>
          </div>

          {/* Main Content - Use Shared Component */}
          <div className="kb-flex-1 kb-overflow-hidden">
            <OrchestrationProgressContent workflowLogs={workflowLogs} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default OrchestrationProgressDialog;