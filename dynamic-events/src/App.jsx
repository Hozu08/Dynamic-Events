import { useState } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { Landing } from "./components/Landing";
import { ChatPage } from "./components/ChatPage";
import { GamePage } from "./components/GamePage";
import { CreateHistory } from "./components/CreateHistory";
import { AboutUs } from "./components/AboutUs";
import { AddInfo } from "./components/AddInfo";

/**
 * AppContent - Contenido interno que tiene acceso al ThemeContext
 */
function AppContent() {
  const { currentTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState("landing"); // 'landing' | 'chat' | 'create-history' | 'game' | 'about-us' | 'add-info'
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [scrollToSection, setScrollToSection] = useState(null); // 'policies' | 'faq' | 'instructions'

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

  // Navegar a minijuegos (ir a landing y hacer scroll a la sección)
  const navigateToMinijuegos = () => {
    setCurrentPage("landing");
    setSelectedTheme(null);
    // Esperar a que el componente se monte y luego hacer scroll
    setTimeout(() => {
      // Buscar la sección de minijuegos según el tema actual
      const minijuegosId = 
        currentTheme === 'christmas' ? "minijuegos" :
        currentTheme === 'halloween' ? "minijuegos-halloween" :
        currentTheme === 'vacation' ? "minijuegos-vacation" :
        "minijuegos";
      const minijuegosSection = document.getElementById(minijuegosId);
      if (minijuegosSection) {
        const headerOffset = 100; // Compensar header sticky
        const elementPosition = minijuegosSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      } else {
        window.scrollTo(0, 0);
      }
    }, 100);
  };

  // Navegar a AboutUs
  const navigateToAboutUs = () => {
    setCurrentPage("about-us");
    window.scrollTo(0, 0);
  };

  // Navegar a AddInfo (con opción de scroll a sección específica)
  const navigateToAddInfo = (section = null) => {
    setScrollToSection(section);
    setCurrentPage("add-info");
    // El scroll se maneja dentro del componente AddInfo
  };

  return (
    <>
      {currentPage === "landing" && (
        <Landing 
          onNavigateToChat={navigateToChat}
          onNavigateToCreateHistory={navigateToCreateHistory}
          onNavigateToGame={navigateToGame}
          onNavigateToLanding={navigateToLanding}
          onNavigateToMinijuegos={navigateToMinijuegos}
          onNavigateToAboutUs={navigateToAboutUs}
          onNavigateToAddInfo={navigateToAddInfo}
        />
      )}

      {currentPage === "create-history" && (
        <CreateHistory 
          onNavigateToLanding={navigateToLanding}
          onNavigateToGame={navigateToGame}
          onNavigateToChat={navigateToChat}
          onNavigateToCreateHistory={navigateToCreateHistory}
          onNavigateToMinijuegos={navigateToMinijuegos}
          onNavigateToAboutUs={navigateToAboutUs}
          onNavigateToAddInfo={navigateToAddInfo}
        />
      )}

      {currentPage === "chat" && (
        <ChatPage 
          onBack={navigateToLanding}
          onNavigateToGame={navigateToGame}
          onNavigateToChat={navigateToChat}
          onNavigateToCreateHistory={navigateToCreateHistory}
          onNavigateToMinijuegos={navigateToMinijuegos}
          onNavigateToAboutUs={navigateToAboutUs}
          onNavigateToAddInfo={navigateToAddInfo}
          selectedTheme={selectedTheme}
        />
      )}

      {currentPage === "game" && (
        <GamePage 
          onBack={navigateToLanding}
          onNavigateToChat={navigateToChat}
          onNavigateToCreateHistory={navigateToCreateHistory}
          onNavigateToMinijuegos={navigateToMinijuegos}
          onNavigateToAboutUs={navigateToAboutUs}
          onNavigateToAddInfo={navigateToAddInfo}
        />
      )}

      {currentPage === "about-us" && (
        <AboutUs 
          onBack={navigateToLanding}
          onNavigateToChat={navigateToChat}
          onNavigateToCreateHistory={navigateToCreateHistory}
          onNavigateToMinijuegos={navigateToMinijuegos}
          onNavigateToLanding={navigateToLanding}
          onNavigateToAddInfo={navigateToAddInfo}
          onNavigateToAboutUs={navigateToAboutUs}
        />
      )}

      {currentPage === "add-info" && (
        <AddInfo 
          onBack={navigateToLanding}
          onNavigateToChat={navigateToChat}
          onNavigateToCreateHistory={navigateToCreateHistory}
          onNavigateToMinijuegos={navigateToMinijuegos}
          onNavigateToAboutUs={navigateToAboutUs}
          onNavigateToLanding={navigateToLanding}
          scrollToSection={scrollToSection}
        />
      )}
    </>
  );
}

/**
 * App - Router simple para navegar entre Landing, Chat, CreateHistory, Juego, AboutUs y AddInfo
 */
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;