'use client';

import { useState } from 'react';
import ContentModeration from '../../_components/ContentModeration';
import { mockRecruitmentPosts } from '../../_data/mockData';
import type { RecruitmentPost } from '../../_types';
import { 
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function PostsManagementPage() {
  const [posts, setPosts] = useState<RecruitmentPost[]>(mockRecruitmentPosts);

  const handleApprove = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, status: 'active' } : post
      )
    );
    console.log('Post approved:', postId);
  };

  const handleReject = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, status: 'removed' } : post
      )
    );
    console.log('Post rejected:', postId);
  };

  const handleView = (postId: string) => {
    console.log('View post:', postId);
    // TODO: Implement post detail view
  };

  const activePosts = posts.filter(p => p.status === 'active').length;
  const reportedPosts = posts.filter(p => p.status === 'reported').length;
  const removedPosts = posts.filter(p => p.status === 'removed').length;
  const totalApplications = posts.reduce((sum, post) => sum + post.applications, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-heading-ja">
            投稿管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-body-ja">
            募集投稿の承認・管理・モデレーション
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <DocumentTextIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                総投稿数
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {posts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                アクティブ
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activePosts}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {posts.length > 0 ? ((activePosts / posts.length) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                報告済み
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reportedPosts}
              </p>
              {reportedPosts > 0 && (
                <p className="text-xs text-red-500">
                  要対応
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-purple-500">{totalApplications}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                総応募数
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalApplications}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                平均 {posts.length > 0 ? (totalApplications / posts.length).toFixed(1) : 0}件/投稿
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Actions */}
      {reportedPosts > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
                緊急対応が必要な投稿があります
              </h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                {reportedPosts}件の報告された投稿を確認してください。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Moderation Component */}
      <ContentModeration
        type="posts"
        items={posts}
        onApprove={handleApprove}
        onReject={handleReject}
        onView={handleView}
      />
    </div>
  );
}