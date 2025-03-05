CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


INSERT INTO category (id, name)
VALUES
    (uuid_generate_v4()::text, 'Peito'),
    (uuid_generate_v4()::text, 'Costas'),
    (uuid_generate_v4()::text, 'Bíceps'),
    (uuid_generate_v4()::text, 'Tríceps'),
    (uuid_generate_v4()::text, 'Ombros'),
    (uuid_generate_v4()::text, 'Pernas'),
    (uuid_generate_v4()::text, 'Abdômen'),
    (uuid_generate_v4()::text, 'Glúteos'),
    (uuid_generate_v4()::text, 'Panturrilhas'),
    (uuid_generate_v4()::text, 'Deltóides'),
    (uuid_generate_v4()::text, 'Trapézio'),
    (uuid_generate_v4()::text, 'Quadríceps'),
    (uuid_generate_v4()::text, 'Posterior de Coxa'),
    (uuid_generate_v4()::text, 'Adutores'),
    (uuid_generate_v4()::text, 'Isquiotibiais');
