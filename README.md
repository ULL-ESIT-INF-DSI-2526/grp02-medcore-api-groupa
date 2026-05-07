# Segundo trabajo en grupo - MedCore: API REST con Node/Express

- Sofia Bethencourt Márquez  **alu0101637051@ull.edu.es**
- Karen Alessia Santos Verzilli **alu0101677354@ull.edu.es**
- Adrián David Hernández González **alu0101637594@ull.edu.es**

La práctica consistió en desarrollar una API REST para un sistema de gestión de pacientes, personal médico, medicamentos y registros médicos. Se implementaron las operaciones CRUD (Crear, Leer, Actualizar, Borrar) para cada entidad.

### Lógica de borrado:
La logica de borrado se implementó para garantizar la integridad de los datos y evitar referencias huérfanas. Se establecieron las siguientes reglas:

Pacientes -> Si un paciente se elimina de la base de datos, las consultas a su nombre se eliminan también.
Staff -> Si un personal médico se elimina de la base de datos, las consultas a su nombre se eliminan también.
Medicinas -> Si un medicamento se elimina de la base de datos, se eliminan de las consultas médicas los medicamentos borrados.
Consultas -> Si una consulta se elimina de la base de datos, se restaura el stock de los medicamentos asociados a esa consulta.

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupa/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupa?branch=main)

[![CI Tests](https://github.com/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupa/actions/workflows/ci.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2526/grp02-medcore-api-groupa/actions/workflows/ci.yml)

[![Render](https://grp02-medcore-api-groupa-isje.onrender.com)](https://grp02-medcore-api-groupa-isje.onrender.com)

