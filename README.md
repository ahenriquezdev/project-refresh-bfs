# Documentación de la API Node.js MongoDB

Esta API permite interactuar con una base de datos MongoDB para gestionar usuarios.

## URL Base

```
http://localhost:3000/
```

## Pasos para Ejecutar

### 1. Descargar el Repositorio

Descarga el repositorio ubicado en [https://github.com/ahenriquezdev/project-refresh-bfs](https://github.com/ahenriquezdev/project-refresh-bfs) utilizando Git:

```bash
git clone https://github.com/ahenriquezdev/project-refresh-bfs
```

Después, cambia al directorio raíz del repositorio:

```bash
cd project-refresh-bfs
```

### 2. Levantar el Ambiente de Producción

Una vez descargado el repositorio, levanta el ambiente de producción ejecutando el siguiente comando dentro del directorio del repositorio:

```bash
docker-compose up -d
```

Esto iniciará los contenedores en segundo plano según lo definido en el archivo `docker-compose.yml`.

### 3. Importar la Colección de Datos de Prueba

Después de tener los servicios en funcionamiento, importa la colección de datos de prueba en la base de datos MongoDB ejecutando el siguiente comando desde la consola:

```bash
docker exec -it mongodb mongoimport --host mongodb -u root -p pass123 --authenticationDatabase admin --db project-db --collection users --file /usr/src/app/users.json --jsonArray
```

Este comando utiliza `mongoimport` para importar los datos del archivo `users.json` en la colección `users` de la base de datos `project-db`.

## Endpoints

### 1. Obtener todos los usuarios

- **URL:** `/api/get/all`
- **Método:** `GET`
- **Descripción:** Obtiene todos los documentos en la colección de usuarios.
- **Parámetros:** Ninguno
- **Respuesta:**
  - **Código de Estado:** 200 (Éxito)
  - **Formato de Datos:** JSON
  - **Cuerpo de la Respuesta:**
    ```json
    {
      "status": "success",
      "data": [user1, user2, ...]
    }
    ```
- **Ejemplo:**
  ```http
  GET http://localhost:3000/api/get/all
  ```

### 2. Consultar usuarios por nombre

- **URL:** `/api/get`
- **Método:** `GET`
- **Descripción:** Consulta usuarios por su nombre o apellido.
- **Parámetros:**
  - `name` (string): El nombre a buscar.
- **Respuesta:**
  - **Código de Estado:** 200 (Éxito)
  - **Formato de Datos:** JSON
  - **Cuerpo de la Respuesta:**
    ```json
    {
      "status": "success",
      "data": [user1, user2, ...]
    }
    ```
- **Ejemplo:**
  ```http
  GET http://localhost:3000/api/get?name=John
  ```

### 3. Crear o actualizar un usuario

- **URL:** `/api/update/:id`
- **Método:** `PUT`
- **Descripción:** Crea un nuevo usuario o actualiza un usuario existente.
- **Parámetros:**
  - `id` (string): El ID del usuario.
- **Cuerpo de la Solicitud:**
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  }
  ```
- **Respuesta:**
  - **Código de Estado:** 200 (Éxito) o 201 (Creado)
  - **Formato de Datos:** JSON
  - **Cuerpo de la Respuesta:**
    ```json
    {
      "status": "success",
      "data": "User created" o "User updated"
    }
    ```
- **Ejemplo:**
  ```http
  PUT http://localhost:3000/api/update/123
  ```

### 4. Eliminar un usuario

- **URL:** `/api/delete/:id`
- **Método:** `DELETE`
- **Descripción:** Elimina un usuario por ID.
- **Parámetros:**
  - `id` (string): El ID del usuario a eliminar.
- **Respuesta:**
  - **Código de Estado:** 200 (Éxito) o 204 (Sin Contenido)
  - **Formato de Datos:** JSON
  - **Cuerpo de la Respuesta:**
    ```json
    {
      "status": "success",
      "data": "User deleted!" o "User was not found!"
    }
    ```
- **Ejemplo:**
  ```http
  DELETE http://localhost:3000/api/delete/123
  ```

---

## Importar Colección de Endpoints en Thunderclient

Para importar la colección de endpoints en Thunderclient, sigue estos pasos:

1. Abre la extensión Thunderclient en Visual Studio Code.
2. Ve a la sección **Collections/Colecciones**.
3. En el menú principal de esta sección, selecciona la opción de **Importar**.
4. Busca y selecciona el archivo llamado **thunder-collection_project-endpoints.json**.
5. Una vez cargada la colección de endpoints de prueba, estarás listo para realizar las mismas con ayuda de esta herramienta.

### Endpoints Disponibles

Los endpoints disponibles en la colección son:

- **getAllUsers**: Obtiene todos los usuarios de la base de datos.
- **getUsersByName**: Consulta usuarios por su nombre o apellido.
- **updateUserById**: Crea un nuevo usuario o actualiza uno existente por su ID.
- **deleteUserById**: Elimina un usuario por su ID.

Estos endpoints están preconfigurados en Thunderclient para que puedas probar fácilmente la API y realizar diversas operaciones.
