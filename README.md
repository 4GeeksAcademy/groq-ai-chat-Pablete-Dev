# Groq AI Chat

Aplicación de chat construida con Next.js, React y TypeScript que se conecta a la API real de Groq y muestra métricas de consumo durante la conversación.

## Tecnologías

- Next.js
- React
- TypeScript
- Tailwind CSS
- Groq API
- `fetch` nativo
- `localStorage`

## Funcionalidades

- Chat real con un modelo de Groq.
- Historial visual diferenciado entre usuario e IA.
- Envío del historial completo en cada solicitud para mantener el contexto.
- Estado de carga visible mientras se espera la respuesta.
- Manejo de errores de la solicitud.
- Persistencia de la conversación después de recargar la página.
- Botón para borrar la conversación y sus métricas.
- Métricas acumuladas:
  - Prompt tokens
  - Completion tokens
  - Total tokens
  - Cantidad de respuestas
  - Tiempo acumulado
  - Modelo utilizado

## Seguridad

- La API Key no se expone al navegador.
- `process.env.GROQ_API_KEY` se utiliza únicamente en `src/app/api/chat/route.ts`.
- El frontend llama a `/api/chat` y nunca directamente a Groq.
- `.env.local` está ignorado por Git.
- Nunca subas una API Key al repositorio. Mantén las claves en variables de entorno locales y privadas.

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto con esta variable:

```env
GROQ_API_KEY=tu_api_key_de_groq
```

No incluyas una clave real en el repositorio ni en archivos compartidos.

## Ejecución

```bash
npm install
npm run dev
```

Luego abre [http://localhost:3000](http://localhost:3000).

## API interna

La ruta `POST /api/chat` recibe un JSON con el historial de mensajes. Por ejemplo:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hola"
    }
  ]
}
```

La respuesta incluye estos campos:

- `message`: respuesta generada por el modelo.
- `usage`: métricas de consumo y tiempos de la solicitud.
- `model`: identificador del modelo utilizado.

## Modelo utilizado

Actualmente el proyecto usa `qwen/qwen3.8-27b`.

Inicialmente se intentó utilizar el modelo indicado en el reto, `qwen/qwen3.6-27b`. Durante la prueba real, la API respondió `model_not_found`, por lo que se utilizó `qwen/qwen3.8-27b`, que estaba disponible y respondió correctamente.

## Persistencia

Se usa `useEffect` para cargar los mensajes y las métricas desde `localStorage` al montar la interfaz, y para guardarlos cuando cambian. La conversación y las métricas pueden recuperarse después de recargar la página.

## Diseño con v0.dev

Se utilizó v0.dev para generar una propuesta visual inicial de la interfaz, que se tomó como referencia de diseño. La integración real con Groq, el estado React, las métricas y la persistencia se implementaron posteriormente en el proyecto Next.js.

## Pruebas realizadas

- Prueba directa contra Groq con `fetch`.
- Prueba de `POST /api/chat` con respuesta HTTP 200.
- Prueba de conversación con contexto.
- Verificación de métricas acumuladas.
- Verificación de persistencia después de recargar la página con F5.
- Verificación del borrado completo de la conversación.
- `npm run lint`.
- `npm run build`.
