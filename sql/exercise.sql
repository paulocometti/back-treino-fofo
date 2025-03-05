CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


INSERT INTO exercise (id, name)
VALUES
    (uuid_generate_v4()::text, 'Supino reto'),             -- Peito
    (uuid_generate_v4()::text, 'Supino inclinado'),         -- Peito

    (uuid_generate_v4()::text, 'Remada curvada'),           -- Costas
    (uuid_generate_v4()::text, 'Puxada frontal'),           -- Costas

    (uuid_generate_v4()::text, 'Rosca direta'),             -- Bíceps
    (uuid_generate_v4()::text, 'Rosca alternada'),          -- Bíceps

    (uuid_generate_v4()::text, 'Tríceps pulley'),           -- Tríceps
    (uuid_generate_v4()::text, 'Tríceps testa'),            -- Tríceps

    (uuid_generate_v4()::text, 'Desenvolvimento militar'),  -- Ombros
    (uuid_generate_v4()::text, 'Elevação lateral'),         -- Ombros

    (uuid_generate_v4()::text, 'Agachamento livre'),        -- Pernas
    (uuid_generate_v4()::text, 'Leg press'),                -- Pernas

    (uuid_generate_v4()::text, 'Crunch abdominal'),         -- Abdômen
    (uuid_generate_v4()::text, 'Prancha abdominal'),        -- Abdômen

    (uuid_generate_v4()::text, 'Hip thrust'),               -- Glúteos
    (uuid_generate_v4()::text, 'Abdução de quadril'),       -- Glúteos

    (uuid_generate_v4()::text, 'Elevação de panturrilha'),  -- Panturrilhas
    (uuid_generate_v4()::text, 'Panturrilha sentado'),      -- Panturrilhas

    (uuid_generate_v4()::text, 'Elevação frontal'),         -- Deltóides
    (uuid_generate_v4()::text, 'Desenvolvimento Arnold'),   -- Deltóides

    (uuid_generate_v4()::text, 'Encolhimento de ombros'),   -- Trapézio
    (uuid_generate_v4()::text, 'Remada alta'),              -- Trapézio

    (uuid_generate_v4()::text, 'Extensão de pernas'),       -- Quadríceps
    (uuid_generate_v4()::text, 'Agachamento hack'),         -- Quadríceps

    (uuid_generate_v4()::text, 'Mesa flexora'),             -- Posterior de Coxa
    (uuid_generate_v4()::text, 'Stiff'),                    -- Posterior de Coxa

    (uuid_generate_v4()::text, 'Adutor na máquina'),        -- Adutores
    (uuid_generate_v4()::text, 'Cadeira adutora'),          -- Adutores

    (uuid_generate_v4()::text, 'Flexão de pernas deitado'), -- Isquiotibiais
    (uuid_generate_v4()::text, 'Flexão de pernas sentado'); -- Isquiotibiais
