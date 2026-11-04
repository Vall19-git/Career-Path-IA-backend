-- CareerPath AI | TP9
-- Verificación de preguntas, respuestas y rutas de aprendizaje.


-- 1. CANTIDAD DE REGISTROS


select 'test_questions' as tabla, count(*) as total
from public.test_questions

union all

select 'test_answers', count(*)
from public.test_answers

union all

select 'learning_routes', count(*)
from public.learning_routes;


-- 2. MOSTRAR PREGUNTAS

select
    id,
    enunciado,
    categoria
from public.test_questions
order by id;


-- 3. COMPROBAR RESPUESTAS Y SUS RELACIONES

select
    ta.id,
    u.nombre as usuario,
    tq.enunciado as pregunta,
    tq.categoria,
    ta.respuesta
from public.test_answers ta
join public.users u
    on u.id = ta.user_id
join public.test_questions tq
    on tq.id = ta.question_id
order by ta.id;


-- 4. COMPROBAR RUTAS Y SUS RELACIONES


select
    lr.id,
    u.nombre as usuario,
    c.nombre as carrera,
    lr.estado,
    lr.progreso
from public.learning_routes lr
join public.users u
    on u.id = lr.user_id
join public.careers c
    on c.id = lr.career_id
order by lr.id;


-- 5. BUSCAR RESPUESTAS SIN RELACIONES VÁLIDAS

select
    ta.id as respuesta_sin_relacion
from public.test_answers ta
left join public.users u
    on u.id = ta.user_id
left join public.test_questions tq
    on tq.id = ta.question_id
where u.id is null
   or tq.id is null;


-- 6. BUSCAR RUTAS SIN RELACIONES VÁLIDAS

select
    lr.id as ruta_sin_relacion
from public.learning_routes lr
left join public.users u
    on u.id = lr.user_id
left join public.careers c
    on c.id = lr.career_id
where u.id is null
   or c.id is null;



-- 7. BUSCAR RESPUESTAS DUPLICADAS

select
    user_id,
    question_id,
    count(*) as duplicados
from public.test_answers
group by user_id, question_id
having count(*) > 1;



-- 8. BUSCAR RUTAS DUPLICADAS

select
    user_id,
    career_id,
    count(*) as duplicados
from public.learning_routes
group by user_id, career_id
having count(*) > 1;


-- 9. VERIFICAR PROGRESO

select
    id,
    progreso
from public.learning_routes
where progreso < 0
   or progreso > 100;