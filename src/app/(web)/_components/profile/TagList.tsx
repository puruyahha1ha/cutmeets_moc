import React from 'react';

interface TagListProps {
  tags: string[];
  variant?: 'requirement' | 'tag' | 'specialty' | 'date' | 'skill';
  size?: 'xs' | 'sm' | 'md';
  maxItems?: number;
  showMoreText?: string;
  className?: string;
}

const TagList: React.FC<TagListProps> = ({
  tags,
  variant = 'tag',
  size = 'xs',
  maxItems,
  showMoreText = '他{count}件',
  className = '',
}) => {
  const variantClasses = {
    requirement: 'bg-gray-100 text-gray-700',
    tag: 'bg-blue-100 text-blue-700',
    specialty: 'bg-purple-100 text-purple-700',
    date: 'bg-purple-100 text-purple-700',
    skill: 'bg-green-100 text-green-700',
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs leading-relaxed text-ja-tight',
    sm: 'px-2.5 py-1 text-xs leading-relaxed text-ja-tight',
    md: 'px-3 py-1.5 text-sm leading-relaxed text-ja-normal',
  };

  const displayTags = maxItems ? tags.slice(0, maxItems) : tags;
  const remainingCount = maxItems ? Math.max(0, tags.length - maxItems) : 0;

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {displayTags.map((tag, index) => (
        <span
          key={index}
          className={`
            inline-block rounded font-medium
            ${variantClasses[variant]}
            ${sizeClasses[size]}
          `.trim()}
        >
          {variant === 'tag' && '#'}{tag}
        </span>
      ))}
      
      {remainingCount > 0 && (
        <span
          className={`
            inline-block rounded font-medium bg-gray-200 text-gray-600 text-ja-tight
            ${sizeClasses[size]}
          `.trim()}
        >
          {showMoreText.replace('{count}', remainingCount.toString())}
        </span>
      )}
    </div>
  );
};

export default TagList;