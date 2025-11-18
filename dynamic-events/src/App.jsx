import { useState } from "react";
import { ChristmasLanding } from "./components/ChristmasLanding";
import { ChatPage } from "./components/ChatPage";

/**
 * App - Router simple para navegar entre Landing y Chat
 */
function App() {
  const [currentPage, setCurrentPage] = useState("landing"); // 'landing' | 'chat'
  const [selectedTheme, setSelectedTheme] = useState(null);

  // Navegar al chat
  const navigateToChat = (theme = null) => {
    setSelectedTheme(theme);
    setCurrentPage("chat");
    // Scroll to top
    window.scrollTo(0, 0);
  };

  // Volver a la landing
  const navigateToLanding = () => {
    setCurrentPage("landing");
    setSelectedTheme(null);
    // Scroll to top
    window.scrollTo(0, 0);
  };

  return (
    <>
      {currentPage === "landing" && (
        <ChristmasLanding onNavigateToChat={navigateToChat} />
      )}

      {currentPage === "chat" && (
        <ChatPage 
          onBack={navigateToLanding} 
          selectedTheme={selectedTheme}
        />
      )}
    </>
  );
}

export default App;