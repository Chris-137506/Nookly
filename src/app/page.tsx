'use client';

import React, { useState } from 'react';
import { useNooklyStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { StudentView } from '@/components/StudentView';
import { ContributorView } from '@/components/ContributorView';
import { AdminView } from '@/components/AdminView';
import { ReaderModal } from '@/components/ReaderModal';
import { RejectModal } from '@/components/RejectModal';
import { ToastContainer } from '@/components/Toast';

export default function Home() {
  const store = useNooklyStore();
  const [prefilledCourseId, setPrefilledCourseId] = useState<string | undefined>();
  const [prefilledChapterId, setPrefilledChapterId] = useState<string | undefined>();

  // Count pending submissions for badge
  const pendingCount = store.materials.filter((m) => m.status === 'pending').length;
  // Count current user submissions
  const mySubmissionsCount = store.materials.filter((m) => m.contributor_nim === '24051204001').length;

  const handleSwitchToContributor = (courseId?: string, chapterId?: string) => {
    setPrefilledCourseId(courseId);
    setPrefilledChapterId(chapterId);
    store.setRole('contributor');
    store.setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center">
      {/* Centered mobile-first canvas on desktop with subtle framing */}
      <div className="w-full max-w-md min-h-screen bg-white sm:my-3 sm:rounded-3xl sm:border sm:border-slate-200/90 sm:shadow-lg flex flex-col relative overflow-hidden">
        {/* Sticky Header with Persistent Role Switcher */}
        <Header
          currentRole={store.role}
          onRoleChange={store.setRole}
          pendingCount={pendingCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-5 overflow-y-auto">
          {/* Tab Routing Logic */}
          {store.activeTab === 'browse' && (
            <StudentView
              courses={store.courses}
              chapters={store.chapters}
              materials={store.materials}
              selectedCourseId={store.selectedCourseId}
              onSelectCourse={store.setSelectedCourseId}
              onOpenReader={store.openReader}
              onSwitchToContributor={handleSwitchToContributor}
            />
          )}

          {(store.activeTab === 'upload' || store.activeTab === 'submissions') && (
            <ContributorView
              courses={store.courses}
              chapters={store.chapters}
              myMaterials={store.materials.filter((m) => m.contributor_nim === '24051204001')}
              initialCourseId={prefilledCourseId}
              initialChapterId={prefilledChapterId}
              onSubmitMaterial={store.submitMaterial}
              onOpenReader={store.openReader}
            />
          )}

          {(store.activeTab === 'admin_queue' || store.activeTab === 'analytics') && (
            <AdminView
              materials={store.materials}
              learningGaps={store.learningGaps}
              onApprove={store.approveMaterial}
              onOpenRejectModal={store.setRejectingMaterial}
              onOpenReader={store.openReader}
              onRequestTA={store.requestMaterialTA}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          currentRole={store.role}
          activeTab={store.activeTab}
          onTabChange={store.setActiveTab}
          pendingCount={pendingCount}
          mySubmissionsCount={mySubmissionsCount}
        />
      </div>

      {/* Interactive Reader Modal with Access Logger */}
      <ReaderModal
        material={store.activeReaderMaterial}
        onClose={store.closeReader}
        onDownload={store.downloadMaterial}
      />

      {/* Admin Structured Rejection Modal */}
      <RejectModal
        material={store.rejectingMaterial}
        onClose={() => store.setRejectingMaterial(null)}
        onConfirmReject={store.rejectMaterial}
      />

      {/* Toast Notification Container */}
      <ToastContainer
        toasts={store.toasts}
        onDismiss={store.removeToast}
      />
    </div>
  );
}
