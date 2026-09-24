# Bitácora de decisiones — Flujo de Empresas

Documento vivo. Una entrada por decisión: qué se decidió, qué se descartó y por qué.
Se actualiza en el momento en que se decide, no al final del sprint.

---

## 2026-08-28 · S0-3 · Verificación de planes de las 4 herramientas

Resultado de la verificación hecha por Ethan el viernes 28 de agosto.

| Herramienta | Plan real | Consumo actual | Veredicto |
|---|---|---|---|
| Calendly | Standard | 2 tipos de evento (Empresas y Asociaciones), permite crear más | ✅ Sin bloqueo |
| Make | Core | ~2,300 de **10,000** operaciones · 10 escenarios (7 activos) | ✅ Margen suficiente |
| Airtable | **Free** | Sin asientos de pago. Intención: pagar 2 (sistemas + voluntariado) | ⚠️ Requiere decisión |
| Fillout | Free | 1,000 respuestas/mes · permite subir archivos | ✅ Sin bloqueo |

### D-001 · Calendly soporta los 3 tipos de evento que necesita el flujo

**Decidido:** se confirma el plan Standard y que ya existen los tipos "Empresas" y "Asociaciones".
Falta crear un tercero para el curso de sensibilización en el Sprint 8.

**Consecuencia:** se elimina el riesgo "Calendly no soporta el segundo o tercer tipo de evento"
del registro de riesgos. El respaldo previsto (compartir tipo de evento + Router de
discriminación, +2 h) ya no hace falta.

**Impacto en el plan:** el paso S3-1 se acorta — el tipo de evento de Empresas ya existe,
solo hay que configurarle el parámetro de identificación y el mínimo de 1 día de anticipación.

---

### D-002 · El `record_id` NO viaja hoy por Calendly — se decide agregarlo por UTM

**Situación encontrada:** en Asociaciones el `record_id` nunca pasó por Calendly. El escenario
`A-3` identifica a quién agendó **por el correo del invitado**, y por eso tiene un Router de
3 rutas (contacto existente con organización / sin organización / contacto nuevo). Las
preguntas que sí se piden en Calendly son teléfono, nombre de la asociación y sector que apoyan.

**Decidido:** en Empresas se pasa el `record_id` como parámetro de seguimiento en el link de
Calendly que va dentro del Correo #1 de Bienvenida — el link lo generamos nosotros, así que
podemos anexarlo. Método a probar: parámetro UTM (`utm_content=<record_id>`), que llega en el
objeto `tracking` del webhook de Calendly sin depender de campos ocultos.

**Alternativa descartada:** replicar el emparejamiento por correo de Asociaciones. Se descarta
porque es frágil: si el coordinador agenda con un correo distinto al que usó para registrarse
—cosa común cuando alguien reenvía la invitación a un colega— se crea un evento huérfano que
alguien tiene que reparar a mano.

**Por qué conviene:** además de ser más robusto, **simplifica** el Bloque 2. Con `record_id`
el escenario tiene una sola ruta en vez de las 3 del Router de `A-3`.

**Pendiente de verificar:** que el parámetro UTM efectivamente llegue en el payload del webhook.
Se prueba en el Sprint 3 antes de construir el resto del escenario. Si no llega, el respaldo es
el emparejamiento por correo (el patrón de `A-3`, ya probado) y se pierde la simplificación.

---

### D-003 · Make Core tiene margen suficiente

**Decidido:** no se requiere subir de plan.

**Números (corregidos el 28-ago con lectura directa por MCP):** la licencia Core es de **10,000
operaciones**, no 14,000. Consumo real sumado de los escenarios: ~2,300, es decir **23%**.
Empresas suma ~15 escenarios, de los cuales 5 son diarios y corren aunque no haya actividad.
Estimación de consumo adicional: ~2,000–3,000 operaciones al mes con volumen bajo de empresas,
lo que deja el total alrededor del 40% de la cuota.

**A vigilar:** el consumo se revisa en el Sprint Review de S6 (22 de noviembre), cuando ya
estén corriendo los escenarios diarios de recordatorio y seguimiento. Si para entonces se pasa
del 60%, se evalúa subir de plan antes de construir los Bloques 8 y 9.

---

### D-004 · Fillout Free alcanza para todo el flujo

**Decidido:** no se requiere subir de plan.

**Razón:** 1,000 respuestas al mes cubren de sobra los 4 formularios del flujo (captura interna,
comprobante de pago, registro de voluntarios y feedback), y **sí permite subir archivos**, que
era el requisito crítico del comprobante de pago en el Bloque 5.

---

### D-005 · Airtable en plan Free → el panel se rediseña como panel compartido

**Situación encontrada:** el workspace está en plan Free, sin asientos de pago. Solo se pagarán
2 cuentas: `sistemas@encuentromundialdevalores.org` y `voluntariadocorporativo@ezer.org.mx`.

**Decidido:** Mia, Adri, Ana Cris y Gabi trabajarán desde el **login compartido de voluntariado**.
En consecuencia, el Sprint 11 construye **un panel compartido con filtro manual por Responsable**
(menú desplegable) en vez de las 4 páginas auto-filtradas del diseño original.

**Alternativa descartada:** pagar 4–5 asientos para conservar el filtro por usuario conectado.
Se descarta porque Airtable se cobra por persona y el costo mensual recurrente no se justifica
por una comodidad de filtrado que un desplegable resuelve.

**Por qué funciona:** las condiciones de visibilidad de los botones ("Enviar cotización" solo
aparece si hay asociación ligada) son **por campo, no por usuario**, así que se comportan igual
con cuenta compartida. El reparto por turnos Mia/Adri tampoco se ve afectado: vive en el campo
`Responsable` del registro, no en quién inició sesión.

**Lo que se pierde, y hay que asumirlo:** no hay vista automática de "mis empresas", y no queda
rastro de quién apretó cada botón. La trazabilidad se conserva a nivel de registro (campo
`Responsable`), no a nivel de persona conectada.

**Impacto en el plan:** S11-1 baja de 3 h a 2.5 h y S11-2 sube de 1 h a 1.5 h — el total del
Sprint 11 no cambia. El manual de operación del Sprint 12 debe **abrir** explicando el filtro
de Responsable, porque con cuenta compartida es el primer gesto de cada sesión.

**Riesgo que sube de importancia:** "el equipo no adopta el panel". Sin filtro automático, si
nadie usa el desplegable el panel se vuelve una lista indistinta y el equipo regresa a la tabla.

**Pendiente de verificar (no bloquea hoy):** los límites del plan Free en **automation runs por
mes** y **registros por base**. Los botones nativos del panel son automatizaciones de Airtable y
el primero se construye en el Sprint 6 (9 de noviembre). Si el tope resulta bajo, el respaldo es
cambiar los botones a tipo "abrir URL" apuntando a un webhook de Make, que no consume cuota de
Airtable. Fecha límite para resolverlo: Review del Sprint 5, 8 de noviembre.

---
### D-006 · El campo `Fase de asociación` NO tiene el valor "Activa" — se corrige el filtro del Bloque 4

**Verificado contra la base real** (`appZA6fc9TRQz2upb`, tabla Organizaciones) el 28 de agosto.

La recomendación original del plan era filtrar las asociaciones sugeribles con
`Fase de asociación = "Activa"`. **Ese valor no existe.** Las opciones reales del campo son:

| Valor real de `Fase de asociación` | ¿Sugerible? |
|---|---|
| Asociación Sin Reunión | No — todavía no se ha reunido |
| Reunión agendada | No |
| Reunión realizada | No |
| **Asociación Registrada sin asignación de Empresa** | **Sí — es el estado exacto que buscamos** |
| Convenio enviado | No — falta que lo regrese firmado |
| Asociación registrada con empresa asignada | Depende (ver pregunta abierta) |
| Sin respuesta | No |

El campo `Estatus` (marcado legacy) sí tiene Activa/Inactiva, pero sigue descartado: es una
segunda fuente de verdad que habría que mantener sincronizada a mano.

**Decidido:** el filtro del Bloque 4 usa `Fase de asociación = "Asociación Registrada sin
asignación de Empresa"`. Es más preciso que un "Activa" genérico porque ya incorpora la
condición de que la asociación no tenga empresa.

**Pregunta abierta para el equipo:** ¿una asociación puede atender **más de una empresa a la vez**?
Si sí, también debe sugerirse la fase "Asociación registrada con empresa asignada" y el filtro
se amplía a las dos. Si no, se queda como está. Resolver antes del Sprint 5 (26 de octubre).

---

### D-007 · La tabla Eventos no guarda la causa que la empresa quiere apoyar — BLOQUEA el Bloque 4

**Verificado contra la base real** el 28 de agosto.

El escenario de sugerencias debe cruzar el **sector de apoyo** de la asociación contra **la causa
del evento**. La tabla Organizaciones sí tiene `Sector de apoyo` (multipleSelects, 9 opciones:
Niños, Mujeres, Adultos Mayores, Educación, Discapacidad, Medio Ambiente, Comedores, Migrantes,
Vivienda Digna). **La tabla Eventos no tiene ningún campo equivalente.** No hay dónde esté escrito
qué causa le interesa a la empresa, así que hoy el cruce es imposible.

**Decidido:** agregar a Eventos un campo `Sector de interés` (multipleSelects, con **exactamente
las mismas 9 opciones** que `Sector de apoyo`, para que el cruce sea directo y no requiera
traducción), y capturarlo como pregunta del **formulario interno del Bloque 3**.

**Impacto en el plan:** el Bloque 3 (Sprint 4) suma una pregunta al Fillout y un campo a Airtable.
Es trabajo menor —15 minutos— pero **tenía que descubrirse antes del Sprint 5**, porque sin ese
campo el escenario de sugerencias no se puede construir. Se habría topado con pared el 26 de octubre.

**Criterio secundario de sugerencia:** `Municipio` existe en ambas tablas y puede usarse como
desempate cuando varias asociaciones compartan sector — sugerir primero las del mismo municipio
del evento.

---
### D-008 · El formulario de Calendly solo pide datos del invitado

**Confirmado por Ethan el 28 de agosto.** Una sola cuenta de Calendly con dos tipos de evento
("calendarios"): uno para Asociaciones y otro para Empresas. En el formulario del invitado se
piden **únicamente sus propios datos** — nada de asociación ni de fase.

**Es el diseño correcto y no se cambia.** La asociación no la elige la empresa: la liga el equipo
a mano en el Bloque 4, después de que el sistema sugiere hasta 3. Y la Fase es un concepto interno
de Airtable que el invitado no tiene por qué conocer ni podría contestar.

**Consecuencia sobre D-002:** esto *refuerza* la decisión de pasar el `record_id` por UTM. Si el
formulario no captura nada que ligue al registro de Airtable, el único vínculo disponible sería el
correo del invitado — justo el emparejamiento frágil que D-002 descarta.

**A verificar en el Sprint 3:** qué campos exactos pide hoy el tipo de evento de Empresas. Si no
incluye el nombre de la empresa, el respaldo por correo queda aún más débil y el UTM pasa de
"mejora" a "necesario".

---

### D-009 · El feedback y las fotos van en un solo correo a la empresa — PENDIENTE RESUELTO

**Resuelto el 28 de agosto.** Cierra la pregunta abierta desde julio sobre qué significa
"vincular el feedback de las empresas".

**Decidido:** después del evento, una automatización manda **un solo correo a la empresa** que
incluye la liga del formulario de feedback **y** la liga de la carpeta de fotos.

**Cambio respecto del plan original:** el plan tenía dos correos separados — el #11 con la carpeta
de fotos y el #12 con el feedback. El contenido se fusiona en el correo a la empresa.

**Lo que NO se fusiona:** el aviso interno al Responsable el día del evento se conserva. Tiene otro
destinatario y otro propósito: recordarle que **suba** las fotos. Sin ese aviso, el correo a la
empresa saldría apuntando a una carpeta vacía.

**Ajuste de tiempo necesario:** el plan mandaba el feedback a las 19:00 del mismo día del evento.
Con las fotos incluidas eso ya no funciona — nadie alcanza a subirlas. Se recomienda:

| Cuándo | A quién | Qué |
|---|---|---|
| Día del evento | Responsable (interno) | Link de la carpeta: "sube las fotos hoy" |
| Día siguiente | Empresa | Un correo con feedback + carpeta de fotos |

**Pendiente de confirmar con Ethan:** si el día siguiente es suficiente margen, o conviene mandarlo
a los 2 días. Alternativa más precisa pero más cara de construir: disparar el correo cuando alguien
marque una casilla "Fotos subidas", en vez de por tiempo.

---
## 2026-08-28 · CAMBIO DE ALCANCE — transcripción del video de back office

Ethan compartió la transcripción del video que describe el proceso real de back office.
**No coincide con el flujo sobre el que se construyó el plan del 26 de agosto.** Este registro
documenta la diferencia antes de re-planear.

### C-1 · La asociación se conecta DESPUÉS del pago, no antes

**Plan del 26 de agosto:** Contacto → Reunión → Captura → **Conectar asociación** → Cotización →
Pago. La conexión con la asociación era un candado duro: "la cotización no se puede enviar hasta
que alguien ligue una asociación a mano".

**Proceso real:** Contacto → Reunión → Captura → **Cotización** → Datos fiscales → Recibo →
Comprobante de pago → **Confirmar pago** → **Conectar asociación** → Segunda reunión.

**Consecuencia:** se invalida por completo el Bloque 4 tal como estaba diseñado, incluido el
escenario de desbloqueo (`E-6`) y la condición de visibilidad del botón "Enviar cotización".
La empresa paga primero y se le asigna asociación después.

### C-2 · El recibo fiscal va ANTES del pago, no después

**Plan:** pago confirmado → adjuntar recibo.
**Proceso real:** la empresa sube su constancia de situación fiscal → el contador elabora y sube
el recibo → se le manda a la empresa → **entonces** la empresa sube su comprobante de pago.

Queda invertido, y el Bloque 6 desaparece como etapa independiente.

### C-3 · Número de referencia — concepto nuevo y transversal

Se genera cuando la empresa llena sus datos fiscales y **acompaña todo el proceso** de esa empresa
con esa asociación o evento. Aparece en el correo al contador, al subir el recibo y al subir el
comprobante de pago. Es la llave que hila los tres formularios y los seis correos de esa etapa.
No existe hoy en Airtable: hay que crearlo como campo generado automáticamente.

### C-4 · El contador es un actor nuevo del flujo

Recibe copia del correo de datos fiscales, y tiene **su propio formulario** para subir el recibo
con el número de referencia. No estaba contemplado en el plan.

### C-5 · El motor de match es mucho más grande de lo planeado

**Plan:** `Search Records` que escribe hasta 3 nombres en un campo de texto.

**Proceso real:** una interfaz donde se busca la empresa, se ven sus datos, y un botón "busca qué
asociación hace match" devuelve un **ranking con porcentaje de compatibilidad y semáforo por
variable**. Ejemplo del video: Cardio Chavitos 90% — municipio Santa Catarina ✅, 10 voluntarios ✅,
beneficiario niños ✅, fechas ❌ (ellos junio, la empresa mayo). Segunda opción 85%, y así.

**Las 4 variables de cruce son:** municipio, número de voluntarios, tipo de beneficiario y fechas.
Esto responde y amplía D-007: no es un campo de sector, son cuatro.

### C-6 · Hay una SEGUNDA reunión por Calendly

Después de escoger asociación, la empresa agenda una segunda cita para definir el evento: fecha y
lugar del curso de sensibilización (si se pagó) y la ficha técnica con el minuto a minuto.
Calendly pasa de necesitar 2 tipos de evento a 3 o 4.

### C-7 · Etapas previas al evento que el plan no contemplaba

- Recordatorio de materiales: qué llevar, qué se juntó, quién asiste
- Captura de datos de los voluntarios que van a ir
- Firma del contrato de deslinde **antes** del evento (el plan lo tenía en el correo de pasos a seguir)
- **Llamada telefónica de confirmación con registro** de quién marcó y en qué fecha
- **Asignar quién de EZER acompaña el evento**

### C-8 · Tres feedbacks por QR, no uno

De la asociación, de la empresa **y de los participantes**. El plan solo contemplaba el de la
empresa. También queda por definir quién toma las fotografías y a dónde se suben.

### Pendientes explícitos que el propio video deja abiertos

1. Qué datos exactos se le piden a la empresa en la reunión para poder hacer el match
2. Cómo escoge la empresa la asociación: ¿reporte por correo, liga a la base, o llamada por Calendly?
3. Quién toma las fotos y dónde se suben

---
### D-010 · Los escenarios de Make los construye Claude con una skill — recálculo de esfuerzo

**Confirmado el 28 de agosto:** la skill existe y Ethan la probó — creó un escenario de Make.
Esto invalida el supuesto central del plan del 26 de agosto, que decía textualmente que "el cuello
de botella no es redactar contenido, es dar los clics reales en Make, y eso nadie más que tú lo
puede hacer".

**Recálculo aplicado** (factores por tipo de tarea, no un descuento parejo):

| Tipo de trabajo | Factor | Razón |
|---|---|---|
| Escenarios de Make | ×0.6 | Construcción por API; el 40% que queda es **revisión y prueba**, no construcción |
| Campos y vistas de Airtable | ×0.5 | El MCP de Airtable ya está disponible en la sesión |
| Documentación | ×0.5 | La redacta el agente |
| Fillout, Calendly, plantillas de Docs | ×0.9 | No hay camino por API; siguen siendo UI manual |
| Pruebas | ×0.9 | El disparo real (reservar en Calendly, revisar el correo) sigue siendo humano |
| Diseño y gestión | ×1.0 | Criterio humano; no baja |
| Sprints S0 a S3 | ×1.0 | Sin ahorro: es el periodo de calibración de la skill |

**Resultado:** 163 h → **125.75 h** (−23%). De 17 sprints a **14**. Entrega del 25 de abril al
**14 de marzo de 2027**.

**Observación de planeación:** la skill compensa casi exactamente el crecimiento de alcance que
trajo el video. El plan original cerraba el 28 de febrero; el proceso real lo empujó al 25 de
abril; la skill lo regresa al 14 de marzo.

**Lo que NO se automatiza y hay que seguir asumiendo:** las conexiones OAuth de Gmail, Airtable,
Drive y Calendly dentro de Make requieren autorización humana; los formularios de Fillout, los
tipos de evento de Calendly y las plantillas de Docs se siguen armando a mano; y las decisiones
de diseño (fórmula del match, formato del número de referencia) no bajan ni un minuto.

