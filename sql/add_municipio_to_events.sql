alter table public.events
add column if not exists municipio text default 'Monterrey';

update public.events
set municipio = 'Monterrey'
where municipio is null or btrim(municipio) = '';

alter table public.events
alter column municipio set default 'Monterrey';

alter table public.events
alter column municipio set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'events_municipio_check'
  ) then
    alter table public.events
    add constraint events_municipio_check
    check (
      municipio in (
        'Abasolo',
        'Agualeguas',
        'Los Aldamas',
        'Allende',
        'Anáhuac',
        'Apodaca',
        'Aramberri',
        'Benito Juárez',
        'Bustamante',
        'Cadereyta Jiménez',
        'El Carmen',
        'Cerralvo',
        'Ciénega de Flores',
        'China',
        'Doctor Arroyo',
        'Doctor Coss',
        'Doctor González',
        'Galeana',
        'García',
        'General Bravo',
        'General Escobedo',
        'General Terán',
        'General Treviño',
        'General Zaragoza',
        'General Zuazua',
        'Guadalupe',
        'Los Herreras',
        'Hidalgo',
        'Higueras',
        'Hualahuises',
        'Iturbide',
        'Juárez',
        'Lampazos de Naranjo',
        'Linares',
        'Marín',
        'Melchor Ocampo',
        'Mier y Noriega',
        'Mina',
        'Montemorelos',
        'Monterrey',
        'Parás',
        'Pesquería',
        'Los Ramones',
        'Rayones',
        'Sabinas Hidalgo',
        'Salinas Victoria',
        'San Nicolás de los Garza',
        'San Pedro Garza García',
        'Santa Catarina',
        'Santiago',
        'Vallecillo',
        'Villaldama'
      )
    );
  end if;
end $$;
