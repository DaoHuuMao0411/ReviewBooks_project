-- Optional, additive-only performance index. Safe to run any time, not required.
-- Not auto-applied by the app; run manually only if you want it.

CREATE INDEX idx_books_category ON books(category);
