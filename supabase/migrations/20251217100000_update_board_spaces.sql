-- Update board_spaces table to include 'empty' type
ALTER TABLE board_spaces DROP CONSTRAINT board_spaces_type_check;
ALTER TABLE board_spaces ADD CONSTRAINT board_spaces_type_check CHECK (type IN ('product', 'penalty', 'empty'));

-- Update first 5 positions (0-4) to 'empty'
UPDATE board_spaces SET type = 'empty' WHERE position IN (0, 1, 2, 3, 4);