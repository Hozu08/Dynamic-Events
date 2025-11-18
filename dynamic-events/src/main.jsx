import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ChatIA } from './components/ChatIA.jsx'
import { MinigameTest } from './components/MinigameTest.jsx'

createRoot(document.getElementById('root')).render(
  <>
    {/* OPCIÓN 1: Chat Navideño */}
    <ChatIA
      userName="Niño curioso"
      assistantName="Santa Claus"
      apiEndpoint="/api/chat"
      title="🎅 ¡Crea tu historia navideña con Santa!"
      description="¡Ho, ho, ho! 🎄✨ Bienvenido, pequeño soñador. Aquí tú y yo escribiremos juntos una historia mágica de Navidad. Escribe tu primera frase para comenzar la aventura."
      finishMarker="<<FIN_DE_LA_HISTORIA>>"
      placeholder="Continúa la historia..."
      theme="dark"
      maxMessagesHeight="400px"
      onReset={() => console.log("Historia reiniciada")}
      onSend={(message) => console.log("Mensaje enviado:", message)}
      onFinish={(messages) => console.log("Historia completa:", messages)}
    />

    <MinigameTest />

    {/* OPCIÓN 2: Minijuego Navideño */}
    {/* <MinigameTest /> */}

    {/* OPCIÓN 3: Ambos (uno debajo del otro) */}
    {/* 
    <ChatIA {...propsDelChat} />
    <MinigameTest />
    */}
  </>
)