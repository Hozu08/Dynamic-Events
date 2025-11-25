import { useState } from "react";
import { ChristmasLanding } from "./components/ChristmasLanding";
import { ChatPage } from "./components/ChatPage";
import { GamePage } from "./components/GamePage";

/**
 * App - Router simple para navegar entre Landing, Chat y Juego
 */
function App() {
  const [currentPage, setCurrentPage] = useState("landing"); // 'landing' | 'chat' | 'game'
  const [selectedTheme, setSelectedTheme] = useState(null);

  // Navegar al chat
  const navigateToChat = (theme = null) => {
    setSelectedTheme(theme);
    setCurrentPage("chat");
    window.scrollTo(0, 0);
  };

  // Navegar al juego
  const navigateToGame = () => {
    setCurrentPage("game");
    window.scrollTo(0, 0);
  };

  // Volver a la landing
  const navigateToLanding = () => {
    setCurrentPage("landing");
    setSelectedTheme(null);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {currentPage === "landing" && (
        <ChristmasLanding 
          onNavigateToChat={navigateToChat}
          onNavigateToGame={navigateToGame}
          onNavigateToLanding={navigateToLanding}
        />
      )}

      {currentPage === "chat" && (
        <ChatPage 
          onBack={navigateToLanding}
          onNavigateToGame={navigateToGame}
          selectedTheme={selectedTheme}
        />
      )}

      {currentPage === "game" && (
        <GamePage 
          onBack={navigateToLanding}
          onNavigateToChat={navigateToChat}
        />
      )}
    </>
  );
}

export default App;