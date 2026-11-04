insert into public.careers (nombre, duracion, modalidad, descripcion)
values
 ('Tecnicatura Universitaria en Programación', '2 años', 'Presencial', 'Formación práctica orientada al desarrollo de software, programación, bases de datos y sistemas.'),
 ('Ingeniería en Sistemas de Información', '5 años', 'Presencial', 'Formación orientada al análisis, diseño, desarrollo e implementación de sistemas de información.'),
 ('Ingeniería Industrial', '5 años', 'Presencial', 'Formación para organizar, gestionar y optimizar procesos productivos y recursos.'),
 ('Ingeniería Electrónica', '5 años y medio', 'Presencial', 'Formación para desarrollar y controlar sistemas electrónicos y proyectos de automatización.'),
 ('Ingeniería Civil', '5 años y medio', 'Presencial', 'Formación para diseñar, construir y mantener obras de infraestructura.')
on conflict (nombre) do nothing;

do $$
begin
    if (select count(*) from public.users where email in (
        'tp9-demo-1@careerpath.invalid',
        'tp9-demo-2@careerpath.invalid',
        'tp9-demo-3@careerpath.invalid',
        'tp9-demo-4@careerpath.invalid',
        'tp9-demo-5@careerpath.invalid'
    )) <> 5 then
        raise exception 'Faltan los 5 usuarios de prueba TP9. Crear primero los usuarios de prueba en el entorno de pruebas.';
    end if;
end $$;

insert into public.recommendations (user_id, career_id, puntaje, resultado)
select u.id, c.id, datos.puntaje, datos.resultado
from (values
    ('tp9-demo-1@careerpath.invalid', 'Tecnicatura Universitaria en Programación', 95.00, 'Compatibilidad muy alta'),
    ('tp9-demo-2@careerpath.invalid', 'Ingeniería en Sistemas de Información', 91.00, 'Compatibilidad alta'),
    ('tp9-demo-3@careerpath.invalid', 'Ingeniería Industrial', 87.00, 'Compatibilidad alta'),
    ('tp9-demo-4@careerpath.invalid', 'Ingeniería Electrónica', 89.00, 'Compatibilidad alta'),
    ('tp9-demo-5@careerpath.invalid', 'Ingeniería Civil', 84.00, 'Compatibilidad alta')
) as datos(email, carrera, puntaje, resultado)
join public.users u on u.email = datos.email
join public.careers c on c.nombre = datos.carrera
where true
on conflict (user_id, career_id) do nothing;
