select 'profiles' as tabla, count(*) as total from public.profiles
union all
select 'favorites', count(*) from public.favorites;

select p.id, u.nombre as usuario, p.intereses, p.habilidades
from public.profiles p
join public.users u on u.id = p.user_id
order by p.id;

select f.id, u.nombre as usuario, c.nombre as carrera_favorita
from public.favorites f
join public.users u on u.id = f.user_id
join public.careers c on c.id = f.career_id
order by f.id;

-- Resultado esperado: cero filas.
select f.id as favorito_sin_relacion
from public.favorites f
left join public.users u on u.id = f.user_id
left join public.careers c on c.id = f.career_id
where u.id is null or c.id is null;

-- Resultado esperado: cero filas.
select user_id, career_id, count(*) as duplicados
from public.favorites
group by user_id, career_id
having count(*) > 1;
