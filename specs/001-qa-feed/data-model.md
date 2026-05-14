# Data Model: QA Feed

## Entities

### `questions` Table
Represents a topic or question submitted by a user.
- `id` (UUID or SERIAL) - Primary Key
- `title` (TEXT) - Required, the actual question content.
- `created_at` (TIMESTAMP WITH TIME ZONE) - Default `now()`

### `answers` Table
Represents an administrative answer provided to a specific question.
- `id` (UUID or SERIAL) - Primary Key
- `question_id` (UUID or INT) - Foreign Key referencing `questions.id`
- `content` (TEXT) - Required, the answer payload.
- `created_at` (TIMESTAMP WITH TIME ZONE) - Default `now()`

## State Transitions
- Questions are inherently "published" immediately upon creation. No pending/draft states as per minimal MVP scope.
