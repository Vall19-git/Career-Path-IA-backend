-- CareerPath AI | TP9
-- Datos de prueba para test vocacional y rutas de aprendizaje.

-- 1. PREGUNTAS DEL TEST VOCACIONAL

insert into public.test_questions (enunciado, categoria)
select *
from (
    values
        (
            '¿Te interesa resolver problemas utilizando programación y tecnología?',
            'Tecnología'
        ),
        (
            '¿Te gusta organizar procesos, recursos y equipos de trabajo?',
            'Gestión'
        ),
        (
            '¿Te interesa comprender cómo funcionan los circuitos y sistemas electrónicos?',
            'Electrónica'
        ),
        (
            '¿Te gustaría participar en el diseño o construcción de obras e infraestructura?',
            'Construcción'
        ),
        (
            '¿Disfrutas analizar situaciones y encontrar soluciones lógicas?',
            'Análisis'
        )
) as datos(enunciado, categoria)
where not exists (
    select 1
    from public.test_questions tq
    where tq.enunciado = datos.enunciado
);


-- 2. RESPUESTAS DE PRUEBA

insert into public.test_answers (
    user_id,
    question_id,
    respuesta
)
select
    u.id,
    tq.id,
    datos.respuesta
from (
    values
        (
            'tp9-demo-1@careerpath.invalid',
            '¿Te interesa resolver problemas utilizando programación y tecnología?',
            'Sí, mucho'
        ),
        (
            'tp9-demo-2@careerpath.invalid',
            '¿Te gusta organizar procesos, recursos y equipos de trabajo?',
            'Sí'
        ),
        (
            'tp9-demo-3@careerpath.invalid',
            '¿Te interesa comprender cómo funcionan los circuitos y sistemas electrónicos?',
            'Bastante'
        ),
        (
            'tp9-demo-4@careerpath.invalid',
            '¿Te gustaría participar en el diseño o construcción de obras e infraestructura?',
            'Sí'
        ),
        (
            'tp9-demo-5@careerpath.invalid',
            '¿Disfrutas analizar situaciones y encontrar soluciones lógicas?',
            'Sí, mucho'
        )
) as datos(email, pregunta, respuesta)

join public.users u
    on u.email = datos.email

join public.test_questions tq
    on tq.enunciado = datos.pregunta

on conflict (user_id, question_id) do nothing;



-- 3. RUTAS DE APRENDIZAJE

insert into public.learning_routes (
    user_id,
    career_id,
    estado,
    progreso
)
select
    u.id,
    c.id,
    datos.estado,
    datos.progreso
from (
    values
        (
            'tp9-demo-1@careerpath.invalid',
            'Tecnicatura Universitaria en Programación',
            'En progreso',
            40.00
        ),
        (
            'tp9-demo-2@careerpath.invalid',
            'Ingeniería en Sistemas de Información',
            'Iniciada',
            20.00
        ),
        (
            'tp9-demo-3@careerpath.invalid',
            'Ingeniería Industrial',
            'En progreso',
            55.00
        ),
        (
            'tp9-demo-4@careerpath.invalid',
            'Ingeniería Electrónica',
            'Iniciada',
            15.00
        ),
        (
            'tp9-demo-5@careerpath.invalid',
            'Ingeniería Civil',
            'En progreso',
            35.00
        )
) as datos(email, carrera, estado, progreso)

join public.users u
    on u.email = datos.email

join public.careers c
    on c.nombre = datos.carrera

on conflict (user_id, career_id) do nothing;