select 'careers' as tabla, count(*) as total from public.careers
union all
select 'recommendations', count(*) from public.recommendations;

select id, nombre, duracion, modalidad from public.careers order by nombre;

select r.id, u.nombre as usuario, c.nombre as carrera, r.puntaje, r.resultado
from public.recommendations r
join public.users u on u.id = r.user_id
join public.careers c on c.id = r.career_id
order by r.id;

-- Resultado esperado: cero filas.
select r.id as recomendacion_sin_relacion
from public.recommendations r
left join public.users u on u.id = r.user_id
left join public.careers c on c.id = r.career_id
where u.id is null or c.id is null;

-- Resultado esperado: cero filas.
select user_id, career_id, count(*) as duplicados
from public.recommendations
group by user_id, career_id
having count(*) > 1;