**Pendiente de verificar antes de dar el ahorro por bueno:** que el plan Make Core incluya acceso
a la API. Las 24.6 h de ahorro dependen enteramente de poder crear escenarios por blueprint.

**Calibración pendiente:** el factor ×0.6 es una estimación, no una medición. El Sprint 2 (E-1,
primer escenario real de Empresas) debe tratarse como **sprint de calibración**: registrar horas
reales contra estimadas y ajustar el factor para los 12 sprints restantes con dato duro.

---
### D-011 · Los ESCENARIOS DE MAKE de Asociaciones son de solo lectura (Airtable sí se puede)

**Instrucción de Ethan, 28 de agosto:** no editar ningún **escenario de Make** de Asociaciones
(`A-1` a `A-6`), aunque tengan errores. Sirven **como referencia** para construir los de Empresas.

**Alcance preciso de la restricción (aclarado el mismo día):** aplica **solo a Make**. En Airtable
sí se puede modificar lo que haga falta, incluido el lado de Asociaciones — campos, vistas e
interfaces. Eso desbloquea la tarea S1-5.

**Consecuencia inmediata sobre el Sprint 1.** Dos de sus seis tareas quedan bloqueadas porque
implican editar escenarios existentes:

| Tarea | Qué implicaba | Estado |
|---|---|---|
| S1-1 Probar `A-3` end-to-end | Solo probar | ✅ Se puede |
| S1-2 Re-probar `A4-4` | Solo probar | ✅ Se puede |
| S1-3 Re-probar `A4-5` | Probar **y agregar filtro a `A-4`** | ⚠️ Solo la parte de probar |
| S1-4 Patrón multi-contacto en `A-2.1` | **Editar `A-2.1`** | 🔴 Bloqueada |
| S1-5 Campo Convenio firmado | Interfaz de Airtable | ✅ Se puede — la restricción es solo Make |
| S1-6 Cerrar reporte de pruebas | Documentación | ✅ Se puede |

**Reencuadre del Sprint 1:** deja de ser "cerrar pendientes de Asociaciones" y pasa a ser
**"extraer y documentar los patrones que Empresas va a reusar"** — lectura de blueprints por MCP,
sin tocar nada. Libera alrededor de 3 h del sprint (solo S1-4 queda fuera; S1-5 sí se hace).

**Riesgo técnico que esto introduce, y es el punto importante:** los bugs conocidos se quedan
en producción. `A-2.1` lleva **13 errores y 6 ejecuciones en la cola de fallidos**; `A-2.2`,
3 errores y 1 atorada. Si al construir Empresas se copia el patrón de un escenario que falla,
**se replica el bug**. Regla al construir: tomar `A-1` como referencia de envío multi-contacto
(tiene Iterator y Aggregator), **nunca `A-2.1`**, y verificar en el blueprint antes de copiar,
no de memoria.

**Nota de estado (verificado por MCP el 28-ago):** de los 10 escenarios del team, 2 están marcados
`isinvalid` y desactivados — `Contacto Empresas` (el webhook viejo de empresas) e
`Integration Calendly, Airtable`. Ninguno es de Asociaciones, así que no los cubre esta restricción,
pero conviene decidir si se reusan o se archivan antes del Sprint 2.

---
## 2026-08-28 · S1 · Patrones extraídos de `A-1` (lectura, sin editar)

Leído por MCP el blueprint completo de `A-1` (217 KB, 18 módulos). Estos son los patrones
verificados que Empresas va a reusar. **Versiones tomadas de un escenario real en producción**,
no de documentación — es la referencia más confiable disponible.

### Módulos y versiones confirmadas

| Módulo | Versión |
|---|---|
| `airtable:ActionSearchRecords` | 3 |
| `airtable:ActionGetRecord` | 3 |
| `airtable:ActionUpdateRecords` | 3 |
| `google-email:sendAnEmail` | 4 |
| `builtin:BasicRouter` · `BasicFeeder` · `BasicAggregator` · `Break` | 1 |
| `http:DownloadFile` | (usado para bajar el flyer del catálogo) |

### Patrón de manejo de errores

Handler `builtin:Break` en cada módulo, con dos variantes según el riesgo:

- **`retry: true, interval: "5"`** — en Search, Get, DownloadFile y los envíos de Gmail.
- **`retry: false`** — en el `ActionUpdateRecords` que **marca la casilla de candado**, después
  del Aggregator. Correcto: reintentar el marcado del candado es justo lo que podría duplicar.

### Patrón multi-contacto (el que SÍ se copia)

`BasicFeeder` → `BasicRouter` → `sendAnEmail` (uno por contacto) → `BasicAggregator` →
`ActionUpdateRecords` con `retry: false` para marcar la casilla una sola vez.

⚠️ Este es el patrón correcto. **`A-2.1` no lo tiene bien aplicado** y por eso acumula 13 errores
y 6 ejecuciones atoradas. Al construir Empresas se copia de `A-1`, nunca de `A-2.1` (D-011).

### Hallazgo de diseño que hay que resolver antes de construir `E-1`

En Make, **un Router no puede volver a converger**. `A-3` lo resuelve **duplicando** todo lo que
va después en cada una de sus 3 rutas — por eso tiene 3 copias de `createATask` y `sendAnEmail`.

Para `E-1` eso significa duplicar el reparto por turnos, la creación del Evento y los dos correos
en ambas ramas (empresa existente / empresa nueva). Es el patrón probado de la casa, pero **duplica
el mantenimiento**: cada cambio futuro en un correo hay que hacerlo dos veces, y olvidar una es
exactamente cómo se producen inconsistencias.

**Alternativa a evaluar:** `If-Else` + `Merge`, que sí converge y deja una sola copia de todo lo
que sigue. Hay que verificar disponibilidad antes de comprometerla.

---
## 2026-08-28 · PUNTO DE RETOMADA — construcción de `E-1`

### 🔴 Hallazgo operativo: el sitio manda registros a un escenario apagado

`api/interest.js` línea 224 hace POST a `https://hook.us2.make.com/gk3msgktwdcxack4cb718h5d6a5ntfsd`
con `tipo: "registro_empresa"`. Ese webhook es el hook **2521498 ("Nuevo Prospecto")**, y pertenece
al escenario **`Contacto Empresas` (5537665), que está marcado inválido y DESACTIVADO**.

**Consecuencia:** hoy, cada empresa que se registra en el sitio dispara un webhook que nadie
procesa. La cola marca 0, así que no se están acumulando — se pierden. Esto lleva así desde al
menos el 20 de julio, fecha del último edit del escenario.

**Camino recomendado para `E-1`:** reconstruir el escenario `Contacto Empresas` (5537665) como
`E-1`, **conservando el hook 2521498**. Ventajas: no hay que tocar `api/interest.js`, la URL del
sitio sigue funcionando, y es un escenario de Empresas, así que la restricción D-011 no aplica.
Requiere confirmación de Ethan por ser una modificación sobre un escenario existente.

### Decisiones tomadas para `E-1` (aprobadas por Ethan el 28-ago)

| Punto | Decisión |
|---|---|
| Estructura de ramas | **`builtin:BasicIfElse` + `builtin:BasicMerge`** — verificados como disponibles. Una sola copia del reparto por turnos, la creación del Evento y los dos correos. |
| Conexión de Gmail | **"My Gmail connection", ID 10032499** (la misma de `A-1` y `A-2.1`) |
| Conexión de Airtable | ID 9689432 — es la única del team ⚠️ **expira el 23-oct-2026** |

### Composición propuesta de `E-1`

```
gateway:CustomWebHook (hook 2521498)
  └─ filtro: tipo = "registro_empresa"
→ airtable:ActionSearchRecords v3   (Organizaciones, por correo, normalizado a minúsculas + trim)
→ builtin:BasicIfElse
   ├─ Sí existe → airtable:ActionUpdateRecords v3   (refrescar datos del contacto)
   └─ No existe → airtable:ActionCreateRecord       (Organizaciones, Tipo=Empresa)
                → airtable:ActionCreateRecord       (Contactos, vinculado)
→ builtin:BasicMerge
→ airtable:ActionGetRecord v3        (Config → "Último responsable asignado")
→ airtable:ActionCreateRecord        (Eventos: Fase="01 Contacto", Responsable alternado)
→ google-email:sendAnEmail v4        (Correo #1 → empresa: flyer + liga de Calendly)
→ google-email:sendAnEmail v4        (Correo #2 → EZER: nuevo interesado)
→ airtable:ActionUpdateRecords v3    (Config: guardar el nuevo turno)  ← retry:false
```

**Error handlers** (patrón copiado de `A-1`): `builtin:Break` con `retry: true, interval: "5"` en
todos los módulos, **salvo** el `ActionUpdateRecords` final de Config, que va con `retry: false`
para no arriesgar un doble avance de turno.

**IDs de Airtable ya identificados:** base `appZA6fc9TRQz2upb` · Organizaciones `tblTGoIoCoRRr6dPf`
· Contactos `tbldFi4FjJj0u7eVl` · Eventos `tblpxjGTQuC3zS4U6` · Config `tblc3ef3CHaAMLe32`.

### 🔴 Lo que falta para poder construir

1. **La URL del tipo de evento de Calendly para Empresas.** Va dentro del Correo #1, con
   `?utm_content=<record_id>` anexado. Solo Ethan la tiene — no hay conector de Calendly.
2. **Confirmación** para reconstruir el escenario 5537665 en vez de crear uno nuevo.
3. **Activar las notificaciones push** (`/config`). Sin eso no hay forma de consultar a Ethan
   a mitad de una construcción, que es justo lo que el flujo de trabajo acordado requiere.
4. **El límite diario de ClickUp** se reinicia ~29-ago 18:00 para poder marcar tareas.

---
## 2026-08-29 · ✅ `E-1` CONSTRUIDO Y ACTIVO — Fase A

Escenario **5537665** reconstruido como `E-1) Registro de Empresa`, conservando el hook 2521498.
`isinvalid: false`, `isActive: true`. **Los registros del sitio ya no se pierden.**

### Estructura final

```
gateway:CustomWebHook (hook 2521498)
  └─ filtro: tipo = "registro_empresa"
→ airtable:ActionSearchRecords  (Contactos, por Correo normalizado)
→ builtin:BasicRouter
   ├─ Ruta 1 · filtro "Ya existe"  → ActionUpdateRecords (Contactos: nombre + teléfono)
   ├─ Ruta 2 · filtro "No existe"  → ActionCreateRecord (Organizaciones, Tipo=Empresa)
   │                                → ActionCreateRecord (Contactos, vinculado)
   └─ Ruta 3 · SIN filtro          → ActionSearchRecords (Contactos, re-lectura)
                                    → ActionGetRecord (Config)
                                    → ActionCreateRecord (Eventos)
                                    → ActionUpdateRecords (Config)   ← retry:false
```

### D-012 · Se descarta `If-Else + Merge`: la API de Make lo rechaza

Se intentaron **tres** estructuras de `BasicIfElse` + `BasicMerge` y la API las rechazó todas:

1. Merge al nivel superior tras el If-Else → *"BasicMerge found after BasicIfElse with no merged branches"*
2. Merge dentro de cada rama → *"BasicMerge must immediately follow a BasicIfElse"*
3. Merge arriba + segunda rama como "else" puro sin filtro → mismo error que (1)

**Solución adoptada:** `BasicRouter` con **tres** rutas, donde la tercera **no tiene filtro** y por
tanto siempre corre al final. Ahí vive todo el flujo compartido.

**Por qué es mejor que la alternativa:** logra el objetivo original —**cero duplicación** de la
lógica compartida— sin depender del Merge. `A-3` resuelve lo mismo duplicando todo en cada rama;
este patrón no. Es el patrón a reusar en los escenarios siguientes.

⚠️ Requiere `sequential: true` en el metadata del escenario para garantizar que las rutas corran
en orden y la tercera vea el resultado de las dos primeras.

### D-013 · `useColumnId: true` obliga a referenciar la salida por ID de columna

La primera prueba dejó el vínculo a Organización vacío. Causa: se mapeó
`{{8.Organización[].id}}` usando el **nombre** del campo, pero con `useColumnId: true` la salida
del módulo viene **por ID de columna**. Lo correcto es `` {{8.`fldxMJhApdpUOnZNe`}} `` — pasando el
array completo, sin `[].id`.

Aplica a **todos** los escenarios que se construyan con `useColumnId: true`.

### Resultado de las pruebas (3 POST reales al webhook)

| Caso | Resultado |
|---|---|
| Empresa nueva (Cemex) | ✅ Organización + Contacto + Evento creados, Fase `01 Contacto` |
| Empresa nueva (FEMSA) | ✅ Vínculo a Organización correcto tras el fix D-013 |
| **Mismo correo reenviado** | ✅ **NO duplicó el contacto** — lo actualizó con nombre y teléfono nuevos |
| Reparto por turnos | ✅ Mia → Adri → Mia, y Config avanzó en cada corrida |
| `capacitacion: "Sí"` | ✅ marcó la casilla "Incluye curso de sensibilización" |
| Nombre del evento vacío | ✅ cayó al respaldo `"Voluntariado " + empresa` |

Registros de prueba eliminados y Config restaurado a "Adri".

### 🔴 Hallazgo abierto: el reenvío SÍ duplica el Evento

El contacto no se duplica, pero **cada POST crea un Evento nuevo**. Si una empresa manda el
formulario dos veces, quedan dos Eventos en Fase 01 para la misma organización.

Puede ser correcto (una empresa puede hacer varios eventos al año) o puede ser un problema.
**Decisión pendiente:** ¿se agrega un candado que evite crear un Evento si ya existe uno en Fase
`01 Contacto` para esa organización? Bloquea el cierre de la tarea S2-6.

### Lo que falta de `E-1` (Fase B)

Los dos correos. **Y hay una complicación que descubrimos hoy:** `api/interest.js` **ya manda un
correo de bienvenida** al interesado, con copia a voluntariado y con el link de Calendly incluido
(`calendly.com/voluntariadocorporativo-ezer/reunion-de-voluntariado-corporativo`, línea 94).

Si `E-1` manda su propio Correo #1, la empresa recibe **dos correos**. Además, el correo del sitio
sale **antes** de que exista el registro en Airtable, así que no puede llevar el `record_id` en el
link de Calendly — lo que choca con la decisión D-002.

**Tres opciones, pendientes de decidir:**
1. Quitar el link de Calendly del correo del sitio y que `E-1` mande el suyo con `record_id`
2. Dejar el correo del sitio como está y renunciar al `record_id` (emparejar por correo, patrón `A-3`)
3. Que el sitio deje de mandar correo y `E-1` se encargue de todo

---
### D-014 · Una empresa SÍ puede tener varios eventos — no se pone candado

**Decidido por Ethan el 29-ago.** El hallazgo de que cada POST crea un Evento nuevo, aun con el
mismo correo, **es el comportamiento correcto**: una empresa puede hacer varios eventos de
voluntariado. No se agrega candado sobre la creación del Evento.

El candado que sí importa —y ya funciona— es el del **Contacto**: reenviar el formulario actualiza
el contacto existente en vez de duplicarlo. Eso queda probado.

### D-015 · Se quita el Calendly del correo del sitio; `E-1` es el único que lo manda

**Situación:** `api/interest.js` mandaba un correo de bienvenida con el link de Calendly. Como ese
correo sale **antes** de que exista el registro en Airtable, no podía llevar el `record_id`, y
además duplicaba el Correo #1 que `E-1` iba a mandar.

**Decidido:** quitar el bloque de Calendly del correo de registro del sitio. `E-1` manda el suyo,
ya con el registro creado, y por tanto **puede anexar `?utm_content={{record_id}}`** — que es lo
que exige D-002 para identificar quién agendó sin depender del correo del invitado.

**Alcance del cambio de código:** solo las variantes de **registro** (texto y HTML). El bloque de
Calendly del flujo de **catálogo/evento** se dejó intacto, porque ese camino no pasa por `E-1`
(el filtro del escenario solo deja pasar `tipo = registro_empresa`).

**Efecto secundario feliz:** el correo de registro ya decía *"no necesita hacer nada más: nosotros
le contactaremos muy pronto"* y aun así mostraba un botón de agendar. Quitarlo **resuelve una
contradicción** que ya existía en el texto, no solo el duplicado.

⚠️ **Requiere redesplegar el sitio en Vercel** para surtir efecto. Mientras no se despliegue, el
correo viejo con Calendly sigue saliendo.

---
## 2026-08-29 · ✅ `E-1` FASE B — los dos correos, desplegados y activos

Escenario 5537665 completo: **11 módulos**, `isinvalid: false`, `isActive: true`.

Ruta 3 final: `Search Contactos` → `Get Config` → `Create Evento` → `http:DownloadFile` (flyer)
→ **Correo #1 a la empresa** → **Correo #2 interno a EZER** → `Update Config` (`retry:false`).

### Los dos correos

