import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Header } from "./base/Header";
import { ScrollToTop } from "./base/ScrollToTop";
import { Footer } from "./base/Footer";
import "../styles/ChristmasLanding.css";
import "../styles/CreateHistory.css";
import "../styles/base/utilities.css";

/**
 * CreateHistory - Página para crear historias navideñas con IA mediante formulario por pasos
 * 
 * @param {Object} props
 * @param {Function} props.onNavigateToLanding - Callback para volver a la landing
 * @param {Function} props.onNavigateToGame - Callback para navegar al juego
 * @param {Function} props.onNavigateToChat - Callback para navegar al chat con los datos del formulario
 * @param {Function} props.onNavigateToCreateHistory - Callback para navegar a crear historia
 * @param {Function} props.onNavigateToMinijuegos - Callback para navegar a la sección de minijuegos
 * @param {Function} props.onNavigateToAboutUs - Callback para navegar a AboutUs
 * @param {Function} props.onNavigateToAddInfo - Callback para navegar a AddInfo
 * @param {Object} props.selectedTheme - Tema seleccionado (opcional) para precargar datos
 */
export function CreateHistory({ onNavigateToLanding, onNavigateToGame, onNavigateToChat, onNavigateToCreateHistory, onNavigateToMinijuegos, onNavigateToAboutUs, onNavigateToAddInfo, selectedTheme = null }) {
  const { currentTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    relacion: "",
    tipo: "",
    escenario: "",
    personajes: "",
    nivelMagia: "Mágico",
    mensaje: "",
    extra: ""
  });


  const totalSteps = 3;
  const stepLabels = [
    "Paso 1 de 3 – Protagonista",
    "Paso 2 de 3 – Escenario y magia",
    "Paso 3 de 3 – Mensaje final"
  ];

  // Actualizar datos del formulario
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Seleccionar chip
  const selectChip = (group, value) => {
    if (group === "nivelMagia") {
      updateFormData("nivelMagia", value);
    }
  };

  // Validar paso actual
  const validateStep = (step) => {
    if (step === 0) {
      if (!formData.nombre.trim() || !formData.edad || !formData.relacion || !formData.tipo) {
        alert("Por favor completa todos los campos del Paso 1.");
        return false;
      }
    } else if (step === 1) {
      if (!formData.escenario.trim() || !formData.personajes.trim()) {
        alert("Por favor completa todos los campos del Paso 2.");
        return false;
      }
    } else if (step === 2) {
      if (!formData.mensaje.trim()) {
        alert("Por favor escribe la moraleja o mensaje de la historia en el Paso 3.");
        return false;
      }
    }
    return true;
  };

  // Navegar al siguiente paso
  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navegar al paso anterior
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Construir prompt inicial para la IA con los datos del formulario
  const buildInitialPrompt = () => {
    const { nombre, edad, relacion, tipo, escenario, personajes, nivelMagia, mensaje, extra } = formData;
    
    let prompt = `Quiero crear una historia navideña con los siguientes detalles:\n\n`;
    prompt += `- Protagonista: ${nombre} (${edad})\n`;
    prompt += `- Relación con Santa: ${relacion}\n`;
    prompt += `- Tipo de historia: ${tipo}\n`;
    prompt += `- Escenario: ${escenario}\n`;
    prompt += `- Personajes secundarios: ${personajes}\n`;
    prompt += `- Nivel de magia: ${nivelMagia}\n`;
    prompt += `- Mensaje o moraleja: ${mensaje.trim()}\n`;
    if (extra && extra.trim()) {
      prompt += `- Detalle especial: ${extra.trim()}\n`;
    }
    prompt += `\nPor favor, crea una historia navideña única y mágica usando todos estos elementos.`;
    
    return prompt;
  };

  // Generar historia - Redirigir a ChatPage con los datos del formulario
  const handleGenerate = () => {
    if (!validateStep(currentStep)) return;
    
    // Crear objeto con los datos del formulario para pasarlo al chat
    const formThemeData = {
      title: `La aventura navideña de ${formData.nombre}`,
      icon: "🎄",
      description: buildInitialPrompt(),
      formData: formData // Incluir todos los datos del formulario
    };
    
    // Redirigir al chat con los datos del formulario
    if (onNavigateToChat) {
      onNavigateToChat(formThemeData);
    }
  };

  // Calcular progreso
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className={`landing landing--${currentTheme}`}>
      {/* HEADER */}
      <Header
        logo="Dynamic Events"
        className={`landing-header landing-header--${currentTheme}`}
        sticky
        variant="light"
        onLogoClick={onNavigateToLanding}
        showThemeSelector={true}
      >
        <a href="#minijuegos" className="nav-link" onClick={(e) => { 
          e.preventDefault(); 
          if (onNavigateToMinijuegos) {
            onNavigateToMinijuegos();
          }
        }}>
          Minijuegos
        </a>
        <a href="#" className="nav-link nav-link--active" onClick={(e) => { e.preventDefault(); }}>
          Crear historia IA
        </a>
      </Header>

      {/* HERO */}
      <section className="hero hero--index-navidad hero--red-page create-history-hero">
        <div className="hero-overlay"></div>
        <div className="hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">
              Taller de Santa
          </h1>
            <p className="hero-synopsis">
            En este espacio puedes crear tu historia con un poco de mágia e inteligencia artificial
          </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE INSTRUCCIONES */}
      <section className="landing-section">
        <div className="instrucciones-santa">
          <div className="instrucciones-container">
          <h2 className="instr-title">🎅 Instrucciones para crear tu historia navideña</h2>
          <p className="instr-text">
            Antes de entrar al Taller Mágico de Santa, sigue estas indicaciones para que la IA pueda crear un cuento especial:
          </p>
          <ul className="instr-list">
            <li>📝 Completa todos los campos de cada paso, son obligatorios.</li>
            <li>🎄 El protagonista puede ser tú, un familiar o un personaje inventado.</li>
            <li>✨ Elige el nivel de magia y el tipo de historia para definir el estilo del cuento.</li>
            <li>📍 Describe con detalle el escenario y los personajes secundarios.</li>
            <li>🎁 En el último paso, escribe el mensaje o moraleja que quieres que deje la historia.</li>
            <li>🔔 Al final, la IA generará un cuento navideño usando todas tus respuestas.</li>
          </ul>
          <p className="instr-footer">
            ¡Listo! Papá Noel y sus duendes usarán tus ideas para crear un cuento único para ti. 🎄
          </p>
          </div>
        </div>
      </section>

      {/* TALLER - FORMULARIO */}
      <section className="landing-section">
          <div className="taller-santa">
            <div className="taller-inner" id="tallerFormulario">
              <div className="taller-inner-content">
                <div className="taller-left">
              <p className="taller-pill">Taller mágico de Santa 🎄</p>
              <h1 className="taller-title">Crea tu historia navideña con IA</h1>
              <p className="taller-subtitle">
                Completa estos pasos como si le contaras los detalles a Papá Noel en su taller. Al final, la IA armará el cuento por ti.
              </p>

              {/* PROGRESO */}
              <div className="pasos-header">
                <div className="pasos-top">
                  <span className="paso-indicador">{stepLabels[currentStep]}</span>
                  <div className="pasos-badges">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className={`paso-badge ${
                          num - 1 === currentStep
                            ? "activo"
                            : num - 1 < currentStep
                            ? "completado"
                            : ""
                        }`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pasos-barra">
                  <div className="pasos-barra-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              {/* FORMULARIO */}
              <form className="taller-form" onSubmit={(e) => e.preventDefault()}>
                {/* PASO 1 */}
                {currentStep === 0 && (
                  <div className="paso-form activo">
                    <div className="field-group">
                      <label className="field-label">Nombre del protagonista *</label>
                      <input
                        type="text"
                        className="field-input"
                        value={formData.nombre}
                        onChange={(e) => updateFormData("nombre", e.target.value)}
                        placeholder="Ej: Lucía, Mateo, Valentina, tu nombre…"
                      />
                    </div>

                    <div className="field-row">
                      <div className="field-group">
                        <label className="field-label">Edad aproximada *</label>
                        <select
                          className="field-input"
                          value={formData.edad}
                          onChange={(e) => updateFormData("edad", e.target.value)}
                        >
                          <option value="">Seleccionar</option>
                          <option>4 - 6 años</option>
                          <option>7 - 9 años</option>
                          <option>10 - 12 años</option>
                          <option>13 años o más</option>
                        </select>
                      </div>

                      <div className="field-group">
                        <label className="field-label">¿Cómo se relaciona con Santa? *</label>
                        <select
                          className="field-input"
                          value={formData.relacion}
                          onChange={(e) => updateFormData("relacion", e.target.value)}
                        >
                          <option value="">Seleccionar</option>
                          <option>Niño/niña que espera regalos</option>
                          <option>Ayudante del taller</option>
                          <option>Explorador del Polo Norte</option>
                          <option>Amigo de los duendes</option>
                        </select>
                      </div>
                    </div>

                    <div className="field-group">
                      <label className="field-label">Tipo de historia que quieres *</label>
                      <select
                        className="field-input"
                        value={formData.tipo}
                        onChange={(e) => updateFormData("tipo", e.target.value)}
                      >
                        <option value="">Seleccionar</option>
                        <option>Aventura mágica</option>
                        <option>Cuento tierno para dormir</option>
                        <option>Historia divertida y cómica</option>
                        <option>Misterio navideño suave</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* PASO 2 */}
                {currentStep === 1 && (
                  <div className="paso-form activo">
                    <div className="field-group">
                      <label className="field-label">¿Dónde ocurre la historia? *</label>
                      <input
                        type="text"
                        className="field-input"
                        value={formData.escenario}
                        onChange={(e) => updateFormData("escenario", e.target.value)}
                        placeholder="Ej: taller de Santa, pueblo nevado, bosque mágico, tu casa en Navidad…"
                      />
                    </div>

                    <div className="field-group">
                      <label className="field-label">Personajes secundarios importantes *</label>
                      <input
                        type="text"
                        className="field-input"
                        value={formData.personajes}
                        onChange={(e) => updateFormData("personajes", e.target.value)}
                        placeholder="Ej: un reno tímido, un muñeco de nieve que habla…"
                      />
                    </div>

                    <div className="field-row">
                      <div className="field-group">
                        <label className="field-label">Nivel de magia *</label>
                        <div className="chips-group">
                          <button
                            type="button"
                            className={`chip-option chip-nivel ${formData.nivelMagia === "Suave" ? "chip-selected" : ""}`}
                            onClick={() => selectChip("nivelMagia", "Suave")}
                          >
                            Suave ✨
                          </button>
                          <button
                            type="button"
                            className={`chip-option chip-nivel ${formData.nivelMagia === "Mágico" ? "chip-selected" : ""}`}
                            onClick={() => selectChip("nivelMagia", "Mágico")}
                          >
                            Mágico ⭐
                          </button>
                          <button
                            type="button"
                            className={`chip-option chip-nivel ${formData.nivelMagia === "Muy mágico" ? "chip-selected" : ""}`}
                            onClick={() => selectChip("nivelMagia", "Muy mágico")}
                          >
                            ¡Muy mágico! 🌟
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* PASO 3 */}
                {currentStep === 2 && (
                  <div className="paso-form activo">
                    <div className="field-group">
                      <label className="field-label">¿Qué mensaje o moraleja quieres que deje la historia? *</label>
                      <textarea
                        className="field-input field-textarea"
                        value={formData.mensaje}
                        onChange={(e) => updateFormData("mensaje", e.target.value)}
                        rows="4"
                        placeholder="Ej: la importancia de compartir, valorar a la familia…"
                      ></textarea>
                    </div>

                    <div className="field-group">
                      <label className="field-label">¿Detalle especial?</label>
                      <textarea
                        className="field-input field-textarea"
                        value={formData.extra}
                        onChange={(e) => updateFormData("extra", e.target.value)}
                        rows="3"
                        placeholder="Ej: que aparezca tu mascota…"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* CONTROLES */}
                <div className="pasos-controles">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      className="btn-secundario"
                      onClick={handlePrevious}
                      style={{ display: currentStep > 0 ? "inline-flex" : "none" }}
                    >
                      Anterior
                    </button>
                  )}
                  {currentStep < totalSteps - 1 ? (
                    <button
                      type="button"
                      className="taller-btn-primary"
                      onClick={handleNext}
                      style={{ display: currentStep < totalSteps - 1 ? "inline-flex" : "none" }}
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="taller-btn-primary"
                      onClick={handleGenerate}
                      style={{ display: currentStep === totalSteps - 1 ? "inline-flex" : "none" }}
                    >
                      Generar historia con IA
                    </button>
                  )}
                </div>
              </form>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* FOOTER */}
      <Footer
        onNavigateToLanding={onNavigateToLanding}
        onNavigateToChat={onNavigateToChat}
        onNavigateToCreateHistory={onNavigateToCreateHistory}
        onNavigateToAddInfo={onNavigateToAddInfo}
        onNavigateToAboutUs={onNavigateToAboutUs}
      />

      {/* SCROLL TO TOP */}
      <ScrollToTop variant="primary" position="bottom-right" />
    </div>
  );
}
