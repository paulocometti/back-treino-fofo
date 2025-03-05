-- Relação para a categoria "Peito"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Peito'
  AND e.name IN ('Supino reto', 'Supino inclinado');

-- Relação para a categoria "Costas"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Costas'
  AND e.name IN ('Remada curvada', 'Puxada frontal');

-- Relação para a categoria "Bíceps"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Bíceps'
  AND e.name IN ('Rosca direta', 'Rosca alternada');

-- Relação para a categoria "Tríceps"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Tríceps'
  AND e.name IN ('Tríceps pulley', 'Tríceps testa');

-- Relação para a categoria "Ombros"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Ombros'
  AND e.name IN ('Desenvolvimento militar', 'Elevação lateral');

-- Relação para a categoria "Pernas"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Pernas'
  AND e.name IN ('Agachamento livre', 'Leg press');

-- Relação para a categoria "Abdômen"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Abdômen'
  AND e.name IN ('Crunch abdominal', 'Prancha abdominal');

-- Relação para a categoria "Glúteos"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Glúteos'
  AND e.name IN ('Hip thrust', 'Abdução de quadril');

-- Relação para a categoria "Panturrilhas"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Panturrilhas'
  AND e.name IN ('Elevação de panturrilha', 'Panturrilha sentado');

-- Relação para a categoria "Deltóides"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Deltóides'
  AND e.name IN ('Elevação frontal', 'Desenvolvimento Arnold');

-- Relação para a categoria "Trapézio"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Trapézio'
  AND e.name IN ('Encolhimento de ombros', 'Remada alta');

-- Relação para a categoria "Quadríceps"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Quadríceps'
  AND e.name IN ('Extensão de pernas', 'Agachamento hack');

-- Relação para a categoria "Posterior de Coxa"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Posterior de Coxa'
  AND e.name IN ('Mesa flexora', 'Stiff');

-- Relação para a categoria "Adutores"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Adutores'
  AND e.name IN ('Adutor na máquina', 'Cadeira adutora');

-- Relação para a categoria "Isquiotibiais"
INSERT INTO exercise_category (exercise_id, category_id)
SELECT e.id, c.id
FROM exercise e, category c
WHERE c.name = 'Isquiotibiais'
  AND e.name IN ('Flexão de pernas deitado', 'Flexão de pernas sentado');
