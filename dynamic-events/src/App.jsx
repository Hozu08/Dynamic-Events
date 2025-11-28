import { useState } from "react";
import { ChristmasLanding } from "./components/ChristmasLanding";
import { ChatPage } from "./components/ChatPage";
import { GamePage } from "./components/GamePage";
import { CreateHistory } from "./components/CreateHistory";

/**
 * App - Router simple para navegar entre Landing, Chat, CreateHistory y Juego
 */
function App() {
  const [currentPage, setCurrentPage] = useState("landing"); // 'landing' | 'chat' | 'create-history' | 'game'
  const [selectedTheme, setSelectedTheme] = useState(null);

  // Navegar al chat
  const navigateToChat = (theme = null) => {
    setSelectedTheme(theme);
    setCurrentPage("chat");
    window.scrollTo(0, 0);
  };

  // Navegar a crear historia
  const navigateToCreateHistory = () => {
    setCurrentPage("create-history");
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
          onNavigateToCreateHistory={navigateToCreateHistory}
          onNavigateToGame={navigateToGame}
          onNavigateToLanding={navigateToLanding}
        />
      )}

      {currentPage === "create-history" && (
        <CreateHistory 
          onNavigateToLanding={navigateToLanding}
          onNavigateToGame={navigateToGame}
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