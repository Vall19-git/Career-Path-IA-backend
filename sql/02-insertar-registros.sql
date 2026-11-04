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

insert into public.profiles (user_id, intereses, habilidades)
select u.id, datos.intereses, datos.habilidades
from (values
    ('tp9-demo-1@careerpath.invalid', 'Programación y desarrollo web', 'JavaScript, HTML y CSS'),
    ('tp9-demo-2@careerpath.invalid', 'Análisis y sistemas de información', 'Lógica, SQL y análisis'),
    ('tp9-demo-3@careerpath.invalid', 'Gestión y procesos industriales', 'Organización y resolución de problemas'),
    ('tp9-demo-4@careerpath.invalid', 'Electrónica y automatización', 'Circuitos y automatización'),
    ('tp9-demo-5@careerpath.invalid', 'Construcción e infraestructura', 'Matemática y diseño técnico')
) as datos(email, intereses, habilidades)
join public.users u on u.email = datos.email
where true
on conflict (user_id) do nothing;

insert into public.favorites (user_id, career_id)
select u.id, c.id
from (values
    ('tp9-demo-1@careerpath.invalid', 'Tecnicatura Universitaria en Programación'),
    ('tp9-demo-2@careerpath.invalid', 'Ingeniería en Sistemas de Información'),
    ('tp9-demo-3@careerpath.invalid', 'Ingeniería Industrial'),
    ('tp9-demo-4@careerpath.invalid', 'Ingeniería Electrónica'),
    ('tp9-demo-5@careerpath.invalid', 'Ingeniería Civil')
) as datos(email, carrera)
join public.users u on u.email = datos.email
join public.careers c on c.nombre = datos.carrera
where true
on conflict (user_id, career_id) do nothing;
