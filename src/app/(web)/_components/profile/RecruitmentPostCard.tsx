import React from 'react';
import BaseCard from './BaseCard';
import StatusBadge from './StatusBadge';
import ActionButton from './ActionButton';
import TagList from './TagList';
import ProgressBar from './ProgressBar';
import { RecruitmentPost } from './types';

interface RecruitmentPostCardProps {
  post: RecruitmentPost;
  onViewApplicants?: (id: number) => void;
  onEdit?: (id: number) => void;
  onViewHistory?: (id: number) => void;
  onStop?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const RecruitmentPostCard: React.FC<RecruitmentPostCardProps> = ({
  post,
  onViewApplicants,
  onEdit,
  onViewHistory,
  onStop,
  onDelete,
}) => {
  const getServiceTypeText = (serviceType: string) => {
    switch (serviceType) {
      case 'cut': return 'カット';
      case 'color': return 'カラー';
      case 'treatment': return 'トリートメント';
      case 'styling': return 'セット';
      case 'perm': return 'パーマ';
      default: return 'その他';
    }
  };

  return (
    <BaseCard>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-relaxed text-ja-normal">{post.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed text-ja-normal">{getServiceTypeText(post.serviceType)} • {post.location}</p>
        </div>
        <StatusBadge 
          status={post.status} 
          type="post" 
          className="ml-2" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <span className="text-gray-500 leading-relaxed text-ja-normal">料金:</span>
          <span className="ml-1 font-medium text-green-600 leading-relaxed text-ja-tight">{post.price}</span>
        </div>
        <div>
          <span className="text-gray-500 leading-relaxed text-ja-normal">所要時間:</span>
          <span className="ml-1 font-medium leading-relaxed text-ja-tight">{post.duration}</span>
        </div>
        <div>
          <span className="text-gray-500 leading-relaxed text-ja-normal">モデル募集:</span>
          <span className="ml-1 font-medium leading-relaxed text-ja-tight">
            {post.currentApplications}/{post.maxParticipants}名
          </span>
        </div>
        <div>
          <span className="text-gray-500 leading-relaxed text-ja-normal">投稿日:</span>
          <span className="ml-1 font-medium leading-relaxed text-ja-tight">
            {new Date(post.postedDate).toLocaleDateString('ja-JP')}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-3 leading-relaxed text-ja-relaxed">{post.description}</p>

      <div className="mb-3">
        <span className="text-sm text-gray-500 block mb-1 leading-relaxed text-ja-normal">モデル条件:</span>
        <TagList tags={post.requirements} variant="requirement" />
      </div>

      <div className="mb-3">
        <TagList tags={post.tags} variant="tag" />
      </div>

      <div className="mb-3">
        <span className="text-sm text-gray-500 block mb-1 leading-relaxed text-ja-normal">実施予定日:</span>
        <TagList 
          tags={post.availableDates.map(date => 
            new Date(date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
          )} 
          variant="date" 
        />
      </div>

      <ProgressBar
        current={post.currentApplications}
        max={post.maxParticipants}
        label="モデル募集進捗"
        color="blue"
        className="mb-3"
      />

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex space-x-2">
          {post.status === 'active' && (
            <>
              {onViewApplicants && (
                <ActionButton 
                  variant="info" 
                  size="xs"
                  onClick={() => onViewApplicants(post.id)}
                >
                  モデル応募者一覧
                </ActionButton>
              )}
              {onEdit && (
                <ActionButton 
                  variant="secondary" 
                  size="xs"
                  onClick={() => onEdit(post.id)}
                >
                  編集
                </ActionButton>
              )}
            </>
          )}
          {post.status === 'completed' && onViewHistory && (
            <ActionButton 
              variant="success" 
              size="xs"
              onClick={() => onViewHistory(post.id)}
            >
              実施履歴
            </ActionButton>
          )}
        </div>
        
        <div className="flex space-x-2">
          {post.status === 'active' && onStop && (
            <ActionButton 
              variant="danger" 
              size="xs"
              onClick={() => onStop(post.id)}
            >
              募集停止
            </ActionButton>
          )}
          {onDelete && (
            <ActionButton 
              variant="secondary" 
              size="xs"
              onClick={() => onDelete(post.id)}
            >
              削除
            </ActionButton>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export default RecruitmentPostCard;