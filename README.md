# 🎲 Noche de Juegos

Auxiliar web P2P para jugar juegos sociales alrededor de una mesa usando celulares.

## Idea

- Una única mesa, sin códigos de sala.
- El primer dispositivo que entra queda como admin.
- El admin elige el juego e inicia la partida.
- Trystero/WebRTC conecta los celulares directamente.
- Cada teléfono recibe sólo la información secreta que necesita mostrar.
- La conversación, las acusaciones y el chamuyo se hacen cara a cara.
- Si un juego funciona mejor con dados, fichas o tablero físico, la web puede limitarse a llevar la parte oculta o administrativa.

## Juegos incluidos en v0.1

- 🦎 Camaleón: palabra secreta, infiltrado y orden inicial de pistas.
- 💀 Calaveras: fichas ocultas, pilas, apuestas y puntuación.
- 🌶️ Picante: mano privada, carta boca abajo, declaración y desafío.
- 👑 Golpe: influencias privadas, monedas, acciones y desafíos básicos.

## Estado

Esta es una primera versión jugable para probar la conexión y el flujo de mesa. Golpe y Picante todavía tienen reglas avanzadas que conviene pulir después de una prueba real a tres celulares; la estructura P2P y el sistema de secretos ya están preparados para crecer sin cambiar el lobby.

## Ejecución

Es una web estática. `index.html` importa Trystero desde CDN, por lo que se puede alojar directamente con GitHub Pages.

Los jugadores deben abrir la misma URL. No se usa código de sala: internamente todos entran a `mesa-unica` dentro del `appId` de Noche de Juegos.

## Privacidad de juego

El dispositivo admin mantiene el estado autoritativo (mazos, azar, turnos y secretos). A los demás peers se les envían snapshots públicos y mensajes privados dirigidos cuando corresponde.
