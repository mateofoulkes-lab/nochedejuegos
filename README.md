# 🎲 Noche de Juegos

Auxiliar web P2P para jugar juegos sociales alrededor de una mesa usando celulares.

## Idea

- Una única mesa, sin códigos de sala.
- El primer dispositivo que entra queda como admin.
- El admin elige el juego e inicia la partida.
- Trystero/WebRTC conecta los celulares directamente.
- Cada teléfono recibe sólo la información secreta que necesita.
- **El celu reparte. La mesa juega.**
- Conversación, acusaciones, bluff, monedas y gestos se manejan cara a cara.

## v0.3.0 — afinada para 3 jugadores

### 🦎 Camaleón
- 12 categorías y 180 palabras aproximadamente.
- Una persona recibe Camaleón; las otras dos reciben la misma palabra.
- Categoría visible también para el Camaleón.
- Jugador inicial aleatorio.
- No repite combinaciones durante la sesión hasta agotar el banco.
- Sin votación digital.
- Botón **Jugar de nuevo** para el admin.

### 🕵️ Spyfall
- 37 lugares con varios roles por lugar.
- Dos jugadores conocen el lugar; uno es el espía.
- Roles distintos para los jugadores normales.
- Jugador inicial aleatorio.
- No repite lugares durante la sesión hasta agotar el banco.
- Banco opcional de preguntas para cuando alguien se queda trabado.
- Acusaciones y resolución completamente habladas.

### 👑 Golpe
- Mazo digital completo de 15 influencias: 3 de cada personaje.
- Dos cartas secretas por jugador.
- Monedas físicas: cada persona empieza con 2.
- Referencia corta de acciones y bloqueos en pantalla.
- La partida se juega hablando y moviendo monedas.
- El celular sólo interviene cuando cambia una carta:
  - **Revelé/perdí** marca una influencia muerta.
  - **La probé** devuelve una influencia demostrada al mazo, mezcla y roba reemplazo.
  - **Embajador** roba dos cartas y permite elegir cuáles conservar.
- Botón **Jugar de nuevo** para repartir una partida totalmente nueva.

## Seguridad de secretos

Las cartas permanecen borrosas. Para verlas hay que mantener apretado **👁️ Mantené apretado para ver**, de modo que el teléfono pueda quedar apoyado sobre la mesa sin mostrar información accidentalmente.

## Ejecución

Web estática apta para GitHub Pages. `index.html` carga `app.js` y `styles.css`; Trystero se importa desde CDN.

Todos abren la misma URL y entran automáticamente a una única mesa fija. El dispositivo admin conserva el estado autoritativo y envía la información privada únicamente al peer correspondiente.

## Reglas

Ver [`REGLAS.md`](./REGLAS.md) para las reglas de mesa resumidas y adaptadas a tres jugadores.
