# Profile Components

This directory contains reusable UI components for the assistant profile page with consistent design system and TypeScript interfaces.

## Components Overview

### Core Components

#### `StatusBadge`
Displays status indicators with consistent colors and text mapping.
```tsx
<StatusBadge status="pending" type="application" />
<StatusBadge status="active" type="post" />
<StatusBadge status="completed" type="booking" />
```

#### `BaseCard`
Foundation card component with configurable padding, rounded corners, and shadows.
```tsx
<BaseCard padding="md" rounded="lg" border>
  {children}
</BaseCard>
```

#### `ActionButton`
Consistent button component with various variants and sizes.
```tsx
<ActionButton variant="primary" size="sm" onClick={handleClick}>
  Click me
</ActionButton>
```

#### `TagList`
Displays lists of tags with different styling variants.
```tsx
<TagList tags={['tag1', 'tag2']} variant="requirement" />
<TagList tags={['#hashtag1', '#hashtag2']} variant="tag" />
```

#### `ProgressBar`
Visual progress indicator with customizable colors and labels.
```tsx
<ProgressBar 
  current={2} 
  max={5} 
  label="応募進捗" 
  color="blue" 
/>
```

#### `EmptyState`
Consistent empty state UI with optional action buttons.
```tsx
<EmptyState
  title="データがありません"
  description="説明文がここに入ります"
  actionText="アクションボタン"
  onAction={handleAction}
  icon="document"
  variant="application"
/>
```

### Specialized Card Components

#### `ApplicationCard`
Card for displaying job application information.
```tsx
<ApplicationCard
  application={applicationData}
  onWithdraw={(id) => handleWithdraw(id)}
  onViewDetails={(id) => handleViewDetails(id)}
/>
```

#### `RecruitmentPostCard`
Card for displaying recruitment post information.
```tsx
<RecruitmentPostCard
  post={postData}
  onViewApplicants={(id) => handleViewApplicants(id)}
  onEdit={(id) => handleEdit(id)}
  onStop={(id) => handleStop(id)}
  onDelete={(id) => handleDelete(id)}
/>
```

#### `ReviewCard`
Card for displaying customer reviews and bookings.
```tsx
<ReviewCard booking={bookingData} />
```

## Design System

### Color Scheme
- **Primary**: Blue tones for main actions
- **Success**: Green tones for positive states
- **Warning**: Yellow tones for attention states
- **Danger**: Red tones for destructive actions
- **Info**: Blue tones for informational content
- **Secondary**: Gray tones for secondary actions

### Status Colors
- **Application Status**: Yellow (pending), Blue (interview), Green (accepted), Red (rejected)
- **Post Status**: Green (active), Yellow (closed), Gray (completed)
- **Booking Status**: Green (completed), Blue (upcoming)

### Spacing Scale
- `xs`: Extra small spacing/sizing
- `sm`: Small spacing/sizing
- `md`: Medium spacing/sizing (default)
- `lg`: Large spacing/sizing

## TypeScript Interfaces

All components use strict TypeScript interfaces defined in `types.ts`:

- `Application`: Job application data structure
- `RecruitmentPost`: Recruitment post data structure
- `Booking`: Customer booking/review data structure
- `ApplicationStatus`, `PostStatus`, `BookingStatus`: Status enums
- `ServiceType`, `JobType`: Service and job type enums

## Usage Example

```tsx
import {
  ApplicationCard,
  EmptyState,
  type Application
} from '../../_components/profile';

const applications: Application[] = [...];

return (
  <div className="space-y-4">
    {applications.length > 0 ? (
      applications.map((app) => (
        <ApplicationCard
          key={app.id}
          application={app}
          onWithdraw={handleWithdraw}
          onViewDetails={handleViewDetails}
        />
      ))
    ) : (
      <EmptyState
        title="応募履歴がありません"
        description="気になる求人があれば応募してみましょう"
        actionText="求人を探す"
        onAction={handleSearchJobs}
        variant="application"
      />
    )}
  </div>
);
```

## Benefits

1. **Consistency**: Unified design system across all profile sections
2. **Maintainability**: Centralized component logic and styling
3. **Type Safety**: Strong TypeScript interfaces prevent runtime errors
4. **Reusability**: Components can be used across different pages
5. **Flexibility**: Configurable props allow customization while maintaining consistency
6. **Performance**: Optimized for React rendering patterns

## File Structure

```
profile/
├── types.ts                    # TypeScript interfaces and types
├── StatusBadge.tsx            # Status indicator component
├── BaseCard.tsx               # Foundation card component
├── ActionButton.tsx           # Consistent button component
├── TagList.tsx                # Tag/chip display component
├── ProgressBar.tsx            # Progress indicator component
├── EmptyState.tsx             # Empty state component
├── ApplicationCard.tsx        # Job application card
├── RecruitmentPostCard.tsx    # Recruitment post card
├── ReviewCard.tsx             # Review/booking card
├── index.ts                   # Component exports
└── README.md                  # This documentation
```