**#1 a la empresa** — saludo personalizado, botón de Calendly con
`?utm_content={{10.id}}` (el record ID del Evento, que es lo que exige D-002), el flyer del
Catálogo 2026 adjunto, y el nombre del Responsable asignado. Paleta EZER (#1A2E6C / #E8401C).

**#2 interno a voluntariadocorporativo@** — tabla con todos los datos del registro, el Responsable
que tocó por turno, y el record ID del Evento para poder buscarlo.

Ambos con `Break, retry: false` — **reintentar un correo es lo que lo duplica**.

### D-016 · Versiones de módulo que hay que recordar

`http:DownloadFile` es **versión 4**, no 3. Se descubrió por error de despliegue y se confirmó con
`apps_recommend`. El blueprint de `A-1` no expone la versión de forma localizable, así que **no
sirve como fuente para versiones de módulo** — hay que consultarlas explícitamente.

Confirmadas hasta ahora: `airtable:*` v3 · `google-email:sendAnEmail` v4 · `http:DownloadFile` v4
· `builtin:*` v1.

También: el parámetro `description` de `scenarios_update` tiene **límite de 240 caracteres**.

### 🔴 Hallazgo de la prueba end-to-end: el correo NO es único en Contactos

La prueba se mandó con `sistemas@encuentromundialdevalores.org` y reveló que **8 contactos de
prueba comparten ese mismo correo**. El escenario tomó la ruta "Ya existe", eligió uno
arbitrariamente (`maxRecords: 1`), lo actualizó, y ligó el Evento a **la organización equivocada**.

**No es un bug del escenario** — se comportó como está diseñado. Pero expone un supuesto que hay
que hacer explícito: **la deduplicación asume que el correo identifica de forma única a un
contacto**. Con correos repetidos, elige uno al azar.

**Dos implicaciones a resolver:**
1. Limpiar los contactos de prueba duplicados antes de migrar datos reales
2. Definir qué pasa si una persona se registra con un correo ya ligado a **otra** empresa
   (¿cambió de trabajo? ¿es un despacho que representa a varias?). Hoy el Evento nuevo se cuelga
   de la empresa vieja.

Registro restaurado (`rec9GOvTOUUkR6IKr` → "Contacto VINC-1"), Evento de prueba eliminado y
Config de vuelta en "Adri".

---
## 2026-08-29 · Sprint 3 · Campos de Airtable + `E-3` construido y probado

### Campos nuevos en Eventos

| Campo | Tipo | Para qué |
|---|---|---|
| `Beneficiarios de interés` | multipleSelects, 9 opciones | Cruce del motor de match contra `Sector de apoyo` |
| `Meses de interés` | multipleSelects, 12 meses | Cruce contra `Meses disponibles` |
| `Días desde el contacto` | formula `DATETIME_DIFF(NOW(), CREATED_TIME(), 'days')` | Dispara `E-3` |
| `Seguimiento 5 días enviado` | checkbox | Candado del recordatorio |
| `Correo del contacto` | lookup vía Organización | Destinatario de `E-3` |
| `Accion E3` | formula, **nombre sin acentos** | Encapsula toda la decisión de `E-3` (ver D-017) |

**Corrección a S3-7:** el plan pedía crear 4 campos de match. **Dos ya existían** — `Municipio` y
`Número de asistentes`. Solo faltaban beneficiarios y meses.

### 🔴 Hallazgo crítico para el motor de match: las escalas de voluntarios NO coinciden

| Organizaciones · *Voluntarios que puede recibir* | Eventos · *Número de asistentes* |
|---|---|
| 1-10, 11-20, 21-30, 31-40, 41-50, 50+ | 1-5, 6-10, 11-15, 16-20, 21-25, 26-30, 31-40, 41-50, 51-75, 76-100, Más de 100 |

Son **rangos distintos**: no se pueden cruzar directamente. La fórmula de puntuación (S7-5) tiene
que convertir ambos a un número —por ejemplo el punto medio del rango— antes de comparar. Es
justo el riesgo que anticipaba S7-6, ahora confirmado con datos reales.

### D-017 · Los nombres de campo con acentos rompen las expresiones de Make

**Síntoma:** el `Search Records` de `E-3` con la fórmula
`AND({Fase} = "01 Contacto", {Días desde el contacto} >= 5)` **devolvió los 3 registros de la
tabla**, ignorando por completo el filtro. Los filtros del Router tampoco frenaron el envío, y el
correo reventó con `[400] Recipient address required`.

**Se probaron tres variantes** antes de dar con el patrón: filtros por ID de columna, filtros por
nombre acentuado, y finalmente la solución.

**Solución adoptada:** un campo calculado en Airtable con **nombre estrictamente ASCII**
(`Accion E3`) que encapsula toda la lógica de decisión y devuelve `"recordar"`, `"inactivar"` o
vacío. Del lado de Make **ninguna expresión contiene acentos**:
- fórmula de búsqueda: `{Accion E3} != ""`
- filtro ruta A: `{{1.`Accion E3`}} = "recordar"`
- filtro ruta B: `{{1.`Accion E3`}} = "inactivar"`

Los acentos viven **dentro** de la fórmula de Airtable, donde sí funcionan.

**Regla para los escenarios que faltan:** cuando la lógica de un escenario dependa de campos con
acentos, encapsularla en un campo calculado de nombre ASCII y que Make solo lea ese. Como beneficio
lateral, la condición se puede **verificar a ojo en Airtable** antes de correr nada.

⚠️ La base está llena de nombres acentuados (`Organización`, `Asociación asignada`,
`Sugerencias de asociación`, `Días…`). Esto va a reaparecer.

### `E-3` probado — ambas rutas verificadas

Escenario **6093624**, diario a las 15:00 UTC (9:00 Monterrey), activo.

| Prueba | Resultado |
|---|---|
| Sin registros en Fase 01 | ✅ corrida limpia, no manda nada |
| Ruta "recordar" | ✅ correo enviado + casilla marcada; `Accion E3` se vació sola |
| Idempotencia | ✅ con la casilla marcada ya no vuelve a entrar |
| Ruta "inactivar" | ✅ Fase → `Inactivo` + aviso interno; `Accion E3` se vació sola |

La prueba se hizo bajando el umbral de la fórmula temporalmente (de `>=5` a `>=0`), ya restaurado.
Registros de prueba eliminados.

---
### D-018 · Los webhooks de Calendly no se pueden filtrar por tipo de evento

**Verificado el 29-ago con una reserva real de Ethan.**

Las suscripciones de webhook de Calendly se hacen a nivel **usuario u organización**, nunca por
tipo de evento. Consecuencia: **toda reserva llega a todos los escenarios** que escuchen
`invitee.created`, sin importar de qué tipo de evento sea.

**Evidencia del daño:** Ethan agendó una reunión del tipo de evento de **Empresas**. `A-3`
(Asociaciones) la procesó igual, emparejó su correo con el contacto `rec9GOvTOUUkR6IKr` y
le escribió `Fecha de reunión = 31-ago 16:00` a la organización **`recIxPA5vRKSOJPTY`
("PRUEBA VINC-1")**, que es una **Asociación**. Una reserva de Empresas corrompió un registro
de Asociaciones.

**Lo bueno:** el esquema de salida del trigger **sí incluye `tracking.utm_content`**, así que el
mecanismo de D-002 es viable. Falta confirmar que se popule con una reserva que lleve el
parámetro.

**Nota técnica:** el trigger `calendly:watchInvitees` (app versión **2**, no 4) **no expone el tipo
de evento**. Solo trae `event` como URI. Para conocer el tipo hay que encadenar `getAnEvent`
— que es exactamente por lo que `A-3` tiene ese módulo en segunda posición.

### D-019 · Excepción autorizada a D-011: un filtro en `A-3`

**Autorizado por Ethan el 29-ago.** Se permite **una sola modificación** a `A-3`: agregar un filtro
de tipo de evento después del módulo `getAnEvent`. No se tocan módulos, mapeos ni correos.

**El resto de D-011 sigue vigente:** `A-1`, `A-2.1`, `A-2.2`, `A-4`, `A-5` y `A-6` intactos, y de
`A-3` solo esta condición.

**Cómo se aplica — y por qué a mano:** editar `A-3` por API obligaría a reemplazar su blueprint
completo (28 módulos), porque `scenarios_update` no hace ediciones quirúrgicas. Reescribir un
escenario estable en producción para agregar una condición es riesgo desproporcionado. **Se aplica
en la interfaz de Make**, que lo hace de forma segura en dos minutos.

---
### `E-2` construido — escenario 6093786, activo

Webhook propio: **2750604** (`E-2 Calendly Empresas`). Tipos de evento confirmados por Ethan:
`Reunión Ezer Voluntariado Corporativo (Asociaciones)` y `… (Empresas)`.

```
calendly:watchInvitees (hook 2750604)
→ calendly:getAnEvent
   └─ filtro: {{2.name}} contiene "(Empresas)"     ← ASCII puro, evita D-017
→ airtable:ActionSearchRecords (Eventos, maxRecords 1)
→ airtable:ActionUpdateRecords (Fase "02 Reunión" + Fecha de reunión)
→ google-email  (confirmación a la empresa)
→ google-email  (aviso interno a EZER)
```

### D-020 · Emparejamiento dual en una sola búsqueda, sin ramificar

En vez de un Router entre "hay `utm_content`" y "no hay", la fórmula de Airtable cubre **ambos
caminos a la vez**:

```
OR(
  RECORD_ID() = "{{1.tracking.utm_content}}",
  AND(LOWER({Correo del contacto} & "") = LOWER("{{1.email}}"), {Fase} = "01 Contacto")
)
```

Si el UTM viene, empareja por ID. Si viene vacío, `RECORD_ID()=""` es falso para todos y cae al
emparejamiento por correo restringido a Fase 01. **Un solo camino, sin Router, sin duplicar nada.**

Todos los nombres de campo de la fórmula son ASCII (`Correo del contacto`, `Fase`), respetando D-017.

El correo interno reporta **por cuál de los dos caminos emparejó**, así que la prueba de D-002 se
verifica leyendo ese correo, sin tener que inspeccionar el payload.

**Limitación conocida:** si un mismo correo tiene varios Eventos en Fase 01, `maxRecords: 1` elige
uno arbitrariamente. Es la misma familia del hallazgo de unicidad de correo del 29-ago.

**Pendiente:** la tarea de Google Tasks con la liga del formulario interno (patrón de `A-3`) se
agrega en el Sprint 4, cuando ese formulario exista.

---
### Aplicada la excepción D-019 — filtro en `A-3`, por API

**Hecho el 29-ago.** Se agregó al módulo 4 de `A-3` (`ActionSearchRecords`, el que va justo después
de `getAnEvent`):

```json
"filter": {"name": "Solo Asociaciones",
  "conditions": [[{"a": "{{3.name}}", "b": "(Asociaciones)", "o": "text:contains"}]]}
```

Al ir sobre el módulo 4, **corta todo el flujo aguas abajo** cuando la reserva no es de Asociaciones.

**Verificado tras aplicarlo:** 28 módulos intactos, las 3 rutas del Router, el `else: 1`, las
conexiones, las posiciones del canvas y las etiquetas. `isinvalid: false`, activo.

**Respaldo del blueprint original** en `respaldos-make/A-3_blueprint_2026-08-30_ANTES-del-filtro.json`.

**Cómo se hizo con seguridad:** `scenarios_update` reemplaza el blueprint completo, y el de `A-3`
pesa 106 KB — demasiado para transcribir sin riesgo. Se redujo a **16 KB** quitando solo las tres
claves que Make regenera solo (`expect`, `interface`, `samples`), conservando `designer` y `restore`
para no descuadrar el canvas ni perder las etiquetas.

**Lo que se descubrió al leer `A-3` y sube la gravedad de D-018:** su Router tiene ruta *else*
(`parameters: {"else": 1}` → la ruta 2). Si una empresa agendaba con un correo **que no estaba en
Contactos**, `A-3` no solo escribía encima: **creaba una Asociación nueva desde cero**, con
`Tipo = Asociación` y `Fase de asociación = Reunión agendada`. Peor que el caso que se detectó.

**Reparación:** se restauró `recIxPA5vRKSOJPTY` (PRUEBA VINC-1) a su `Fecha de reunión` original
del 3 de agosto, que la reserva de prueba había sobrescrito.

---
### D-021 · `text:contains` no funciona como filtro; usar `text:equal`

**Detectado el 29-ago con evidencia cruzada.** Se filtró `A-3` y `E-2` con
`{"o": "text:contains", "b": "(Asociaciones)"}` y `"(Empresas)"` respectivamente. Al agendar una
reserva **de Empresas**, ambos escenarios corrieron con **2 operaciones** y se detuvieron:
`A-3` bloqueó (correcto) y `E-2` **también bloqueó** (incorrecto — debía procesarla).

Se confirmó vía `rpc_execute` / `listMyEvents` que el nombre real del evento **sí** es
`Reunión Ezer Voluntariado Corporativo (Empresas)`. O sea: el nombre estaba bien y el operador no.

**Conclusión:** `text:contains` evalúa siempre falso. El operador probado y funcional es
**`text:equal`** — es el que usa el filtro `tipo = registro_empresa` de `E-1`, que sí funciona.

**Consecuencia grave mientras estuvo mal:** `A-3` bloqueaba **todas** las reservas, incluidas las
legítimas de Asociaciones. Estuvo así unos minutos.

**Corregido en ambos:**

| Escenario | Filtro |
|---|---|
| `E-2` | `{{2.name}}` **igual a** `Reunión Ezer Voluntariado Corporativo (Empresas)` |
| `A-3` | `{{3.name}}` **distinto de** `Reunión Ezer Voluntariado Corporativo (Empresas)` |

**Por qué `A-3` va invertido:** filtrar por "es Asociaciones" falla cerrado — si el nombre cambia,
`A-3` deja de procesar todo. Filtrar por "no es Empresas" falla **abierto**: ante cualquier
imprevisto `A-3` sigue trabajando como siempre, y a lo más deja pasar una de Empresas, que es el
comportamiento que ya tenía antes. En un escenario en producción, fallar abierto es lo correcto.

**Regla para lo que falta:** usar solo operadores verificados. `text:equal` y `exist`/`notexist`
están probados en producción. Cualquier otro, probarlo antes de confiar en él.

### Estado del Sprint 3 al cierre del 29-ago

| Tarea | Estado |
|---|---|
| S3-1 Tipo de evento de Empresas en Calendly | ✅ ya existía; nombre confirmado por API |
| S3-2 Probar el `utm_content` | ⏳ **pendiente de una reserva más** |
| S3-3 Escenario `E-2` | ✅ construido y activo (6093786) |
| S3-4 Correos de confirmación | ✅ incluidos en `E-2` |
| S3-5 Escenario diario `E-3` | ✅ construido, activo y **probado en ambas rutas** |
| S3-6 Pruebas del Bloque 2 | ⏳ depende de S3-2 |
| S3-7 Campos de match en Airtable | ✅ hecho (2 de 4 ya existían) |

**Para cerrar el sprint** falta una reserva de prueba con la liga que lleva `utm_content`. El evento
`recAetb0HbVtNs2h7` sigue en Fase 01 esperando. El correo interno de `E-2` reporta por cuál camino
emparejó, así que esa sola reserva confirma o descarta D-002.

---
## 2026-09-02 · ✅ D-002 CONFIRMADO — Sprint 3 cerrado

### El `utm_content` sí viaja en el webhook de Calendly

Probado **sin necesidad de agendar otra vez**, reproduciendo (`scenarios_replay`) la ejecución de la
reserva del 30 de agosto, ya con el filtro corregido de D-021.

| Reproducción | Operaciones | Resultado |
|---|---|---|
| 1ª | 6 | El evento pasó de Fase `01 Contacto` → **`02 Reunión`**, con la fecha del 31-ago |
| 2ª | 6 | Corrió completa **aunque el evento ya estaba en Fase 02** |

**La segunda es la prueba concluyente.** La rama de emparejamiento por correo exige
`Fase = "01 Contacto"`, condición que ya era falsa. La única vía posible para que el
`Search Records` devolviera el registro era `RECORD_ID() = "{{1.tracking.utm_content}}"`.

**Consecuencia:** D-002 queda confirmado. `E-2` empareja por ID de registro, que es robusto ante
correos distintos, invitaciones reenviadas y contactos duplicados. La rama por correo se conserva
como respaldo para quien agende desde una liga sin el parámetro.

**Técnica que vale la pena recordar:** `scenarios_replay` re-ejecuta con los datos originales del
trigger. Sirve para probar correcciones de escenarios con webhook **sin pedirle al usuario que
repita la acción**, y permite diseñar pruebas discriminantes cambiando el estado de los datos entre
reproducciones — que es exactamente como se aisló aquí cuál de las dos ramas emparejó.

### Estado final del Sprint 3 — 7 de 7

| Tarea | Estado |
|---|---|
| S3-1 Tipo de evento de Empresas | ✅ |
| S3-2 Probar el `utm_content` | ✅ **confirmado** |
| S3-3 Escenario `E-2` | ✅ activo (6093786) |
| S3-4 Correos de confirmación | ✅ |
| S3-5 Escenario diario `E-3` | ✅ activo (6093624), ambas rutas probadas |
| S3-6 Pruebas del Bloque 2 | ✅ |
| S3-7 Campos de match en Airtable | ✅ |

Registros de prueba eliminados. **Tres escenarios de Empresas en producción: `E-1`, `E-2`, `E-3`.**

---
## 2026-09-02 · Sprint 4 arrancado — 8 campos creados y spec del formulario

### 8 campos nuevos en Eventos, sin los cuales `E-4` y `E-5` no se podían construir

| Campo | Tipo | Para qué |
|---|---|---|
| `Cotizacion Doc ID` | texto | **Candado de idempotencia** de `E-4` |
| `Cotización (Doc editable)` | url | Liga al Doc |
| `Convenio Empresa Doc ID` | texto | Idem, para el convenio |
| `Convenio Empresa (Doc editable)` | url | Liga al Doc |
| `Fecha de cotizacion enviada` | fecha | **Candado contra doble envío** de `E-5` |
| `Cotizacion en proceso de envio` | casilla | Candado temporal, patrón de `A-5` |
| `Cotización PDF` | url | Adjunto del correo |
| `Convenio Empresa PDF` | url | Adjunto del correo |

**Convención de nombres aplicada:** los campos que Make **evalúa en filtros** van sin acentos
(`Cotizacion Doc ID`, `Fecha de cotizacion enviada`, `Cotizacion en proceso de envio`); los que Make
solo **escribe por ID de campo** conservan su acentuación correcta. Sale de D-017.

**Nota de nomenclatura:** el convenio de Empresas se llama `Convenio Empresa …` a propósito, para no
confundirlo con `Convenio Doc ID` de Organizaciones, que es el de Asociaciones y tiene otro ciclo.

### El formulario escribe en DOS tablas

Hallazgo al revisar el esquema: los datos fiscales (`RFC`, `Razón social`, `Uso CFDI`) viven en
**Organizaciones**, no en Eventos. `E-4` tiene que resolver el vínculo Evento → Organización antes
de escribirlos. El plan original no lo contemplaba.

### Especificación lista

`Documentos/spec-formulario-interno-empresas.md` — 12 preguntas en 4 secciones, cada una con su tipo,
sus opciones exactas y su campo destino. La captura en Fillout queda mecánica.

**Corrección al plan:** el plan pedía capturar seis variables de match. Son **cuatro**, y dos de
ellas —municipio y número de voluntarios— ya se capturan como datos del evento. No hay preguntas
duplicadas.

### 🔴 Pendiente que bloquea el diseño de `E-4`

**¿El "coordinador" es la misma persona que registró la empresa en el sitio?** El flujo manda la
cotización "al coordinador", pero el único contacto que existe hoy es quien llenó el registro. Si
pueden ser distintos, hacen falta dos preguntas más en el formulario y un campo en Airtable.

---
### D-022 · Son dos coordinadores distintos; el de la empresa va en el Evento

**Resuelto por Ethan el 2 de septiembre.**

| Coordinador | Quién es | Dónde vive |
|---|---|---|
| **De EZER** | Quien acompaña el evento; cambia de un evento a otro | Ya planeado como tarea del Sprint 13 |
| **De la empresa** | Se captura en el formulario interno. **No necesariamente quien se registró en el sitio** | Tres campos nuevos en Eventos |

Campos creados: `Coordinador empresa`, `Correo coordinador` (sin acentos, Make lo evalúa antes de
enviar) y `Teléfono del coordinador`.

**A este correo se manda la cotización** y, más adelante, los pasos a seguir tras confirmar el pago.
Si va vacío, `E-5` cae al correo del contacto que se registró.

### Por qué el coordinador NO se guarda como un Contacto más

Se consideró crearlo como registro en **Contactos** ligado a la Organización — más normalizado y
reusa el patrón de deduplicación de `E-1`. **Se descartó por un efecto secundario grave:**

`Correo del contacto principal` de Organizaciones es un **rollup sobre todos sus contactos**. Un
segundo contacto haría que devolviera **dos correos**, y eso rompería el envío de `E-3`, que lee ese
valor a través del lookup `Correo del contacto`. Es **exactamente** el problema que hoy tiene a
`A-2.1` con 13 errores y 6 ejecuciones atoradas en Asociaciones.

**Razón adicional, y de modelo:** el coordinador es **por evento**, no por empresa. La misma empresa
puede hacer dos eventos con coordinadores distintos. Pertenece al Evento.

**Regla que queda:** mientras `Correo del contacto principal` siga siendo un rollup sin agregador,
**una organización debe tener un solo contacto**. Cualquier persona adicional se guarda como campo
del Evento, no como Contacto. Revisar esto si algún día se corrige el patrón multi-contacto.

---
### Contenido del Sprint 4 listo — prompt de Fillout y las dos plantillas

`Documentos/contenido-sprint4-formulario-y-plantillas.md` trae:

1. **Prompt para la IA de Fillout** con las 15 preguntas, sus tipos y sus opciones exactas, más los
   **3 ajustes que la IA no puede hacer**: el campo oculto `record_id`, verificar que no haya
   "mejorado" las listas de opciones, y pasar el ID del formulario.
2. **Plantilla de Cotización** con marcadores `{{...}}`.
3. **Plantilla de Convenio EZER–Empresa**, marcada explícitamente como **pendiente de revisión
   legal** y con dos cláusulas señaladas como incompletas (responsabilidad/seguro, y plazo de
   cancelación).
4. **Tabla de marcadores** con el origen exacto de cada valor.

### 🔴 D-023 · El plan nunca definió de dónde sale el precio de la cotización

Al redactar la plantilla salió a la luz: la tabla `Cotizaciones` tiene `Monto`, `Folio` y `Vigencia`,
pero **nada en el flujo los llena**. El formulario no pregunta el precio y `E-4` no crea el registro
de Cotización. La cotización saldría en blanco y la cláusula CUARTA del convenio también.

Tres opciones planteadas: capturarlo en el formulario (A), calcularlo desde un tabulador en `Config`
(B), o llenarlo a mano en el Doc (C).

**Recomendación: A.** Supone lo mínimo sobre cómo cobran hoy, deja el monto en Airtable para poder
reportarlo, y llena la cláusula del convenio sin trabajo extra. Migrar de A a B después es fácil; al
revés no.

**Bloquea:** cerrar la plantilla de Cotización y, por tanto, la construcción de `E-4`.

**Relacionado:** el `{{folio}}` tampoco está definido. Se propone un autonumber con prefijo
(`COT-2026-0001`), mismo criterio que el número de referencia del Sprint 6.

---
### D-023 RESUELTO · Monto fijo de $20,000, editable

**Decisión de Ethan el 2 de septiembre.** Implementado en **tres capas**, para que nunca salga una
cotización en blanco y a la vez el precio sea flexible:

1. **Precargado en el formulario** — la pregunta 13 llega con `20000` puesto; el equipo lo cambia al
   capturar si ese evento se cotizó distinto.
2. **Respaldo en `E-4`** — si llega vacío de todas formas, el escenario lo pone en 20000.
3. **Editable en Airtable** — el campo `Monto` se puede corregir a mano antes de enviar la
   cotización, sin volver a llenar el formulario.

| Campo creado | Tipo | Detalle |
|---|---|---|
| `Monto` | Moneda MXN, 2 decimales | Predeterminado $20,000 |
| `Folio cotizacion` | Fórmula | `COT-AAAAMMDD-XXXX`, p. ej. `COT-20260902-S2H7` |

El folio se compone de la fecha de creación del evento más los últimos 4 caracteres de su ID: único,
ordenable por fecha y rastreable al registro. **Si se prefiere un consecutivo real**
(`COT-2026-0001`), Airtable tiene el tipo *Autonumber*, pero **solo se puede crear desde la interfaz**
— la API no lo expone. Son dos clics cuando se quiera.

El formulario pasa de 15 a **16 preguntas**.

### 🟡 Observación abierta: la tabla `Cotizaciones` quedó redundante

Existe desde antes, con `Folio`, `Monto`, `Vigencia`, `PDF` y `Link Convenio`, ligada a Eventos.
**Nada del flujo la llena**, y con `Monto` y `Folio cotizacion` ahora en Eventos, su información
está duplicada.

**La única razón para conservarla** sería que una empresa pudiera tener **varias cotizaciones para
el mismo evento** — una con curso y otra sin él, o una revisión de precio con histórico. Si eso pasa
en la práctica, la tabla tiene sentido y habría que usarla en serio; si no, sobra.

**No decidir esto solo:** preguntar al equipo antes de borrar nada. No bloquea el Sprint 4.

---
## 2026-09-02 · `E-4` construido — escenario 6134761, activo

Webhook Fillout **2766332** sobre el formulario `tPVivQZG99us`. Plantillas y carpeta ya conectadas.

```
fillout:newSubmission
→ airtable:ActionSearchRecords (Eventos, RECORD_ID() = record_id)
→ builtin:BasicRouter
   ├─ Ruta 1 · "record_id valido"
   │    → Update Eventos (13 campos + Fase 03 + Monto)
   │    → Update Organizaciones (RFC, Razón social, Uso CFDI)   ← filtro: tiene organización ligada
   │    → [filtro: sin cotización aún]  createAFolder (carpeta del evento)
   │    → createADocumentFromTemplate  (Cotización)
   │    → createADocumentFromTemplate  (Convenio)
   │    → Update Eventos (Doc IDs, ligas y ID de carpeta)
   └─ Ruta 2 · "record_id invalido" → correo de alerta al equipo
```

### D-024 · Los marcadores `{{...}}` chocan con la sintaxis de Make

`{{ }}` es el delimitador de expresiones de Make, así que **no puede buscar `{{razon_social}}` como
texto literal** dentro del Doc. `A-4` ya lo había resuelto usando palabras con guión bajo
(`Nombre_Asociacion`); se adopta la misma convención.

Lista de reemplazo en `Documentos/marcadores-plantillas-docs.md`. **Hasta que se apliquen, `E-4`
genera los documentos con los marcadores sin sustituir.**

**Dos reglas para marcadores nuevos:** que no aparezcan como palabra normal en la prosa (por eso el
guión bajo), y que se escriban de corrido sin formato mixto — si Docs parte la palabra en fragmentos
con distinto formato, el reemplazo de la API no la encuentra.

### D-017 refinado · el problema de los acentos es más acotado de lo que se pensó

`A-3` usa `{{4.`Organización`}}` en un filtro y **funciona**. Lo que falla es el acento **dentro de
la cadena de fórmula de Airtable** que se manda por Make, no las referencias `{{}}` a la salida de
un módulo.

Enunciado corregido: **las fórmulas de Airtable que se pasan por Make deben ser ASCII puro.** Las
referencias `{{módulo.`Campo Acentuado`}}` sí resuelven bien. `E-4` usa
`{{2.`Organización`[1]}}` con confianza sobre esta base.

### Detalles del build

- **Validación defensiva:** la búsqueda por `RECORD_ID()` va antes de tocar nada, y el Router manda
  a un correo de alerta si el ID no existe — con **los datos capturados dentro del correo**, para no
  perder lo que el equipo ya escribió.
- **Candado de idempotencia:** carpeta y documentos van detrás del filtro `Cotizacion Doc ID` vacío.
  Reenviar el formulario actualiza los datos **sin duplicar archivos**.
- **`record_id` con respaldo:** `ifempty(urlParams.record_id; answers.2hFN)` — sirve tanto si Fillout
  lo entrega como parámetro de URL como si lo entrega desde el campo oculto.
- **Datos fiscales:** el filtro "tiene organización ligada" evita que truene un evento huérfano; su
  handler es `Resume`, no `Break`, porque no poder guardar el RFC no debe frenar la generación de
  documentos.

### 🟡 Pendientes de este build

1. **Falta la pregunta del monto en el formulario.** Se armó con la versión de 15 preguntas. `E-4`
   pone $20,000 por defecto y se edita en Airtable. Si se agrega la pregunta, es remapear un campo.
2. **La carpeta padre `1dmaUIEttm6HAOOXpaoUcNHuFIJ8QtsAk`** se asumió como raíz de eventos. Si es la
   carpeta de Plantillas, las carpetas de evento quedarían anidadas donde no va.

---
### ✅ DESCARTADO · Bug de llaves sobrantes en Asociaciones — no existe

**Detectado el 2 de septiembre**, al aclarar la convención de marcadores con Ethan.

Ethan indica que las plantillas de Asociaciones usan `{{Nombre_Asociacion}}`, con dobles llaves. Pero
el blueprint de `A-4` tiene guardado en su buscar-y-reemplazar:

```json
{"text": "Nombre_Asociacion", "replaceText": "{{4.answers.k3ee9MKrBtfgufXGpwsyRD}}"}
```

**Sin llaves** — y no puede ser de otra forma, porque `{{ }}` es el delimitador de expresiones de
Make y no admite llaves literales en ese campo.

**Consecuencia:** `replaceAllText` de Google Docs sustituye **por subcadena**. Encuentra
`Nombre_Asociacion` dentro de `{{Nombre_Asociacion}}`, lo reemplaza, y **deja las llaves**. El
convenio generado diría `{{Fundación Vida Nueva Monterrey A.C.}}`.

**VERIFICADO POR ETHAN EL MISMO DÍA: los convenios de Asociaciones salen limpios, sin llaves.**
La hipótesis era incorrecta y queda descartada. Las plantillas de Asociaciones ya usan los
marcadores en el formato que Make espera.

**Lo que sí queda en pie:** las dos plantillas nuevas de Empresas se pegaron con marcadores
`{{minusculas}}`, porque así venían en el borrador que se entregó. Esos sí hay que cambiarlos a
palabras con guión bajo — la lista está en `Documentos/marcadores-plantillas-docs.md`.

**Lección que sí vale:** el módulo de Google Docs busca **por subcadena**, así que un marcador debe
ser una cadena que no aparezca en la prosa del documento. El guión bajo lo garantiza.

---
## 2026-09-02 · Re-baseline por velocidad medida — entrega al 8 de noviembre de 2026

### La medición

| | |
|---|---|
| Trabajo del plan completado | **28.5 h** (S0 parcial, S2, S3, y ~5 h de S4) |
| Horas reales invertidas | **~9 h** en 4 sesiones (28-ago, 29-ago, 30-ago, 2-sep) |
| **Velocidad medida** | **≈ 3.2× lo estimado** |

### Por qué el resto NO se acelera igual

Proyectar 3.2× sobre todo lo que falta sería deshonesto: la velocidad se midió justamente en la
parte donde la skill de Make más ayuda. Se aplicaron factores por tipo de trabajo:

| Tipo | Plan | Factor | Real | Razón |
|---|---|---|---|---|
| Automatización | 37.25 h | 0.30 | 11.2 h | Es donde la skill construye por API |
| Configuración | 27.25 h | 0.70 | 19.1 h | Fillout, Calendly, Docs: clics humanos |
| Pruebas | 23.50 h | 0.55 | 12.9 h | El `replay` ayuda, verificar sigue siendo humano |
| Diseño | 7.50 h | 1.00 | 7.5 h | Criterio humano, no baja |
| Otros | 6.75 h | — | 3.1 h | |
| **Total** | **102.25 h** | | **≈ 54 h reales** | |

A 7 h/semana: **≈ 7.7 semanas**.

### Calendario nuevo — sprints de 1 semana

La cadencia pasa de 2 semanas a **1 semana por sprint**, que es lo que la velocidad real sostiene.

| | Antes | Ahora |
|---|---|---|
| Sprints restantes | 11 de 2 semanas | 10 de 1 semana |
| **Entrega** | **14 de marzo de 2027** | **8 de noviembre de 2026** |

**Cuatro meses de adelanto.** Los pendientes de Asociaciones (`S1`) pasan a ser un track paralelo de
baja prioridad, no un sprint que bloquee: 5 de sus 6 tareas ya existían de julio o están limitadas
por D-011.

### Lo que puede echar atrás esta fecha

1. **El motor de match (S8) es trabajo novedoso**, no copiar un patrón. Es donde la skill ayuda
   menos y donde la estimación es más incierta. **Conviene re-medir después del Sprint 8** antes de
   comprometer la fecha con Dirección.
2. **Las decisiones de contenido pasaron a ser el cuello de botella**, no la programación. Por eso
   se armó el documento de delegación a Ana Cristina.
3. **La revisión legal** sigue pendiente desde julio y ahora bloquea noviembre en vez de marzo.

### Documento de delegación a Ana Cristina

`Documentos/delegacion-ana-cristina.html` — 12 decisiones agrupadas en documentos, correos, reglas
de negocio y contenido nuevo. Cada una con **fecha límite y qué bloquea si no llega**.

La más crítica: **los pesos de las cuatro variables del motor de match**, antes del 4 de octubre. No
requiere una fórmula, basta con ordenarlas por importancia y decir cuál es inaceptable si no coincide.

---

---

### D-025 · `E-2` se apagaba entero cuando la cita no tenía expediente

**2 de septiembre de 2026.** Una reserva de Calendly tumbó el escenario completo. Fueron dos fallas
encadenadas, y las dos son de diseño, no de datos.

**La primera:** `E-2` buscaba el evento en Airtable y pasaba directo a actualizarlo **sin verificar
que lo hubiera encontrado**. Cuando la búsqueda no devuelve nada, el módulo de actualización recibe
un ID vacío y Airtable contesta `[422] parameter validation failed`.

**La segunda, más grave:** el escenario tenía apagado *"permitir ejecuciones incompletas"*
(`dlq: false`) mientras sus manejadores de error usaban `Break` con reintento. `Break` **necesita**
poder guardar la ejecución incompleta para reintentarla después. Al no poder, Make no reintentó:
**desactivó el escenario**. Un solo error de un solo registro apagó la automatización entera.

**Cómo quedó:** un `BasicRouter` después de la búsqueda, con dos rutas —
- *Sí existe el expediente* → actualiza a Fase 02, confirma a la empresa, avisa al equipo.
- *No existe* → **no toca Airtable** y manda un correo interno con quién agendó, cuándo, y qué hacer
  a mano. La cita no se pierde: se convierte en un aviso.

Más `dlq: true` en la configuración del escenario.

> **Regla que sale de aquí, aplicable a todos los escenarios:** después de cualquier búsqueda que
> alimente a un módulo de escritura, va un filtro que verifique que hubo resultado. Y **todo
> escenario que use `Break` necesita `dlq: true`**, si no el manejador de error hace lo contrario de
> lo que se espera de él.

**Pendiente:** `E-1`, `E-3` y `E-4` tienen el mismo `dlq: false`. Se prende desde la configuración
del escenario en la interfaz de Make — no se hizo por API para no reescribir blueprints grandes.

---

### D-026 RESUELTO · Selector explícito de persona/empresa en catálogo y municipio

**2–4 de septiembre de 2026.** Descubierto al investigar D-025; resuelto el 4.

`api/interest.js` línea 65 decidía el tipo así:

```js
const isRegistration = eventName.startsWith('Registro');
```

y mandaba al webhook `tipo: "registro_empresa"` solo en ese caso. Todo lo demás llegaba como
`tipo: "evento"`. El módulo 2 de `E-1` filtra por `text:equal "registro_empresa"`, así que **una
empresa que se interesa en un evento del catálogo, o que pide un evento en su municipio, entraba al
webhook y se descartaba ahí**, sin abrir expediente en Airtable — con la ejecución marcada como
exitosa. Precisión sobre el aviso: **no era invisible del todo**, porque el correo directo del sitio
(`transporter.sendMail`) siempre lleva `cc: adminEmail` sin pasar por Make — el equipo sí recibía un
correo. Lo que faltaba era la automatización completa: Responsable asignado, recordatorio a 5 días,
inactivación a 20 (`E-3`). Una empresa entrando por ahí quedaba fuera de todo ese ciclo.

**La pregunta pendiente era si esos formularios los usan empresas o también voluntarios
individuales.** Respuesta del 4 de septiembre: **ambos** — el mismo formulario de catálogo y el de
municipio reciben tanto personas físicas como empresas reales. Eso descarta tratar todo `tipo:
"evento"` como empresa (ensuciaría Organizaciones con personas) y descarta ignorarlo (perdería
empresas reales).

**Se investigó primero si el campo `company` ya existente podía servir de señal.** No sirve: está
marcado `required` en los dos formularios con la etiqueta "Empresa / Organización", así que una
persona individual puede — y probablemente va a — escribir su propio nombre, "N/A" o "Particular"
ahí. Es texto libre obligatorio para los dos casos; no hay forma confiable de inferir el tipo a
partir de su contenido.

**Solución implementada:** un selector explícito **"¿Te registras como? \* → Persona individual /
Empresa u Organización"**, agregado como el primer campo (justo después de municipio, o de primero)
en los dos formularios de `EventCatalog.tsx` — `RequestEventModal` (municipio) e `InterestModal`
(catálogo). El campo `company` ahora es **condicional**: solo aparece, y solo es obligatorio, cuando
se elige "Empresa u Organización". Se manda como `registrantType: 'individual' | 'empresa'` en el
payload a `/api/interest`.

`api/interest.js` calcula:

```js
const isCompanySubmission = isRegistration || registrantType === 'empresa';
```

y el webhook usa `tipo: isCompanySubmission ? "registro_empresa" : "evento"`. El formulario de
Registro (`CompanyRegistration.tsx`) no se tocó — sigue siendo siempre empresa por `isRegistration`,
sin necesitar el selector.

**No se tocó nada en Make.** El filtro de `E-1` (`{{1.tipo}} = "registro_empresa"`) ya es genérico;
con el payload corregido, cualquier empresa que entre por catálogo o municipio ahora abre expediente
igual que un registro directo, con el nombre del evento o municipio de interés ya capturado en
`1.evento`. Verificado con `npm run build` — sin errores.

---

### D-027 · Dónde vive el motor de match — no se mueve nada a Supabase

**2 de septiembre de 2026.** Llegó una especificación técnica externa
(*"Motor de Match Asociación ↔ Empresa"*) con un prototipo en HTML autónomo. Se revisó contra lo que
ya existe. Se acepta la lógica completa y **se rechaza la recomendación de infraestructura**.

**Lo que se acepta:** los 7 criterios, las fórmulas de score por criterio, y los pesos por defecto
(causa 25, municipio 20, voluntarios 15, mes 15, actividad 12, presupuesto 8, accesibilidad 5). El
`evalAssoc` del prototipo se porta 1:1, sin tocar la lógica.

**Lo que se rechaza:** *"mover la base de asociaciones de localStorage a Postgres/Supabase"*. Las
asociaciones ya viven en Airtable y ahí corre todo el back office — A-1 a A-6, E-1 a E-4, convenios,
seguimientos. Duplicarlas a Supabase crea **dos fuentes de verdad** que el equipo tendría que
mantener a mano en dos lados. Se desincronizan en semanas. **Airtable se queda como única fuente.**

**Dónde corre el cálculo — dos caminos, misma lógica:**
1. **Script dentro de una automatización de Airtable.** El JS del prototipo se pega casi tal cual.
   No hay endpoint, no hay pieza extra que se caiga. *Intentar este primero.* Verificar en el plan
   Free que la acción de script exista y el tope de corridas mensuales.
2. **`api/match.js` en el Vercel que ya existe**, junto a `api/interest.js`. Make le manda un JSON y
   recibe el ranking. No es una página: nadie la abre en el navegador. Lleva llave compartida en el
   header.

**No se necesita ninguna herramienta nueva.** Airtable + Make + Vercel, las tres ya pagadas.

**No se necesita apartado web.** La pantalla donde se decide es la ficha del evento en Airtable, que
el equipo ya usa. El prototipo junta cálculo y pantalla en un archivo porque así se demuestra
rápido; en producción solo se necesita el cerebro.

**El motor sugiere, no asigna.** El vínculo final lo hace una persona — asignar mal una asociación
cuesta una relación, y el sistema no sabe lo que el equipo sabe.

#### Estado real de los campos (revisado el 2 de septiembre)

De los 7 criterios, **4 ya existen en ambos lados con opciones idénticas**:

| Criterio | Organizaciones | Eventos |
|---|---|---|
| Causa / beneficiarios | `fldnXJWhefLRh1fkp` (9) | `fldyfn8hzBXwu6i7L` (9) |
| Municipio | `fld75px4qXGUE7XcQ` (51) | `fldGAset0my8u0rYp` (51) |
| # voluntarios | `fldIAzag1KNz6Anyl` rangos | `fldIwXgx6WYViJ6nU` rangos |
| Mes | `fldPjZm4HGdS2toNc` (12) | `flda6AkeaCdGIuF60` (12) |

**Faltan 3:** `cuota` y `accesibilidad` no existen de ningún lado; `actividad` existe en
Organizaciones (`fldnFZt142s15YK9P`, 5 opciones) pero **no en Eventos** ni como pregunta en Fillout.

⚠️ **Las dos escalas de voluntarios no coinciden.** Organizaciones usa `1-10 / 11-20 / 21-30 /
31-40 / 41-50 / 50+`; Eventos usa `1-5 / 6-10 / 11-15 / …`. Hay que convertir ambas a número antes
de comparar o el criterio devuelve basura en silencio.

#### El verdadero cuello de botella: la base está vacía

De 37 registros con Tipo = Asociación, ~21 son reales. **Ninguna asociación real tiene los campos
del match capturados** — solo tienen nombre. Los 4 registros con datos completos son de prueba, y
uno de ellos trae *las 9 causas, los 12 meses y las 5 actividades* marcadas, que es relleno, no
información.

**Un motor de match sobre una base vacía devuelve 0% para todas.** El código puede quedar perfecto y
no servir de nada.

**Cómo llenarla sin quemar al equipo:** un formulario de Fillout para que **la asociación capture su
propio perfil**, enviado por correo a las 21. Convierte ~5 h de llamadas en un envío, y es la misma
pieza que se necesita de todos modos para dar de alta asociaciones nuevas.

#### Esfuerzo estimado

| Bloque | Horas |
|---|---|
| Campos nuevos en Airtable + fórmulas de conversión de rangos | 1.5 |
| 3 preguntas nuevas al formulario de captura + que `E-4` las escriba | 1.0 |
| El cálculo (script de Airtable o `api/match.js`) + pesos desde Config | 2.5 |
| `E-6`: leer asociaciones → calcular → escribir top 3 + avisar | 2.5 |
| Campos de salida en Eventos (top 3 y desglose) | 0.5 |
| Pruebas con datos reales | 1.5 |
| Formulario de perfil para asociaciones + envío a las 21 | 2.0 |
| **Total** | **~11.5 h** |

La fecha no la marcan esas horas: la marca **cuánto tardan las asociaciones en responder**.

#### Efecto sobre la delegación a Ana Cristina

La especificación **ya trae los pesos por defecto**, que era la decisión marcada como más crítica del
proyecto y con fecha límite del 4 de octubre. Si Ana Cristina avala esos números, **queda desbloqueada
sin junta**. Lo único que hay que confirmarle es que el orden refleje cómo deciden hoy a mano — sobre
todo que *causa* pese más que *municipio*.

---

### D-028 · Cómo elige el equipo la asociación: correo → confirmación → candado

**2 de septiembre de 2026.** Diseño acordado, pendiente de construir junto con `E-6`.

**El recorrido.** Cuando el evento entra a *04 Conectar asociación*, el match corre solo y escribe el
top 3 en la ficha. Al responsable le llega un correo con **tres botones, uno por asociación
sugerida**, cada uno con su porcentaje. El botón lleva a un **formulario corto de Fillout** ya
precargado que solo dice *"Vas a asignar Cardiochavitos al evento de Cemex. ¿Confirmas?"*. Al
confirmar, un escenario vincula la asociación, avanza la fase y avisa al equipo.

**Por qué Fillout y no una liga directa a Airtable.** El momento en que se elige asociación casi nunca
es frente a la computadora. Un botón en el correo se responde en el momento; *"entra a Airtable"* se
pospone. Además **quien elige no ocupa un lugar de colaborador** — el plan Free trae 5 y entre Mia,
Adri, Ana Cris, Gabi y Ethan ya están los 5. Y queda registro de **quién eligió y cuándo**, que hoy
no se guarda en ningún lado.

**Por qué hay paso de confirmación y no un solo clic.** Los correos se reenvían y algunos filtros de
seguridad abren las ligas solos para revisarlas. Si el botón asignara al abrirse, tarde o temprano se
asigna una asociación que nadie eligió y nadie se entera. **Ninguna acción con consecuencia hacia
afuera puede ejecutarse por abrir un link.**

**Abrir el link no guarda nada.** Se puede abrir diez veces, cerrar y reenviar sin efecto. Lo que hay
que blindar es **enviar**.

#### El candado: gana la primera respuesta, no la última

Sin protección gana la última y nadie se entera. El daño no es el dato: al vincular una asociación
**le sale el convenio a esa asociación**. Si Mia pica Cardiochavitos y Adri pica Manos Unidas diez
minutos después, **dos organizaciones reciben el convenio del mismo evento**. Airtable se queda con
una; afuera quedan dos creyendo que les tocó. Eso no lo arregla un campo — hay que hablarle a una
para decirle que no.

**Campo sello:** `Asociacion elegida en` (fecha y hora, nombre sin acentos por D-017), más quién
eligió. Antes de escribir, el escenario lo lee:

- **Vacío** → vincula, sella fecha y persona, avanza fase, avisa.
- **Con valor** → **no toca nada** y le contesta al que llegó tarde: *"Este evento ya tenía asociación
  asignada: Cardiochavitos, elegida por Mia el 2 de septiembre a las 18:04. No se cambió nada. Si hay
  que cambiarla, háblalo con Mia primero — a Cardiochavitos ya le salió el convenio."*

Es el mismo patrón de `E-4` y `E-5`, pero aquí importa más porque del otro lado hay una asociación
real esperando.

**Envíos simultáneos:** cubierto por el **procesamiento secuencial** que ya traen todos los
escenarios. Make los forma en fila y termina uno antes de empezar el siguiente, así que el segundo no
puede leer el campo antes de que el primero lo selle. No hay ventana de carrera.

**Cambiar a propósito:** el candado no es eterno, **pero tampoco es un botón**. Alguien con acceso a
Airtable borra el sello y el evento vuelve a aceptar elección. El estorbo es intencional: obliga a que
exista la conversación con la primera asociación antes del cambio, que es algo que ninguna
automatización puede hacer.

#### Pantalla de exploración — opcional, solo si la piden

Único caso que justificaría una pantalla web: consultar sin que exista un evento (*"si llega una
empresa de 40 voluntarios en García pidiendo medio ambiente, ¿a quién tenemos?"*). Se resuelve con el
**mismo prototipo HTML** leyendo Airtable en vez de `localStorage` — no hace falta meterlo al portal
ni construir un admin. **Primero el cálculo automático dentro del flujo**, que es lo que quita
trabajo; la pantalla solo si alguien la pide de verdad.

---

### D-029 · `dlq: true` aplicado por API a `E-1`, `E-3` y `E-4`

**4 de septiembre de 2026.** Pendiente de D-025, resuelto sin pasar por la interfaz: ya tenía los
tres blueprints completos de la sesión anterior, así que se reenviaron con `dlq: true` en
`metadata.scenario` y el resto del flujo intacto. Confirmado uno por uno después del envío —
`isinvalid: false` en los tres, sin tocar lógica ni conexiones.

Con esto los cuatro escenarios de Empresas (`E-1` a `E-4`) quedan con la misma protección que ya
tiene `E-2`: un error suelto se reintenta en vez de apagar el escenario completo.

---

### D-030 · Convención de correos internos — tag "Sistema" y lenguaje sin tecnicismos

**12 de septiembre de 2026.** Regla de estilo, aplicable a todo correo interno que mande cualquier
escenario de Make (Empresas y Asociaciones) hacia el equipo (`voluntariadocorporativo@ezer.org.mx`,
`sistemas@encuentromundialdevalores.org`), de aquí en adelante y de forma retroactiva conforme se
vaya tocando cada escenario.

**Quién los lee.** El equipo que opera el panel incluye personas sin trasfondo técnico (señoras de
60 años). Un correo que dice "el módulo Router no encontró bundle" o "filter bloqueado" no sirve.

**Regla 1 — Tag visible de que es automático.** Todo asunto de correo interno lleva el prefijo
`[Sistema]` antes del texto, ej. `[Sistema] Cotización enviada — Evento X`. Así se distingue de un
correo real de una persona sin tener que abrirlo.

**Regla 2 — Si es informativo, va al grano.** Un correo que solo confirma que algo pasó bien (se
generó un documento, se envió una cotización, se recibió un pago) es corto: qué pasó, a quién o qué
evento corresponde, y la liga si aplica. Sin explicar cómo funciona el escenario por dentro.

**Regla 3 — Si es un problema, lleva pasos numerados para arreglarlo.** Un correo que avisa que algo
no se pudo hacer (faltan datos, un candado quedó activo, un documento no se generó) no se queda en
"revisar" — dice explícitamente, en una lista numerada, qué hacer para resolverlo, con nombres de
campos y pantallas tal como los ve el equipo en Airtable (nunca nombres de módulos de Make ni de
campos internos con `fld...`).

**Ejemplo de informativo (Regla 2):**
> Asunto: `[Sistema] Carpeta y documentos listos — Cemex Monterrey`
> Ya se generó la carpeta del evento con la Cotización y el Convenio adentro. Aquí está la liga:
> [liga a la carpeta]

**Ejemplo de problema (Regla 3):**
> Asunto: `[Sistema] Falta un dato para mandar la cotización — Cemex Monterrey`
> No se pudo mandar la cotización de este evento. Para arreglarlo:
> 1. Abre el evento "Cemex Monterrey" en Airtable.
> 2. Revisa que tenga llenado el campo "Correo coordinador".
> 3. Si ya estaba llenado, avísale a sistemas@encuentromundialdevalores.org.

Esta convención aplica a los correos internos nuevos que se construyan de aquí en adelante (ej. el
de confirmación de carpeta/documentos de `E-4`, agregado el mismo día). Los correos internos ya
existentes en escenarios activos (`E-1` a `E-5`, `A-1` a `A-6`) se van actualizando conforme se abra
cada escenario por otra razón, no como barrido dedicado.

#### Actualización 14 de septiembre de 2026 — formato visual y siguientes pasos

Pedido por el usuario al ver el primer aviso real de `E-5`. Se suma a las tres reglas de arriba:

**Regla 4 — Siempre llevan "Siguientes pasos", también los informativos.** Una lista numerada que dice
qué va a pasar después y qué le toca hacer al equipo. Si no les toca nada, se dice explícito
("Por ahora no tienen que hacer nada"). Esto matiza la Regla 2: informativo sigue siendo corto, pero
nunca termina sin decir qué sigue.

**Regla 5 — Estructura fija, en viñetas.** En este orden:
1. Etiqueta visible arriba: `SISTEMA · AVISO AUTOMÁTICO` (píldora azul claro).
2. Título con ícono según el tipo: ✅ salió bien · ℹ️ aviso sin problema · ⚠️ algo no se pudo hacer.
3. Una línea que resume qué pasó.
4. **Detalles** en viñetas (evento, a quién, folio, total, responsable, ligas).
5. **Siguientes pasos** numerados (en los de problema: "Siguientes pasos para arreglarlo").
6. Opcional: una nota final en caja gris (o rosa si es problema).

Cuando el correo avisa de datos faltantes, la lista de detalles muestra **qué tiene y qué le falta**
con ✅ / ❌ por campo, en vez de pedir que revisen todo.

Referencia de cómo se ve: los tres avisos internos de `E-5` (enviada, ya enviada, falta un dato).

**Regla 6 — Etiqueta "Sistema" en Gmail.** Make no puede ponerle etiquetas al buzón de quien recibe.
Se resuelve con un **filtro de Gmail** en cada buzón que recibe avisos
(`voluntariadocorporativo@ezer.org.mx` y `sistemas@encuentromundialdevalores.org`): buscar
`subject:"[Sistema]"` → aplicar la etiqueta **Sistema** → **sin** archivar, para que sigan llegando a
Recibidos. Por eso el prefijo `[Sistema]` del asunto es obligatorio: es de lo que depende el filtro.

---

### D-031 · Editar una plantilla de Docs puede romper los marcadores sin que se note

**12 de septiembre de 2026.** Al quitar la sección de datos fiscales de las plantillas de Cotización
y Convenio, cuatro marcadores quedaron rotos y los documentos salieron con campos vacíos.

**Cómo se rompieron.** Google Docs guarda el texto por párrafos. Al borrar líneas alrededor de un
marcador quedaron saltos de línea **dentro** de él:

- `{{Nombre_Evento` ⏎⏎⏎ `}}` — partido en dos párrafos
- `{{Municipio_Evento` ⏎ `}}` — igual
- `{{Duracion_Evento` ⏎ `}}` — igual
- `{{Coordinador_Nombre}` en el bloque de firmas del Convenio — le faltaba una llave de cierre

Make busca la cadena **completa y continua** `{{Marcador}}`. Partida o incompleta, no la encuentra,
no reemplaza nada, y el documento sale con el hueco. **No genera error**: la ejecución se reporta
exitosa. Por eso se detectó hasta que alguien abrió el PDF.

**Cómo se diagnosticó, y cómo repetirlo.** No hace falta adivinar: un escenario desechable de dos
módulos — `google-docs:exportADocument` en `text/plain` → escribir `{{toString(data)}}` en un campo
de texto largo de Airtable — deja ver el texto crudo de la plantilla con todos sus marcadores. Se
compara contra los `requests` del blueprint y salta de inmediato cuál falta, cuál sobra y cuál está
partido. Tardó menos de cinco minutos y sirve para cualquier plantilla futura.

**Lo que también apareció con ese volcado:** la tabla de INVERSIÓN de la Cotización tenía
`{{Concepto_1}}`, `{{Importe_1}}`, `{{Concepto_2}}`, `{{Importe_2}}` — cuatro marcadores que el
escenario **nunca había mandado**. Nadie lo había notado porque nadie había abierto una cotización
generada hasta ese día.

> **Regla:** cada vez que se edite una plantilla de Docs, correr el volcado y comparar marcadores
> contra el blueprint **antes** de dar por buena la siguiente prueba. Un documento con un hueco no
> falla ruidosamente: falla en silencio, frente al cliente.

---

### D-032 · El curso de sensibilización se cobra aparte — $30,000

**12 de septiembre de 2026.** Hasta ahora el monto de la cotización era uno solo ($20,000 por
defecto) y no estaba claro si el curso iba incluido.

**Queda así:** el curso es una **partida aparte de $30,000**, y la cotización lo desglosa en dos
renglones — la coordinación de la jornada por un lado, el curso por el otro — con el total sumado
abajo.

**Efecto en Airtable:** el campo `Monto` deja de ser el total y pasa a ser el **monto base** del
evento (editable por el equipo). Se agregó el campo calculado `Monto total cotizacion` =
`Monto` + $30,000 si la casilla de curso está marcada. Ese es el que aparece en la Cotización, en
el Convenio y en los avisos internos.

**Por qué un campo calculado y no una suma dentro del escenario:** `E-5` corre horas después de
`E-4`, y otros escenarios más adelante también van a necesitar el total. Tenerlo como columna
visible en Airtable evita que cada escenario lo recalcule por su cuenta — y evita que el equipo vea
un número distinto al del documento que ya mandó.

El precio de $30,000 es provisional, puesto por Dirección el mismo día. Cuando se fije el definitivo
se cambia en dos lugares: la fórmula del campo y el importe del renglón en `E-4`.

---

### D-033 · Una búsqueda sin resultados congela el escenario — y corrige el diagnóstico de D-017

**14 de septiembre de 2026.** `E-5`, `E-6` y `E-7` llevaban dos días **congelados sin avisar a
nadie**: `E-5` no había corrido ni una vez desde el viernes aunque revisa cada hora, y `E-6` se
saltó su corrida del sábado.

**Lo que pasa.** Cuando un `Search Records` de Airtable no encuentra nada, Make **no se detiene**:
entrega un paquete vacío y los módulos siguientes corren con todos sus campos en blanco. Se
comprobó aislado: una búsqueda que no encontraba nada ejecutó igual el paso siguiente, con
`id` vacío.

Con eso, cada escenario fallaba en su primera corrida sin datos:

| Escenario | Qué hizo con el paquete vacío | Error |
|---|---|---|
| `E-6` | Mandó el seguimiento sin destinatario | `Recipient address required` |
| `E-5` | La ruta "faltan datos" lo aceptó e intentó desmarcar la casilla de un registro sin ID | Update sin ID |
| `E-7` | Intentó guardar la constancia en una Organización sin ID | Update sin ID |

El error cae en un `Break` → queda una **ejecución incompleta** → y como todos los escenarios usan
**procesamiento secuencial**, Make no arranca ninguna ejecución nueva hasta que alguien resuelva la
atorada. El escenario sigue marcado como activo. **No hay correo, no hay alerta, no hay nada rojo.**

**Corrección a D-017.** El síntoma de D-017 — "el correo reventó con `Recipient address required`"
— es exactamente este. Se atribuyó a los acentos, pero la fórmula acentuada de `E-5`
(`{Enviar cotización}=TRUE()`) se probó aislada y **funcionó bien**: no marcó error ni devolvió la
tabla entera. El arreglo de D-017 (el campo `Accion E3`) sí funcionó, pero por otra razón: los
filtros exigen un valor concreto (`"recordar"`, `"inactivar"`) que un paquete vacío nunca trae.
Seguir evitando acentos en las expresiones de Make no cuesta nada y se mantiene como precaución,
pero **la regla que importa es la siguiente**.

> **Regla:** en todo escenario que empiece con una búsqueda, **ningún módulo que escriba o mande
> correo puede correr sin un filtro que exija `{{N.id}}` existe** — y si manda correo a una
> dirección que viene de Airtable, también que ese correo exista. Esto aplica a `E-8` en adelante.

**Cómo se arregló.**
- Los tres escenarios se **reconstruyeron** (la ejecución atorada no se puede borrar por API; los
  anteriores solo tenían corridas de prueba). IDs nuevos: `E-5` 6277432, `E-6` 6277419, `E-7` 6277439.
- `E-5`: filtro de `id` en las tres rutas. De paso se corrigió un error de lógica: la búsqueda
  excluía los eventos ya enviados, así que la ruta "ya se había enviado" **nunca podía ocurrir** y una
  casilla vuelta a marcar se quedaba marcada para siempre. Ahora busca solo por la casilla.
- `E-6`: filtro de `id` + correo antes del primer envío. La búsqueda ya no usa el valor acentuado
  de la fase: `LEFT({Fase},2)="05"`.
- `E-7`: los tres efectos (aviso interno, correo a la empresa, guardar constancia) pasaron a rutas
  **independientes** de un router, cada una con su filtro — así que ninguno bloquea a otro. La
  Organización se lee de un campo nuevo de nombre ASCII, `Organizacion ID` (lookup de
  `Record ID org`).

**Cómo detectarlo la próxima vez.** En la lista de escenarios de Make, `iswaiting: true` junto con
`dlqCount` mayor a 0. Vale la pena revisarlo antes de cada prueba y en la revisión semanal.

⚠️ **Observación sin tocar:** `A-2.2` tiene 2 ejecuciones incompletas (sin congelar, porque no usa
procesamiento secuencial). Por la regla de no editar escenarios de Asociaciones, solo se anota.

---

### D-034 · La estructura de un formulario de Fillout se puede leer sin enviar nada

**15 de septiembre de 2026.** Para construir `E-8` y `E-9` hacía falta saber el ID interno de cada
pregunta de los dos formularios nuevos de Fillout. Hasta ahora eso se conseguía de una sola forma:
poner el webhook en modo detección, pedirle al equipo un envío de prueba, y leer lo que llegó. Ese
modo **suprime la ejecución del escenario**, así que el envío de prueba se "gasta" en aprender y hay
que pedir otro para probar de verdad — dos vueltas con una persona en medio, cada una de un día.

**Lo que se encontró.** El módulo `fillout:newSubmission` declara una RPC de interfaz,
`rpc://fillout@1/metadata`. Se puede ejecutar directamente contra un hook ya creado y devuelve el
árbol completo de la respuesta: `answers` con el ID y la etiqueta de cada pregunta, `urlParams` con
los campos ocultos declarados, y los tipos de cada uno. Es lo mismo que Make muestra en el panel de
mapeo, pero sin depender de un envío.

```
rpc_execute(appName: "fillout", appVersion: 1, rpcName: "metadata",
            data: { __IMTCONN__: 10037398, __IMTHOOK__: <hookId>,
                    teamId: 2499424, formId: "<formId>" })
```

> **Regla:** para cualquier formulario de Fillout nuevo, leer la estructura con esta RPC **antes**
> de pedir pruebas. El modo detección queda solo como respaldo para lo que la RPC no describa (por
> ejemplo, qué trae realmente un campo oculto cuando la liga no lo lleva — que fue el problema real
> de `E-7`).

**IDs que quedaron documentados así:**

| Formulario | Pregunta | ID |
|---|---|---|
| Recibo contador (`exABLtJxJCus`) | Folio de la cotización | `53RdPpczRR7HeNoXBRtNEc` |
| | Recibo deducible (PDF) | `fbsM1njfH7VXzzboxtvoC5` |
| | Fecha de timbrado | `uQJnNT64gwGi1Rc9qkxyia` |
| | ¿Ya quedó subido al SAT? | `ueq6zKqhrJw7fP7Qh4g3q5` |
| Comprobante empresa (`kBNZmz28zBus`) | Comprobante de transferencia | `2ixnaNhHneuuutCpEGwDF3` |
| | Fecha de la transferencia | `7tENBQnthrjszyRMW9HJkJ` |
| | Folio de la cotización | `bqGhJwKyHrkmvBzcxJGfmK` |

Los dos formularios declaran un solo parámetro de URL, `hidden_folio`. Por eso ambos escenarios
buscan el evento con `upper(trim(ifempty(1.urlParams.hidden_folio; <la pregunta del folio>)))`:
toman primero el oculto de la liga y, si viene vacío, el que la persona escribió a mano.

---

### D-035 · `E-8` y `E-9` — la etapa de dinero queda cerrada de punta a punta

**15 de septiembre de 2026.** Construidos y activos: `E-8` (6288227, hook 2818277) y `E-9`
(6288236, hook 2818278). Ambos siguen la regla de D-033 — router con `{{2.id}} exist` en cada rama y
una rama de aviso `[Sistema]` con pasos numerados cuando el folio no existe — y el formato de correo
interno de D-030.

**`E-8` — el contador sube el recibo.** Busca el evento por folio, crea el registro en `Recibos`
ligado a ese evento, y en ramas independientes: (a) manda el recibo a la empresa, (b) avisa al
equipo. La rama que le manda el recibo a la empresa exige tres cosas a la vez: evento encontrado,
`Correo coordinador` con valor, y `Recibo enviado a la empresa` **sin marcar**. Ese último es el
candado: si el contador vuelve a subir un recibo corregido, **el archivo nuevo sí se guarda** pero
la empresa no recibe el correo dos veces, y el aviso interno lo dice explícitamente.

**Cómo se adjunta el PDF.** El recibo llega de Fillout como una URL, no como archivo. Se descarga
con `http:ActionGetFile` (versión 3) y se adjunta al correo con `{{6.data}}`. La URL se saca con
`{{join(map(1.answers.<id>; "url"); "")}}` en vez de `[1].url`: el `map`+`join` es el modismo que
Make resuelve de forma confiable cuando el campo tiene un nombre que empieza con dígito y hay que
encerrarlo en acentos graves.

**`E-9` — la empresa sube su comprobante.** Busca el evento por folio, guarda el archivo en
`Comprobante de pago`, la fecha en `Fecha de transferencia`, marca `Comprobante recibido`, le
confirma a la empresa y avisa al equipo con los pasos para validar el depósito con el banco. **No
toca la Fase**: confirmar el pago es una decisión humana y es tarea del Sprint 7.

**Nota sobre casillas vacías.** Los filtros usan `notexist` para preguntar si una casilla está
apagada. Funciona porque la API de Airtable **omite** las casillas sin marcar en su respuesta, así
que en Make no llegan como `false` sino como nada. Es el mismo comportamiento del que dependía
`Fecha de cotizacion enviada` en `E-5`.

**De paso, en `E-7`:** el aviso interno de datos fiscales ahora lleva un botón para el contador con
su liga y el folio ya precargado. Antes solo le decía que ya podía hacer el recibo, sin decirle
dónde subirlo.

**Probados el mismo día, 15-sep, con el folio `COT-20260915-PTVS`.** `E-8` corrió en 7 operaciones:
creó `Recibo COT-20260915-PTVS` ligado al evento, con el PDF, la fecha de timbrado y la casilla del
SAT bien puestas, mandó el recibo a la empresa y encendió el candado. `E-9` corrió en 5: guardó el
comprobante, la fecha de transferencia y marcó `Comprobante recibido`. Ninguno de los dos necesitó
corrección — es el primer par de escenarios del proyecto que sale bien a la primera, y la diferencia
fue leer los identificadores reales antes de construir en vez de adivinarlos (D-034).

---

### D-036 · Volver a llenar el formulario de captura regresaba el evento de etapa

**15 de septiembre de 2026.** Al probar el reenvío del formulario interno sobre un evento que ya
estaba en **"05 Cotización enviada"**, el evento quedó otra vez en **"03 Captura de datos"**.

**Por qué.** `E-4` escribía `Fase = "03 Captura de datos"` como valor fijo en cada envío. Tiene
sentido la primera vez —capturar los datos de la reunión *es* la etapa 03—, pero el formulario
también se usa para **corregir un dato** de un evento que ya avanzó, y ahí el valor fijo lo
empujaba hacia atrás.

**Por qué importaba más de lo que parece.** Nadie lo habría notado: el correo llega igual, los
documentos no se tocan, y el candado de idempotencia funcionó bien. Pero `E-6` busca los eventos con
`LEFT({Fase},2)="05"`, así que un evento devuelto a la 03 **deja de ser candidato al seguimiento de
los 7 días para siempre**. Una corrección de un teléfono mal escrito habría cancelado el
seguimiento sin que nadie se enterara.

**Cómo se arregló.** La fase dejó de ser un valor fijo:

```
{{if(2.`Cotizacion Doc ID` = emptystring; "03 Captura de datos"; ifempty(2.Fase; "03 Captura de datos"))}}
```

Se reusa el candado que ya existía: si el evento todavía no tiene cotización generada, es una
captura nueva y va a la 03; si ya la tiene, **se respeta la etapa que lleve**. El correo de
"Formulario reenviado" ahora también dice en qué etapa se quedó el evento, para que el equipo lo vea
sin entrar a Airtable.

> **Regla:** ningún escenario escribe una etapa como valor fijo si su disparador puede ocurrir más
> de una vez sobre el mismo registro. La etapa solo avanza; si el escenario puede repetirse, hay que
> preguntar primero en qué etapa va.

**Lo que también quedó probado de paso:** con un `record_id` que no existe, `E-4` avisa con pasos
numerados y **no crea ni modifica nada**; el reenvío actualiza los datos del evento pero no regenera
la carpeta, la cotización ni el convenio.

---

### D-037 · Junta con Ana Cristina — siete cambios al alcance

**18 de septiembre de 2026.** De la reunión con Ana Cristina salieron siete ajustes. Ninguno se
puede construir todavía: cinco esperan un archivo o una definición de ella, uno espera al abogado, y
uno es alcance nuevo que hay que meter al plan. Se anotan aquí para que no se pierdan.

| # | Cambio | Dónde pega | Estado |
|---|---|---|---|
| 1 | Adjuntar una presentación al correo interno de la primera reunión, lado **Empresas** | `E-2` | Espera el archivo de Ana Cristina |
| 2 | Lo mismo, lado **Asociaciones** | `A-3` | Espera el archivo **y levantar la regla de no tocar Asociaciones** |
| 3 | Actualizar la plantilla de **cotización** | Plantilla de Docs + marcadores de `E-4` | El usuario ya la tiene, la pasa enseguida |
| 4 | Actualizar la plantilla de **convenio** | Plantilla de Docs + marcadores de `E-4` | **Bloqueado**: la revisa un abogado de Ana Cristina |
| 5 | Cambios al **formulario del recibo del contador** | Formulario `exABLtJxJCus` + `E-8` | Faltan los cambios concretos |
| 6 | Formulario de **comprobante de la empresa** | — | **Sin cambios**, quedó aprobado |
| 7 | **Registro de voluntarios con firma** del aviso de privacidad y la carta de deslinde | Alcance nuevo | Ver abajo |

**Sobre el punto 2 — choca con una regla vigente.** La regla dura del proyecto es que los
escenarios `A-1` a `A-6` **no se editan en Make**, aunque tengan errores. Adjuntar la presentación
al correo interno de la primera reunión de Asociaciones significa editar `A-3`. Ya existe un
precedente: en D-019 se autorizó una excepción puntual sobre ese mismo escenario. **Hace falta que
el usuario autorice la segunda excepción** antes de tocarlo; mientras tanto queda anotado, no hecho.

**Sobre el punto 7 — es alcance nuevo, no un ajuste.** El plan ya tenía una tarea llamada "integrar
la firma de la carta de deslinde" en el Sprint 11, pero era una tarea de **diseño** de 2.5 h: decidir
*cómo* se firmaría. Lo que se acordó en la junta es otra cosa: **un apartado donde el voluntario se
registra y en el mismo acto acepta el aviso de privacidad y firma la carta de deslinde.** Eso es una
etapa nueva del sistema —la de Voluntario, que nunca se ha construido— con su propia tabla, su
formulario y su escenario. Se estima en 11.0 h plan / 6.68 h reales, de las cuales 2.5 ya estaban
contempladas: **el neto es +4.18 h reales.**

> **Consecuencia legal que conviene atender ya.** Firmar el deslinde **en pantalla** en vez de en
> papel el día del evento no es el mismo acto jurídico, y el aviso de privacidad pasa a ser algo que
> el voluntario acepta en línea. Como ya hay un abogado revisando el convenio, lo barato es meterle
> los otros dos documentos **a la misma revisión**, y preguntarle expresamente si la aceptación
> electrónica le sirve a EZER o si de todos modos hace falta firma en papel. Si la respuesta llega
> tarde, bloquea dos cosas en vez de una: la revisión legal ya era el mayor riesgo de fecha del
> plan, y este cambio le sube el peso.

**Dónde se colocó el punto 7.** No en el bloque E2 (23–29 sep), que ya iba a 18.5 h y no aguanta
más. Se metió en el bloque de pruebas (7–20 oct), que es el que tiene holgura, y además es donde
razonablemente habrá llegado la respuesta del abogado. Si llega antes, se adelanta.

---

### D-038 · El curso de sensibilización sube a $55,000 — aplicado el mismo día

**18 de septiembre de 2026.** Nuevo precio acordado con Ana Cristina: **curso de sensibilización
$55,000**, evento **$20,000**. Corrige el precio provisional de $30,000 que D-032 había puesto
"de mientras". Total de un evento con curso: **$75,000**.

Se aplicó en los tres lugares donde vivía el número, que es justo lo que D-032 había advertido que
habría que tocar:

1. Fórmula del campo `Monto total cotizacion` (`fldLDRqWWeIEeAlwP`) en Eventos.
2. `E-4`, módulo 7 (cotización): el renglón `Importe_2` y el `Monto_Total`.
3. `E-4`, módulo 8 (convenio): el `Monto_Total`.

**Verificado:** el evento de prueba `Prueba Cierre Sprint 4`, con monto base de $20,000 y curso
marcado, pasó de $50,000 a **$75,000** en cuanto se guardó la fórmula.

> **Nota para la próxima vez que cambie un precio:** el número sigue viviendo en tres lugares y no
> en uno. La razón es que `E-4` calcula el total con las respuestas del formulario, no con el campo
> de Airtable — y no puede usar el campo, porque cuando `E-4` lee el Evento todavía no ha escrito en
> él las respuestas de ese envío. Mientras el orden de los módulos sea ése, los tres lugares se
> tocan juntos.

---

### D-039 · El coordinador de EZER se elige de una lista, no se escribe

**18 de septiembre de 2026.** En el formulario interno, la pregunta *"¿Quién de EZER estará a cargo
de este evento?"* pasa de texto libre a **lista desplegable**. Los nombres ya están registrados en
Airtable: el campo `Responsable` (`fld7ZhFTOS4VuMU6C`) es un selector con **Mia, Adri, Ana Cris y
Gabi**.

**De los tres lados, dos ya estaban listos:** Airtable ya tiene las cuatro opciones, y `E-4` ya mapea
la respuesta a ese campo con `typecast` encendido. **Falta solo el cambio en Fillout**, que solo lo
puede hacer el equipo.

> ⚠️ **Los cuatro nombres tienen que escribirse idénticos a los de Airtable.** Con `typecast`
> encendido, un nombre que no coincida —"Ana Cristina" en vez de "Ana Cris", o un espacio de más—
> **no da error: Airtable crea una opción nueva en silencio** y el selector termina con ocho nombres
> en vez de cuatro. Es el mismo modo de falla que D-026 en el catálogo y el municipio.

---

### D-040 · Cotización v2 — el diseño nuevo pide cinco datos que no existían

**18 de septiembre de 2026.** Llegó el diseño nuevo de la cotización (tres tableros: dos páginas del
documento y el correo que la acompaña). Se comparó marcador por marcador contra lo que `E-4` manda
hoy: **23 marcadores en el diseño, 18 que ya se mandaban, 0 que sobren.** Los cinco que faltaban se
agregaron el mismo día.

| Marcador nuevo | Qué se le puso | Confianza |
|---|---|---|
| `{{Vigencia_Cotizacion}}` | Fecha de emisión + **15 días** | Supuesto, falta confirmar |
| `{{Dias_Pago}}` | **5** días naturales antes del evento | Supuesto, falta confirmar |
| `{{CAUSA}}` | El primero de los beneficiarios elegidos | Supuesto, falta confirmar |
| `{{Empresa_Razon_Social}}` | Línea en blanco | Ver el conflicto de abajo |
| `{{Empresa_RFC}}` | Línea en blanco | Ver el conflicto de abajo |

**El conflicto de secuencia.** La página 1 del diseño pide razón social y RFC de la empresa, pero
**esos datos llegan después**: los entrega la empresa en el formulario fiscal, al que lleva el botón
*Confirmar nuestro evento* de la página 2 de esa misma cotización. Cuando `E-4` genera el documento,
todavía no existen.

> La recomendación es **quitarlos de la cotización**: es una propuesta comercial, y los datos
> fiscales pertenecen al recibo. Mientras Ana Cristina decide, quedan como línea en blanco
> (`__________________`), igual que el RFC del convenio — no rompe nada y se cambia en un minuto.

**Observación sobre un número del documento.** La página 1 le dice a la empresa que la asociación se
elige *"entre nuestras 155 organizaciones aliadas"*. En Airtable hay **37 registros, ~21
asociaciones reales**. No es un error del sistema y puede que el 155 venga de un conteo más amplio
de Dirección, pero conviene tenerlo presente: **el motor de match del bloque E1 va a escoger entre
~21**, y 155 es el número que la empresa lee en su cotización.

**El correo también cambió y ya quedó aplicado en `E-5`.** Saludo informal, caja *EN RESUMEN*,
botón *Confirmar nuestro evento*, nota de vigencia. De paso, el asunto pasó a
`Su jornada de voluntariado — cotización COT-…` y los adjuntos ahora se llaman
`Cotizacion_COT-….pdf` y `Convenio_COT-….pdf` en vez del nombre del Doc exportado.

**Lo que falta y solo lo puede hacer una persona:** rehacer el Google Doc
`1TNIdjuNAyvROXV2TXrRtlnOzVo53L9hM1SUFYvVN-k4` con el diseño y los 23 marcadores. La lista completa,
con lo que recibe cada uno y la regla de D-031 para no partirlos, quedó en
`Documentos/spec-plantilla-cotizacion-v2.md`.

**Corrección el mismo día.** El marcador de la causa es `{{Causa}}`, no `{{CAUSA}}` — se leyó mal de
la captura y se corrigió en `E-4` al desempacar el archivo del diseño y ver el texto literal. Google
Docs reemplaza respetando mayúsculas, así que con el nombre mal escrito el marcador habría salido
crudo en la cotización sin dar ningún error.

**El documento ya está armado:** `Documentos/Cotizacion-EZER-plantilla.docx`, dos páginas, con el
logo extraído del propio archivo del diseño, la paleta real (navy `#144072`, rojo `#ED1C24`, lima
`#C8D400`) y los 23 marcadores **verificados uno por uno dentro de un solo run de XML** — que es la
condición que D-031 exige para que Make los encuentre. Falta subirlo a Drive como Google Doc.

⚠️ **Lo que un PDF no puede hacer.** El diseño pone un botón *Confirmar nuestro evento* en la página
2. En el correo ese botón sí lleva la liga personalizada con el `record_id` del evento; **en el PDF
no puede**, porque Make reemplaza texto visible, no destinos de hipervínculo. En el documento quedó
como bloque rojo sin liga: decorativo, y el botón que de verdad funciona es el del correo.

---

### D-041 · ⚠️ La CLABE que el sistema le da a las empresas no coincide con la del estado de cuenta

**18 de septiembre de 2026.** Al revisar el encabezado del estado de cuenta de Banorte aparecieron
**dos diferencias con lo que el sistema le está diciendo hoy a las empresas**. Como se trata de a
dónde transfiere el dinero un tercero, **no se cambió nada por cuenta propia**: queda pendiente de
que el usuario confirme cuál es la buena.

| | Lo que dice el sistema hoy | Lo que dice el estado de cuenta |
|---|---|---|
| CLABE | `072580001989740666` | `072580006864552592` |
| Cuenta | — | `0686455259` |
| Titular | EZER A.B.P. | ENCUENTRO MUNDIAL DE VALORES A.B.P. |
| RFC | — | EMV110525FH8 |
| Producto | — | Enlace Negocios Básica |

**Las dos CLABE son válidas en forma** (18 dígitos, banco 072 Banorte, plaza 580), así que no es un
error de captura evidente: parecen **dos cuentas distintas** de la misma institución. Una de las dos
está mal en el lugar donde más caro sale equivocarse.

**Sobre el nombre.** No es contradicción: **EZER — La Casa del Voluntario es el programa, y
Encuentro Mundial de Valores A.B.P. es la persona moral** — lo confirma el propio dominio de correo
del equipo, `@encuentromundialdevalores.org`. Pero entonces **el titular de la cuenta y el emisor del
comprobante fiscal es Encuentro Mundial de Valores A.B.P.**, y hoy tanto la cotización como el correo
del recibo dicen que quien emite es "EZER A.B.P.". Conviene alinear el texto legal con la razón
social real antes de que salga a una empresa.

**Dónde vive el dato hoy, para cambiarlo en un solo barrido cuando se confirme:**
- `E-8`, módulo 7 — el correo que le manda el recibo a la empresa, con banco, CLABE, titular y referencia.
- El formulario fiscal de Fillout (`u9LzXxXhVous`) — el párrafo de datos bancarios que ve la empresa.
- `Documentos/spec-formulario-fiscal-empresas.md`.
- La plantilla de la cotización, en la línea de "EZER A.B.P. es una Asociación de Beneficencia Privada
  y emitirá el comprobante fiscal que corresponda conforme a su régimen".

---

### D-042 · El formulario de solicitud de recibo pide siete datos que el sistema ya tiene

**18 de septiembre de 2026.** Llegó el formulario de Google con el que hoy se le solicita a
contabilidad que emita un recibo o una factura. Son 15 preguntas. **Siete se pueden resolver solas en
cuanto se conoce el folio**: empresa, RFC, constancia de situación fiscal, uso de CFDI, monto, correo
de destino y forma de pago.

> **Regla:** antes de copiar un formulario manual al sistema, revisar pregunta por pregunta cuáles ya
> las contesta el expediente. Copiarlo tal cual convierte una automatización en un formulario largo,
> que es el problema que se venía a resolver.

**Lo que sí hay que preguntar, porque no existe en ningún lado:** si es recibo o factura, PUE o PPD,
el concepto tal cual, la dirección fiscal, quién lo solicita (nombre, correo, teléfono) y
observaciones. Más el monto **sin IVA**, pero solo cuando es factura — el total cotizado no sirve ahí.

**Dónde quedó cada cosa.** El prompt para reconstruir el formulario de Fillout, con la advertencia de
no recrear las preguntas existentes para no perder sus identificadores, está en
`Documentos/prompt-fillout-recibo-v2.md`. El formulario pasa a tener dos páginas: la solicitud y, en
una segunda página opcional, la entrega del documento ya emitido — así el mismo folio sirve para
pedirlo y para subirlo, sin dos formularios distintos.

**Observación de proceso que queda anotada:** la dirección fiscal, el "recibo o factura" y el
"PUE/PPD" son datos **de la empresa**, no del equipo de EZER. Preguntárselos a quien solicita
internamente obliga a ir a buscarlos con la empresa por fuera del sistema. Lo natural es moverlos al
formulario fiscal que la empresa ya llena en `E-7`. No se hizo porque cambia un escenario en
producción y es decisión de proceso.

---

### D-043 · Un .docx subido a Drive no es un Google Doc, y Make no lo puede usar

**19 de septiembre de 2026.** La plantilla nueva de cotización se subió a Drive y se pasó el ID
`1v0p5ugZnEJEVHzQjzeIxLZG5J_b767Jq`. Antes de probar se verificó con la RPC `listKeys` de
`google-docs`, que lee los marcadores de un documento. Respondió:

```
[403] Export only supports Docs Editors files.
```

**El archivo sigue siendo un `.docx` guardado en Drive, no un Documento de Google.** Se ve en la
propia liga: `...&rtpof=true&sd=true` — `rtpof` es *retain original format*, la marca de que Drive lo
está mostrando sin convertirlo. El ID también lo delata: los de Google Docs son de 44 caracteres y
éste tiene 33.

`createADocumentFromTemplate` necesita un Documento de Google de verdad, porque trabaja exportando y
reemplazando texto. Con un `.docx` **la prueba habría fallado en el módulo 7 de `E-4`**.

**Cómo se convierte:** abrir el archivo en Drive y usar *Archivo → Guardar como Documentos de
Google*. Eso crea un **archivo nuevo con un ID nuevo**, que es el que hay que poner en `E-4`. La otra
vía es activar en Drive *Configuración → Convertir los archivos subidos al formato de Google Docs*
antes de subirlo.

> **Regla:** antes de probar un cambio de plantilla, correr `listKeys` sobre el ID. Si devuelve la
> lista de marcadores, el documento sirve y además queda confirmado que los marcadores no quedaron
> partidos (D-031). Si devuelve 403, ni vale la pena probar. Son dos segundos y ahorra una vuelta
> completa de prueba.

---

### D-044 · El pago pasa a ser requisito para agendar, y `{{Dias_Pago}}` deja de tener sentido

**19 de septiembre de 2026.** Decisión de Ana Cristina: **no hay un plazo de N días antes del
evento — el pago es lo que destraba la definición de la fecha.** No se agenda hasta que entra.

Eso deja sin uso el marcador `{{Dias_Pago}}`, que existía solo para la frase *"a más tardar N días
naturales antes del evento"*. Se **quitó de `E-4`** y el renglón de la plantilla tiene que cambiar a
una frase sin plazo. Quedó anotado en `Documentos/spec-plantilla-cotizacion-v2.md`.

El cambio también se reflejó en los correos: tanto el de la cotización como el del recibo ahora
dicen que **el pago es el paso que destraba la fecha**, en vez de dar un plazo.

**Lo demás que se confirmó el mismo día:** vigencia de la cotización **15 días** (ya estaba así),
`{{Causa}}` se queda como el primer beneficiario elegido, y la **CLABE correcta es
`072580001989740666`** — la que el sistema ya tenía. La cuenta del encabezado del estado de cuenta
(`072580006864552592`) es otra, y no se usa aquí. Con eso se cierra D-041 en su parte de CLABE;
**queda abierta la parte del nombre**: los documentos dicen que quien emite es "EZER A.B.P." y la
persona moral es Encuentro Mundial de Valores A.B.P.

---

### D-045 · Google convirtió `{{Causa}}` en `{{CAUSA}}` al importar el .docx

**19 de septiembre de 2026.** Con el Doc ya convertido, la RPC `listKeys` devolvió los 23
marcadores — y uno no coincidía con lo que `E-4` estaba mandando: el documento contiene
**`{{CAUSA}}` en mayúsculas**, no `{{Causa}}`.

**Por qué pasó.** En el `.docx` ese marcador se escribió como `{{Causa}}` pero con el formato
*versalitas* (`w:caps` en Word), que muestra el texto en mayúsculas sin cambiar los caracteres
guardados. **Al convertir a Documento de Google, la conversión “aplanó” el formato y escribió las
mayúsculas de verdad en el texto.** Ningún otro marcador se vio afectado porque ninguno llevaba ese
formato.

Como Google Docs reemplaza respetando mayúsculas, el marcador habría salido crudo en la cotización
**sin dar error**. Se corrigió mandando **los dos nombres** desde `E-4` (`CAUSA` y `Causa`): el que
no exista en el documento simplemente no hace nada, así que la plantilla funciona con cualquiera de
las dos versiones.

> **Regla:** al generar plantillas por programa, **no usar versalitas ni mayúsculas automáticas en
> un renglón que contenga un marcador** — el texto que se guarda y el que se ve dejan de coincidir, y
> la conversión a Google Docs se queda con lo que se ve. Y siempre correr `listKeys` después de
> convertir: es la única forma de ver los marcadores **como quedaron**, no como se escribieron.

**Pendiente en el documento:** sigue teniendo `{{Dias_Pago}}` en la frase del plazo de pago, que ya
no aplica (D-044). Ese marcador se quitó de `E-4`, así que **saldrá crudo hasta que se reemplace la
frase**. Se dejó así a propósito: es preferible un marcador visible a imprimir un plazo de pago que
Dirección ya cambió.

---

### D-046 · La prueba pasó, y de paso destapó que `= emptystring` no detecta un campo vacío

**19 de septiembre de 2026.** Recorrido completo probado con el Doc nuevo y el formulario nuevo. Los
tres escenarios corrieron sin errores y el número de operaciones cuadró con las rutas esperadas:

| Escenario | Operaciones | Qué hizo |
|---|---|---|
| `E-4` | 9 | Carpeta + cotización + convenio con la plantilla nueva |
| `E-8` (1.ª vez, solo página 1) | 5 | Creó la solicitud, avisó al equipo, **no mandó nada a la empresa** |
| `E-8` (2.ª vez, con archivo) | 9 | **Actualizó el mismo registro**, mandó el documento y encendió el candado |

**La verificación que más sirvió:** correr `listKeys` sobre la cotización **generada**. Devolvió
*"Selected document does not have any tag"* — o sea, **ningún marcador quedó sin resolver**. Es la
forma más rápida y confiable de comprobar una plantilla: si el documento generado no tiene tags,
todos los marcadores encontraron su valor.

> **Regla:** después de generar un documento de prueba, correr `listKeys` sobre **el generado**, no
> solo sobre la plantilla. Cero tags = todo resuelto. Cualquier tag que aparezca es exactamente el
> que falta mandar desde Make.

**El error que destapó.** El evento de prueba se dejó con `Cotizacion Doc ID` vacío y `Fase` en
*"05 Cotización enviada"*. Después de `E-4` la fase **siguió en 05**, cuando debía haber pasado a
*"03 Captura de datos"*. La expresión del arreglo de D-036 era:

```
if( 2.`Cotizacion Doc ID` = emptystring ; "03 Captura de datos" ; <conservar Fase> )
```

**Airtable omite los campos vacíos en su respuesta**, así que en Make el campo no llega como cadena
vacía sino como *inexistente* — y `inexistente = emptystring` da **falso**. Es el mismo mecanismo de
D-033, ahora mordiendo en una comparación en vez de en un paquete vacío.

**Consecuencia real:** un evento recién creado por `E-1` no tiene `Cotizacion Doc ID`, así que en su
primera captura **la fase se habría quedado en 01 en lugar de avanzar a 03**.

**Arreglo:** comparar la longitud después de normalizar, que sí trata igual el vacío y el inexistente:

```
if( length(ifempty(2.`Cotizacion Doc ID`; "")) = 0 ; "03 Captura de datos" ; ifempty(2.Fase; "03 Captura de datos") )
```

> **Regla:** en Make, **nunca comparar un campo de Airtable contra `emptystring` directamente**. Usar
> `length(ifempty(campo; "")) = 0`, o el operador `exist` / `notexist` en un filtro, que sí distinguen
> bien. Queda pendiente revisar con este criterio los renglones "❌ Falta / ✅ Lista" del correo de
> *"No se pudo mandar la cotización"* de `E-5`, que usan el mismo patrón y por eso pueden marcar como
> lista una pieza que en realidad falta.

---

### D-047 · El botón sale del PDF, y la casilla de "Enviar cotización" tarda hasta una hora

**19 de septiembre de 2026.** Dos cosas salieron de probar el envío de la cotización.

**1. El botón del PDF se quita.** Observación del usuario, y es correcta: la liga del botón
*Confirmar nuestro evento* en la página 2 **no puede llevar el folio**, porque Make reemplaza texto
visible y no destinos de hipervínculo. Y como el formulario fiscal **no tiene una pregunta visible de
folio**, la empresa tampoco podría corregirlo a mano — el envío se perdería y llegaría el aviso de
"no sabemos de qué evento". El botón que funciona es el del correo, que sí lleva `hidden_record_id`
y `hidden_folio`. En el documento se reemplaza por texto que remite al correo.

> **Regla:** un documento generado por plantilla **no puede llevar ligas personalizadas**. Todo lo
> que dependa de identificar al destinatario va en el correo, nunca en el PDF adjunto.

**2. "No pasó nada" al marcar la casilla — y no era un error.** Las tres corridas de `E-5` (dos
manuales y una automática) terminaron en **1 operación**: la búsqueda no encontró ningún evento con
la casilla marcada. La casilla se marcó **después** de esas tres corridas, y la siguiente automática
habría sido una hora más tarde. Disparado a mano después, `E-5` funcionó perfecto: fase 05, fecha de
envío, los dos PDF en Drive y la casilla apagada sola.

> **Lo que sí es un problema, aunque no sea un error:** una casilla que no hace nada visible durante
> hasta una hora **se siente descompuesta**. Quien la marca no tiene forma de saber si quedó
> registrada. Con el equipo que va a operar esto, la reacción natural va a ser marcarla otra vez, o
> dar por hecho que no sirve.

**Por qué es una encuesta cada hora y no un disparo instantáneo:** Airtable Free no tiene acción de
webhook ni scripting, así que no hay forma de que Airtable le avise a Make en el momento. La única
palanca es el intervalo, y cada corrida gasta una operación aunque no encuentre nada: **60 min = 24
ops/día, 15 min = 96, 5 min = 288.** Queda pendiente que el usuario decida el intervalo contra su
presupuesto de operaciones de Make.

---

### D-048 · Barrido de `= emptystring` en `E-5` y `E-8`

**19 de septiembre de 2026.** Aplicada la regla de D-046 a los dos lugares donde la comparación
contra `emptystring` daba un resultado engañoso:

- **`E-5`, correo "No se pudo mandar la cotización":** los cuatro renglones *"❌ Falta / ✅ Lista"*
  marcaban como **lista** la pieza que en realidad faltaba, porque Airtable omite los campos vacíos.
  El correo cuyo único trabajo es decir qué falta decía justo lo contrario.
- **`E-8`, aviso interno:** si el evento no tiene correo del coordinador, el aviso decía *"La empresa
  ya tiene su documento"* en vez de avisar que no se le pudo mandar.

Los dos ahora usan `length(ifempty(campo; "")) = 0`. Ninguno era un error de datos —el envío real
siempre estuvo bien protegido por los filtros, que sí usan `exist`— pero ambos **le daban al equipo
una instrucción falsa**, que en un sistema que operan personas no técnicas vale lo mismo que un error.

---

### D-049 · Se levanta la regla y se reconstruye el flujo de Asociaciones completo

**19 de septiembre de 2026.** Ethan levantó la regla que tenía a `A-1`…`A-6` como solo lectura desde
el 28 de agosto: *"haz todo lo necesario, te doy luz verde para modificar los escenarios y además
quiero que los mejores"*. Se reconstruyeron **los siete escenarios** (A-1, A-2.1, A-2.2, A-3, A-4,
A-5, A-6), conservando disparadores, horarios y el contenido de los correos a las asociaciones.

**El error sistémico: ninguno tenía guarda de búsqueda vacía.** Los cinco escenarios semanales
(`A-1`, `A-2.1`, `A-2.2`, `A-5`, `A-6`) arrancan con un `Search Records`. Cuando no encuentra nada
—el caso normal en cuanto se procesan todas las asociaciones— Make entrega un paquete vacío y los
módulos siguientes corren con los campos en blanco. Como sus rutas de alerta filtran por
*"no existe correo"*, **un paquete vacío las activa siempre**: cada lunes salía una alerta con el
nombre de la asociación en blanco, y detrás reventaba el update con `id` vacío. Es exactamente
D-033, que se había corregido en Empresas pero nunca en Asociaciones. Ahora los siete llevan
`{{N.id}} exist` en cada rama.

**Errores propios de cada uno:**

| Escenario | Lo que estaba mal |
|---|---|
| `A-1` | Un `split()` **sin separador** partiendo el rollup de correos; la arquitectura que el reporte de pruebas daba por buena (buscar en la tabla Contactos) nunca se aplicó. Además, si todos los contactos tenían el correo mal escrito, el candado *Promoción en proceso* se quedaba encendido y **la asociación desaparecía de las búsquedas para siempre**. |
| `A-2.1` | Lo mismo del `split()`, y **no tenía ruta para correos con formato inválido**: se descartaban en silencio, sin avisar y dejando el candado encendido. |
| `A-2.2` | Sin guarda: de ahí salieron las **2 ejecuciones incompletas** que arrastraba desde julio. Además el correo le decía al equipo que cambiara el estatus a *"Nuevo"*, **un valor que no existe** en el selector. |
| `A-3` | Campos escritos por ID pero con `useColumnId: false`, que los manda como si fueran nombres; y el vínculo a la organización se enviaba como texto en vez de arreglo. |
| `A-4` | Lo mismo de `useColumnId`; escribía con `urlParams.record_id` en vez del registro que la búsqueda ya había validado; **sin candado de idempotencia** (un reenvío creaba otra carpeta y otro convenio); y ponía la fase en *"Disponible"*, **que no existe**. |
| `A-5` | La ruta de "faltan datos" solo revisaba la carpeta de Drive: si faltaba el documento o el correo, **no corría ninguna ruta y la asociación se saltaba en silencio**. |
| `A-6` | Ponía la fase en *"Activa"*, **que no existe**, y como la búsqueda excluye otra fase distinta, el registro **volvía a calificar cada lunes**: habría reenviado la felicitación en bucle para siempre. |

> **Regla nueva:** cuando un escenario escribe un valor fijo en un selector de Airtable, ese valor
> tiene que existir. Tres de los siete escribían opciones inventadas (*Activa*, *Disponible*,
> *Nuevo*). Con `typecast: false` eso revienta; con `typecast: true` crea una opción nueva en
> silencio (D-039). Antes de escribir una fase, verificarla contra el esquema.

**Mejoras que pidió y quedaron aplicadas:** todos los correos internos llevan ahora la etiqueta
`[Sistema]` en el asunto, la estructura visual de D-030 (banda de aviso, qué pasó, detalles, y
*Siguientes pasos* numerados), van a `voluntariadocorporativo@` **y** a `sistemas@`, y explican
siempre si algo quedó guardado o no. De paso se corrigió el correo `voluntariocorporativo@` —sin
"ad"— que aparecía en el pie de tres correos que van a asociaciones reales.

**Campo nuevo:** `Org Record ID` en Contactos (`fldMjxtKW1pC6f1vG`), un lookup del `Record ID org` de
la Organización. Permite buscar los contactos de una asociación de forma exacta, sin pasar por el
rollup de correos unidos por coma.

**Estado al cerrar:** los 16 escenarios del equipo quedaron `isinvalid: false`, activos y sin
ejecuciones en espera. `A-2.2` conserva sus 2 ejecuciones incompletas históricas: **no se pueden
borrar por API**, hay que descartarlas a mano desde el panel de Make.

**Sin probar todavía:** los siete se reconstruyeron pero no se han ejecutado. Los cinco semanales
corren solos el **lunes 21 a las 10 y 11 de la mañana** — conviene revisar los correos ese día.
`A-4` sigue sin ejecutarse nunca desde que existe (julio), así que su primera corrida real será
también su primera prueba.

---

## D-050 · El agregador vacío marcaba como enviado un correo que nunca salió

**19 de septiembre de 2026.** Al probar `A-1` con una asociación cuyo **único** contacto tenía el
correo mal escrito, el escenario la dejó marcada como `Promoción inicial enviada = true`, con la
fecha de hoy — **y no mandó nada**.

La causa es una conducta de Make que no estaba documentada aquí: un `BasicAggregator` cuyo feeder
**sí produjo bundles, pero todos quedaron filtrados antes de llegar**, emite de todos modos **un
bundle vacío**. Ese bundle dispara los módulos que van después. En `A-1` y en `A-2.1` el módulo que
iba después era justamente el que marca la bandera de "ya se envió".

**Por qué importa más de lo que parece:** la asociación queda marcada como contactada sin haberlo
sido. En `A-1` eso la saca para siempre de la búsqueda (que exige `Promoción inicial enviada =
FALSE()`) y la mete a la de `A-2.1`. En `A-2.1` la marca como "seguimiento enviado", lo que la
empuja a `A-2.2`, que a los 20 días **la da por "Sin respuesta"** — una asociación descartada por no
contestar un correo que nunca recibió. Se pierde en silencio, sin error y sin aviso.

**El arreglo:** se quitó el agregador de los dos escenarios y el módulo que marca la bandera se pegó
directo a la salida del módulo de Gmail. Así el update **solo existe si hubo envío**. El costo es que
con varios contactos válidos el update corre una vez por contacto, escribiendo el mismo valor: dos o
tres operaciones extra a la semana, irrelevante.

> **Regla:** un agregador **no** es una garantía de que algo pasó río arriba. Si un módulo solo debe
> correr cuando una acción tuvo éxito, va **colgado de esa acción**, no después de un agregador.

Se descartó la alternativa de filtrar por `length(11.array) > 0` porque depende de cómo nombre Make
la salida del agregador, y si esa suposición falla **el camino feliz también se rompe** — el modo de
error opuesto y peor.

---

## D-051 · Recorrido de pruebas del flujo de Asociaciones

**19 de septiembre de 2026.** Antes de disparar nada se revisaron los 41 registros de Organizaciones
para ver a quién alcanzaría cada búsqueda. Hallazgo que habilitó todo lo demás: **la base no tiene
correos de asociaciones externas reales** — casi todos son `sistemas+algo@` (direcciones con "+" que
caen en la bandeja de sistemas) o dominios inventados. Se pudo probar sin escribirle a nadie de
fuera.

Se crearon ocho organizaciones `ZZ PRUEBA 19sep` con sus contactos, una por cada camino que había que
cubrir. Resultados:

| Escenario | Caso probado | Resultado |
|---|---|---|
| `A-1` | Contacto bueno + contacto malo | ✅ Mandó al bueno, avisó del malo, marcó la fecha |
| `A-1` | **Solo** contacto malo | ❌ → ✅ Aquí salió D-050. Arreglado y re-probado |
| `A-1` | Sin contacto / sin correo | ✅ Aviso interno, bandera roja, **sin** marcar enviado |
| `A-2.1` | Seguimiento a los 5 días | ✅ Mandó y marcó |
| `A-2.1` | **Solo** contacto malo | ❌ → ✅ Mismo D-050. Arreglado y re-probado |
| `A-2.2` | Pasar a "Sin respuesta" a los 20 días | ✅ Con el valor real del selector |
| `A-5` | Convenio revisado pero sin documento | ✅ Aviso "faltan datos", no marcó nada |
| `A-5` | Búsqueda vacía | ✅ 1 operación, no dispara nada (candado D-033) |
| `A-6` | Convenio firmado → fase final | ✅ Valor real del selector, y **ya no reincide** |

`A-6` confirma que el bucle infinito quedó cerrado: al pasar a la fase final, el registro deja de
calificar para la búsqueda.

**Lo que no se pudo probar así:** `A-3` y `A-4` no se disparan por búsqueda sino por un evento
externo — una cita de Calendly y un envío de formulario, respectivamente. Correrlos a mano da 1
operación y 0 transferencia. Para cerrarlos hace falta agendar una cita de prueba y mandar el
formulario de captura.

**Pendiente de decisión — el aviso se repite cada lunes.** Tres asociaciones reales
(*Albergue Nuevo Amanecer*, *Comedor Comunitario Manos Unidas*, *Casa Cuna Divina Providencia*) no
tienen correo de contacto. Las búsquedas **no excluyen** la bandera roja `⚠️ Contacto con problema`,
así que cada lunes vuelven a caer y vuelven a generar su aviso. El reintento es intencional —los
correos lo prometen— pero el aviso repetido no: son tres correos por semana indefinidos, y así es
como se deja de leer los avisos del sistema. Opciones: avisar solo la primera vez (agregar la
bandera a la condición del módulo de correo, sin tocar la búsqueda, para que siga reintentando en
silencio), o mandar un solo resumen semanal con todas las pendientes.

**Datos de prueba:** las ocho organizaciones `ZZ PRUEBA 19sep` y sus contactos siguen en la base,
pero se les quitó el campo `Tipo`, que todas las búsquedas exigen. Así no generan ruido el lunes y
los resultados se pueden revisar. Borrarlos cuando ya no hagan falta.

---

## D-052 · Las dos escalas del sistema no coinciden — el match no puede comparar texto

**23 de septiembre de 2026.** Al preparar el motor de match salió un problema de diseño que estaba
escondido desde que se crearon las dos tablas: **los campos que el motor tiene que cruzar usan
vocabularios distintos.**

| Lo que pide la empresa (Eventos) | Lo que ofrece la asociación (Organizaciones) |
|---|---|
| `Número de asistentes`: 1-5, 6-10, 11-15, 16-20, 21-25, 26-30, 31-40, 41-50, 51-75, 76-100, Más de 100 | `Voluntarios que puede recibir`: 1-10, 11-20, 21-30, 31-40, 41-50, 50+ |
| `Duración`: Jornada Matutina, Jornada Vespertina, Jornada Completa, Más de una jornada | `Horarios disponibles`: Mañana (8am - 1pm), Tarde (3pm a 7pm) |

Comparadas como cadenas, de once contra seis valores **solo coincidirían dos** (*31-40* y *41-50*), y
del horario **ninguno**. Un motor que compare texto daría casi siempre 0%, y peor: daría 0% de forma
silenciosa, que es el modo de falla que este proyecto ya conoce.

**El arreglo son tres campos calculados en Airtable**, no lógica en Make, para que el número sea
visible en la interfaz y reutilizable:

| Campo | Tabla | Qué hace |
|---|---|---|
| `Voluntarios tope` (`flddIiUlg51hIY9I0`) | Eventos | Tope numérico del rango que pidió la empresa |
| `Capacidad tope` (`flduCGeMjOO69VV8F`) | Organizaciones | Tope numérico de lo que aguanta la asociación. `50+` → 999 |
| `Turno requerido` (`fld1ezlPxMZruYsP0`) | Eventos | Traduce la jornada al vocabulario de la asociación |

Verificados contra la data demo: 25, 15 y 100 de tope, y turnos *Mañana* y *Mañana y Tarde*.

> **Regla:** antes de cruzar dos campos de tablas distintas, verificar que las opciones sean
> idénticas. Si no lo son, **la conversión va en un campo calculado de Airtable**, no en una
> expresión de Make. Ya estaba advertido en la descripción de `Beneficiarios de interés` y de
> `Meses de interés` —ahí sí coinciden—, pero nadie lo revisó para capacidad y horario.

---

## D-053 · Pesos del match y por qué la causa es un candado, no un peso

**23 de septiembre de 2026.** Primera versión de la fórmula de afinidad:

**Candado (elimina, no resta):** la **causa**. Si la asociación no atiende ninguno de los
beneficiarios que pidió la empresa, no es candidata. Se probó primero como peso de 35 puntos y el
resultado fue inservible: asociaciones con la causa equivocada seguían saliendo con 50%, porque
sumaban cupo, mes y turno. Una sugerencia con la causa equivocada no es una sugerencia mala, es una
sugerencia **inválida**.

**Los cinco pesos, sobre 100:**

| Criterio | Peso | Por qué |
|---|---|---|
| Cupo suficiente | 30 | Restricción física: si no caben, no hay evento |
| Mes compatible | 25 | Restricción de calendario, igual de dura |
| Mismo municipio | 20 | Importa, pero Nuevo León es compacto y se puede ceder |
| Turno compatible | 15 | Se puede negociar más que el mes |
| Evento del catálogo en común | 10 | La señal más precisa, pero la menos frecuente |

**Estos pesos son una decisión de negocio, no técnica.** Cambiarlos es una línea en el módulo 5 de
`E-10`. Quedan a confirmación de Ana Cristina.

---

## D-054 · E-10 funciona — y el error era un campo obligatorio invisible

**23 de septiembre de 2026.** El escenario `E-10) Motor de Match` (**6385406**) quedó **funcionando
y activo**, corriendo todos los días a las 09:00.

**La causa de todo fue una sola:** el módulo `util:SetVariables` tiene un parámetro obligatorio
llamado **`scope`** (*Variable lifetime*, valores `roundtrip` u `execution`) que está marcado como
**advanced**, así que **no aparece en el esquema del módulo a menos que se pida explícitamente** con
`includeAdvancedFields: true`. Al omitirlo, Make rechaza el escenario con
*«Validation failed for 1 parameter(s). Missing value of required parameter 'scope'»*.

Lo engañoso es **dónde** se reporta: el error aparecía sobre el módulo de Airtable *anterior* al
`SetVariables`, no sobre el `SetVariables` mismo. Eso mandó la depuración por cuatro caminos falsos
—la expresión de ordenamiento, `length()` sobre texto indefinido, el filtro puesto sobre el
agregador, y un `SetVariables` supuestamente incompatible con un *Search Records*—. Ninguno era el
problema: al agregar `"scope": "roundtrip"` todo lo demás funcionó sin cambios, incluida la cadena
`join(slice(reverse(sort(split(...)))))` que se había descartado por sospechosa.

> **Regla:** antes de usar un módulo de Make por primera vez, pedir su esquema con
> **`includeAdvancedFields: true`**. Los campos *advanced* pueden ser obligatorios, y el error que
> producen señala al módulo equivocado.

> **Limitación del entorno, confirmada:** `executions_get-detail` de este MCP devuelve únicamente
> `{"status": "WARNING"}` — no expone el módulo que falla ni su mensaje. El error real solo se vio
> cuando Ethan abrió la ejecución en el panel de Make y pasó el texto. **Para cualquier fallo de un
> escenario, el camino corto es leer el error en el panel**, no iterar a ciegas por API.

### Las cinco rutas, verificadas

| Caso probado | Resultado |
|---|---|
| Cementos Regios (Comedores · Monterrey · 25 vol · Marzo · matutina) | `100% · Comedor Santa Rosa` — los cinco criterios ✓ |
| Banca Regia (Niños/Educación · Guadalupe · 15 vol · Abril · completa) | `100% · Casa Hogar Estrella` |
| Logística Sierra (M.Ambiente/Migrantes · Apodaca · 100 vol · Octubre) | `80% · Red Verde` (municipio ✗) y `60% · Albergue Paso del Norte` (cupo 40 vs 100 ✗), **ordenadas de mayor a menor** |
| Empresa que pide *Discapacidad*, que ninguna asociación atiende | Escribe *«Sin candidatas»* explicando por qué |
| Evento en fase 04 sin beneficiarios ni asistentes | No escribe nada y manda el aviso de datos faltantes |

Los resultados coinciden exactamente con la matriz calculada a mano antes de construirlo.

### Cómo queda operando

- Corre **diario a las 09:00**. En vacío cuesta **1 operación**.
- El **candado** es el propio campo `Sugerencias de asociación`: si tiene texto, no se recalcula. Para
  volver a calcular, el equipo **borra el texto** y al día siguiente aparece de nuevo. El mensaje lo
  dice en la primera línea.
- El orden se logra rellenando el porcentaje con **espacios** (no ceros) para que el orden
  alfabético coincida con el numérico sin que se lea `080%`.

### Limitación conocida de esta versión

El cruce de **mes** y de **evento del catálogo** compara solo el **primer** valor que eligió la
empresa, no todos. Si una empresa marca tres meses, se evalúa el primero. Se hizo así a propósito:
las funciones de conjuntos de Make (`merge` / `distinct`) no se comportaron como se esperaba y no hay
forma de inspeccionarlas desde la API. Con varios meses el motor subestima la afinidad, nunca la
sobreestima — falla hacia el lado seguro.

**Pendiente de limpieza a mano** (la API no lo permite): borrar los campos temporales `ZZ test regex`
(`fld0BucDFjZCNxdXT`) y `ZZ test filtro` (`fldnUjAUJWtDyWO5q`) de Organizaciones, y descartar las 15
ejecuciones incompletas que dejó la depuración.
