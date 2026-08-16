# 🎲 Noche de Juegos

Auxiliar web P2P para jugar juegos sociales alrededor de una mesa usando celulares.

## Idea

- Una única mesa, sin códigos de sala.
- El primer dispositivo que entra queda como admin.
- El admin elige el juego y reparte.
- Trystero/WebRTC conecta los celulares directamente.
- Cada teléfono recibe sólo la información secreta que necesita mostrar.
- Después de mirar la carta, el celular vuelve a la mesa o al bolsillo.
- Conversación, acusaciones, votaciones, mentiras, desafíos y puntuación se resuelven socialmente o con componentes físicos.
- Si algo se puede hacer mejor con cartas, dados, fichas o tablero, no se digitaliza.

## Juegos incluidos en v0.2

- 🦎 Camaleón: reparte categoría + palabra a todos menos al Camaleón. No hay votación digital.
- 🕵️ Spyfall: reparte lugar + rol a todos menos al Espía. Preguntas y acusaciones son completamente sociales.
- 👑 Golpe: el teléfono sólo reparte dos influencias secretas. Monedas, acciones, bloqueos y desafíos se llevan físicamente/socialmente.

Picante se quitó de la app porque se puede jugar directamente con un mazo físico y el teléfono no aporta suficiente valor.

## Flujo

1. Todos abren la misma URL y ponen su nombre.
2. El primer dispositivo queda como admin.
3. El admin elige un juego.
4. El admin toca `Repartir cartas`.
5. Cada jugador mantiene pulsado el botón de ojo para mirar su información secreta.
6. Guardan el celular y juegan alrededor de la mesa.
7. El admin puede tocar `Jugar de nuevo` para repartir una ronda nueva sin volver al selector.

## Ejecución

Es una web estática. `index.html` importa Trystero desde CDN, por lo que se puede alojar directamente con GitHub Pages.

Los jugadores deben abrir la misma URL. No se usa código de sala: internamente todos entran a `mesa-unica` dentro del `appId` de Noche de Juegos.

## Privacidad de juego

El dispositivo admin genera el reparto y envía a cada peer únicamente su información privada. El estado público no contiene los secretos de los jugadores.
