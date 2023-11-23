# Eco-encuentro Backend API
Base URL
https://NO-URL-YET.com/api

Notes: For this app to work, need to create .env and add the mongoDB url, and google maps api key.

#### Endpoints for users:
##### https://NO-URL-YET.com/api/users

Get Users
Endpoint: /
Method: GET
Description: Get a list of all users.
Authentication: Requires a valid JSON Web Token (JWT) in the request header.
Response success:
```
message: 'Usuarios no encontrados.'
```
Error:
```
500: 'Error interno del servidor.'
401: Missing or invalid JWT.
```

Create User
Endpoint: /create
Method: POST
Description: Create a new user.
Request Body:
name (string, min 4 characters, required): The name of the user.
email (string, required, unique): The email address of the user.
password (string, min 7 characters, required): The user's password.
Response:
```
message (string): 'Usuario creado exitosamente.'
token (string): JWT token for the newly created user.
```
Errors:
```
400: El email proporcionado es incorrecto.
400: Faltan propiedades requeridas del usuario.
401: Missing or invalid JWT.
409: El correo electrónico ya está en uso.
500: Error interno del servidor
```

User Login
Endpoint: /login
Method: POST
Description: Authenticate a user by email and password.
Request Body:
email (string, required): The user's email address.
password (string, required): The user's password.
Response:
```
message (string): Inicio de sesión exitoso.
token (string): JWT token for the authenticated user.
```
Errors:
```
404: No se encontró un usuario con ese correo electrónico.
401: Contraseña incorrecta.
401: Missing or invalid JWT.
500: Error interno del servidor.
```

Delete All Users
Endpoint: /delete
Method: DELETE
Description: Delete all users (for development purposes only). Requires a valid JSON Web Token (JWT) in the request header.
Response:
```
message (string): All users deleted successfully.
```
Errors:
```
500: Internal server error.
401: Missing or invalid JWT.
```

Authentication
JWT (JSON Web Token) is required for certain endpoints. Include the JWT in the request header:
```
Authorization: Bearer token_here
```


#### Endpoints for events:
##### https://NO-URL-YET.com/api/events

Get Events
Endpoint: /
Method: GET
Description: Get a list of all events.
Authentication: None.
Response success:
```
title (string, required): The title of the event.
location (string, required): The location of the event.
eventImg (string): URL of the event image.
createdBy (string, required): The ID of the user creating the event.
eventDate (date): The date of the event.
category: (string), and enum based on figma (CHECK)
description: (string), min 50 letters.
usersJoined: (array) of usersId.
```
If there are not events:
```
message: 'Eventos no encontrados.'
```
Errors:
```
404: No events found.
500: Internal server error.
```

Create Event
Endpoint: /create
Method: POST
Description: Create a new event.
Authentication: Requires a valid JSON Web Token (JWT) in the request header.
Request Body:
```
title (string, required): The title of the event.
location (string, required): The location of the event.
eventImg (string): URL of the event image.
createdBy (string, required): The ID of the user creating the event.
eventDate (date): The date of the event.
category: (string), and enum based on figma (CHECK)
description: (string), min 50 letters.
```
Response:
```
message (string): 'Evento {title} creado exitosamente.'
mapLink (string): Link to the event location on a map.
evento (object): Event data, including title, location, createdBy, eventDate, and eventImg.
```
Errors:
```
400: Missing or incorrect input data.
404: User not found.
500: Internal server error.
```

Users Joining Event
Endpoint: /usersevent
Method: PUT
Description: Add a user to an event.
Authentication: Requires a valid JSON Web Token (JWT) in the request header.
Request Body:
```
eventId (string, required): The ID of the event.
userId (string, required): The ID of the user.
```
Response:
```
message (string): 'El usuario {userId} se unió al evento.'
```
Errors:
```
404: Event not found.
400: User already subscribed to the event.
500: Internal server error.
```

Delete Event
Endpoint: /delete/:eventId
Method: DELETE
Description: Delete a specific event by its ID.
Authentication: Requires a valid JSON Web Token (JWT) in the request header.
Parameters:
eventId (string, required): The ID of the event to delete.
Response:
```
message (string): 'El evento {title} fue eliminado.'
```
Errors:
```
404: Event not found.
500: Internal server error.
```

Delete All Events
Endpoint: /delete/all
Method: DELETE
Description: Delete all events (for development purposes only).
Authentication: Requires a valid JSON Web Token (JWT) in the request header.
Response:
```
message (string): 'Eventos eliminados.'
```
Errors:
```
500: Internal server error.
```

Authentication
JWT (JSON Web Token) is required for certain endpoints. Include the JWT in the request header:
```
Authorization: Bearer Bearer token_here
```
