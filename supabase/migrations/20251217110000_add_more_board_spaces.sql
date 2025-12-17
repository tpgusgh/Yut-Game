-- Add more board spaces for 13 products
INSERT INTO board_spaces (position, type) VALUES
  (10, 'penalty'),
  (11, 'product'),
  (12, 'penalty'),
  (13, 'product'),
  (14, 'penalty'),
  (15, 'product'),
  (16, 'penalty'),
  (17, 'product'),
  (18, 'penalty'),
  (19, 'product')
ON CONFLICT (position) DO NOTHING;