import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Header } from "./base/Header";
import { ScrollToTop } from "./base/ScrollToTop";
import { Footer } from "./base/Footer";
import "../styles/variables.css";
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

      <section className={`hero hero--index-${currentTheme} hero--red-page create-history-hero`}>
        <div className="hero-overlay"></div>
        <div className="hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">
              {currentTheme === 'christmas' ? 'Taller de Santa' :
                currentTheme === 'halloween' ? 'Laboratorio de Historias de Terror' :
                  'Aventuras de Verano'}
            </h1>
            <p className="hero-synopsis">
              {currentTheme === 'christmas'
                ? 'En este espacio puedes crear tu historia con un poco de magia e inteligencia artificial'
                : currentTheme === 'halloween'
                  ? 'Crea historias espeluznantes con ayuda de la inteligencia artificial'
                  : 'Diseña tus propias aventuras veraniegas con ayuda de la inteligencia artificial'}
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE INSTRUCCIONES */}
      <section className="landing-section">
        <div className="instrucciones-santa">
          <div className="instrucciones-container">
            <h2 className="instr-title">
              {currentTheme === 'christmas' ? '🎅 Instrucciones para crear tu historia navideña' :
                currentTheme === 'halloween' ? '👻 Instrucciones para crear tu historia de terror' :
                  '🏖️ Instrucciones para crear tu aventura de verano'}
            </h2>
            <p className="instr-text">
              {currentTheme === 'christmas'
                ? 'Antes de entrar al Taller Mágico de Santa, sigue estas indicaciones para que la IA pueda crear un cuento especial:'
                : currentTheme === 'halloween'
                  ? 'Antes de comenzar, sigue estas indicaciones para que la IA pueda crear una historia de terror personalizada:'
                  : 'Antes de comenzar tu aventura, sigue estas indicaciones para que la IA pueda crear una historia personalizada:'}
            </p>
            <ul className="instr-list">
              <li>📝 Completa todos los campos de cada paso, son obligatorios.</li>
              {currentTheme === 'christmas' && (
                <>
                  <li>🎄 El protagonista puede ser tú, un familiar o un personaje inventado.</li>
                  <li>✨ Elige el nivel de magia y el tipo de historia para definir el estilo del cuento.</li>
                  <li>📍 Describe con detalle el escenario y los personajes secundarios.</li>
                  <li>🎁 En el último paso, escribe el mensaje o moraleja que quieres que deje la historia.</li>
                  <li>🔔 Al final, la IA generará un cuento navideño usando todas tus respuestas.</li>
                </>
              )}
              {currentTheme === 'halloween' && (
                <>
                  <li>👻 El protagonista puede ser tú, un cazafantasmas o un personaje valiente.</li>
                  <li>🕯️ Elige el nivel de miedo y el tipo de historia que prefieras.</li>
                  <li>🏚️ Describe con detalle el lugar embrujado y los personajes sobrenaturales.</li>
                  <li>💀 En el último paso, escribe qué enseñanza debe dejar tu historia de terror.</li>
                  <li>🔮 La IA usará tus respuestas para crear una historia espeluznante.</li>
                </>
              )}
              {currentTheme === 'vacation' && (
                <>
                  <li>🌞 El protagonista puede ser tú, un amigo o un aventurero intrépido.</li>
                  <li>🌊 Elige el tipo de aventura y el nivel de emoción que prefieras.</li>
                  <li>🏝️ Describe con detalle el lugar paradisíaco y los personajes que encontrarás.</li>
                  <li>🌴 En el último paso, escribe qué aprendizaje debe dejar tu aventura.</li>
                  <li>⛵ La IA creará una historia llena de diversión usando tus respuestas.</li>
                </>
              )}
            </ul>
            <p className="instr-footer">
              {currentTheme === 'christmas'
                ? '¡Listo! Papá Noel y sus duendes usarán tus ideas para crear un cuento único para ti. 🎄'
                : currentTheme === 'halloween'
                  ? '¡Listo! Los espíritus de la noche usarán tus ideas para crear una historia que te pondrá los pelos de punta. 👻'
                  : '¡Listo! El sol, la arena y el mar inspirarán una aventura inolvidable para ti. 🌊'}
            </p>
          </div>
        </div>
      </section>

      {/* TALLER - FORMULARIO */}
      <section className="landing-section">
        <div className={`taller-${currentTheme === 'christmas' ? 'santa' : currentTheme === 'halloween' ? 'halloween' : 'vacation'}`}>
          <div className="taller-inner" id="tallerFormulario">
            <div className="taller-inner-content">
              <div className="taller-left">
                <p className="taller-pill">
                  {currentTheme === 'christmas' ? 'Taller mágico de Santa 🎄' :
                    currentTheme === 'halloween' ? 'Laboratorio de Terror 🦇' :
                      'Aventuras al Aire Libre 🌞'}
                </p>
                <h1 className="taller-title">
                  {currentTheme === 'christmas' ? 'Crea tu historia navideña con IA' :
                    currentTheme === 'halloween' ? 'Crea tu historia de terror con IA' :
                      'Crea tu aventura de verano con IA'}
                </h1>
                <p className="taller-subtitle">
                  {currentTheme === 'christmas'
                    ? 'Completa estos pasos como si le contaras los detalles a Papá Noel en su taller. Al final, la IA armará el cuento por ti.'
                    : currentTheme === 'halloween'
                      ? 'Completa estos pasos para crear una historia de terror personalizada. La IA usará tus respuestas para generar una experiencia espeluznante.'
                      : 'Completa estos pasos para diseñar tu propia aventura de verano. La IA creará una historia única basada en tus respuestas.'}
                </p>

                {/* PROGRESO */}
                <div className="pasos-header">
                  <div className="pasos-top">
                    <span className="paso-indicador">{stepLabels[currentStep]}</span>
                    <div className="pasos-badges">
                      {[1, 2, 3].map((num) => (
                        <div
                          key={num}
                          className={`paso-badge ${num - 1 === currentStep
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
                          placeholder={currentTheme === 'christmas'
                            ? "Ej: Lucía, Mateo, Valentina, tu nombre…"
                            : currentTheme === 'halloween'
                              ? "Ej: Drácula, Luna, Bruno, tu nombre…"
                              : "Ej: Sofía, Diego, tu nombre…"}
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
                          <label className="field-label">
                            {currentTheme === 'christmas'
                              ? "¿Cómo se relaciona con Santa? *"
                              : currentTheme === 'halloween'
                                ? "¿Rol en la historia? *"
                                : "Tipo de aventurero *"}
                          </label>
                          <select
                            className="field-input"
                            value={formData.relacion}
                            onChange={(e) => updateFormData("relacion", e.target.value)}
                          >
                            <option value="">Seleccionar</option>
                            {currentTheme === 'christmas' ? (
                              <>
                                <option>Niño/niña que espera regalos</option>
                                <option>Ayudante del taller</option>
                                <option>Explorador del Polo Norte</option>
                                <option>Amigo de los duendes</option>
                              </>
                            ) : currentTheme === 'halloween' ? (
                              <>
                                <option>Cazador de fantasmas</option>
                                <option>Visitante del pueblo embrujado</option>
                                <option>Brujo/Bruja aprendiz</option>
                                <option>Inocente en peligro</option>
                              </>
                            ) : (
                              <>
                                <option>Explorador de playas</option>
                                <option>Aventurero de montaña</option>
                                <option>Viajero en búsqueda de tesoros</option>
                                <option>Turista curioso</option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="field-group">
                        <label className="field-label">
                          {currentTheme === 'christmas'
                            ? "Tipo de historia que quieres *"
                            : currentTheme === 'halloween'
                              ? "Tipo de historia de terror *"
                              : "Tipo de aventura *"}
                        </label>
                        <select
                          className="field-input"
                          value={formData.tipo}
                          onChange={(e) => updateFormData("tipo", e.target.value)}
                        >
                          <option value="">Seleccionar</option>
                          {currentTheme === 'christmas' ? (
                            <>
                              <option>Aventura mágica</option>
                              <option>Cuento tierno para dormir</option>
                              <option>Historia divertida y cómica</option>
                              <option>Misterio navideño suave</option>
                            </>
                          ) : currentTheme === 'halloween' ? (
                            <>
                              <option>Historia de fantasmas</option>
                              <option>Misterio sobrenatural</option>
                              <option>Aventura de monstruos</option>
                              <option>Suspenso psicológico</option>
                            </>
                          ) : (
                            <>
                              <option>Aventura en la playa</option>
                              <option>Exploración de isla desierta</option>
                              <option>Búsqueda del tesoro</option>
                              <option>Vacaciones inolvidables</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* PASO 2 */}
                  {currentStep === 1 && (
                    <div className="paso-form activo">
                      <div className="field-group">
                        <label className="field-label">
                          {currentTheme === 'christmas'
                            ? "¿Dónde ocurre la historia? *"
                            : currentTheme === 'halloween'
                              ? "¿En qué lugar embrujado ocurre? *"
                              : "¿Dónde ocurre la aventura? *"}
                        </label>
                        <input
                          type="text"
                          className="field-input"
                          value={formData.escenario}
                          onChange={(e) => updateFormData("escenario", e.target.value)}
                          placeholder={
                            currentTheme === 'christmas'
                              ? "Ej: taller de Santa, pueblo nevado, bosque mágico, tu casa en Navidad…"
                              : currentTheme === 'halloween'
                                ? "Ej: mansión embrujada, bosque oscuro, pueblo abandonado…"
                                : "Ej: playa paradisíaca, isla desierta, montañas nevadas…"
                          }
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label">
                          {currentTheme === 'christmas'
                            ? "Personajes secundarios importantes *"
                            : currentTheme === 'halloween'
                              ? "Criaturas o personajes sobrenaturales *"
                              : "Personajes que acompañan *"}
                        </label>
                        <input
                          type="text"
                          className="field-input"
                          value={formData.personajes}
                          onChange={(e) => updateFormData("personajes", e.target.value)}
                          placeholder={
                            currentTheme === 'christmas'
                              ? "Ej: un reno tímido, un muñeco de nieve que habla…"
                              : currentTheme === 'halloween'
                                ? "Ej: un fantasma amistoso, un gato negro, un esqueleto bailarín…"
                                : "Ej: un delfín juguetón, un viejo marinero, un loro parlanchín…"
                          }
                        />
                      </div>

                      <div className="field-row">
                        <div className="field-group">
                          <label className="field-label">
                            {currentTheme === 'christmas'
                              ? "Nivel de magia *"
                              : currentTheme === 'halloween'
                                ? "Nivel de miedo *"
                                : "Nivel de aventura *"}
                          </label>
                          <div className="chips-group">
                            <button
                              type="button"
                              className={`chip-option chip-nivel ${formData.nivelMagia === "Suave" ? "chip-selected" : ""
                                }`}
                              onClick={() => selectChip("nivelMagia", "Suave")}
                            >
                              {currentTheme === 'christmas'
                                ? "Suave ✨"
                                : currentTheme === 'halloween'
                                  ? "Ligero 👻"
                                  : "Tranquilo 😌"}
                            </button>
                            <button
                              type="button"
                              className={`chip-option chip-nivel ${formData.nivelMagia === "Mágico" ? "chip-selected" : ""
                                }`}
                              onClick={() => selectChip("nivelMagia", "Mágico")}
                            >
                              {currentTheme === 'christmas'
                                ? "Mágico ⭐"
                                : currentTheme === 'halloween'
                                  ? "Intenso 😱"
                                  : "Emocionante 🤩"}
                            </button>
                            <button
                              type="button"
                              className={`chip-option chip-nivel ${formData.nivelMagia === "Muy mágico" ? "chip-selected" : ""
                                }`}
                              onClick={() => selectChip("nivelMagia", "Muy mágico")}
                            >
                              {currentTheme === 'christmas'
                                ? "¡Muy mágico! 🌟"
                                : currentTheme === 'halloween'
                                  ? "¡Aterrador! 💀"
                                  : "¡Extremo! 🚀"}
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
                        <label className="field-label">
                          {currentTheme === 'christmas'
                            ? "¿Qué mensaje o moraleja quieres que deje la historia? *"
                            : currentTheme === 'halloween'
                              ? "¿Qué enseñanza debe dejar tu historia de terror? *"
                              : "¿Qué aprendizaje debe dejar tu aventura? *"}
                        </label>
                        <textarea
                          className="field-input field-textarea"
                          value={formData.mensaje}
                          onChange={(e) => updateFormData("mensaje", e.target.value)}
                          rows="4"
                          placeholder={
                            currentTheme === 'christmas'
                              ? "Ej: la importancia de compartir, valorar a la familia…"
                              : currentTheme === 'halloween'
                                ? "Ej: superar los miedos, la importancia de la valentía…"
                                : "Ej: la amistad, el trabajo en equipo, explorar lo desconocido…"
                          }
                        ></textarea>
                      </div>

                      <div className="field-group">
                        <label className="field-label">
                          {currentTheme === 'christmas'
                            ? "¿Detalle especial?"
                            : currentTheme === 'halloween'
                              ? "¿Algo más que quieras incluir?"
                              : "¿Algún detalle adicional?"}
                        </label>
                        <textarea
                          className="field-input field-textarea"
                          value={formData.extra}
                          onChange={(e) => updateFormData("extra", e.target.value)}
                          rows="3"
                          placeholder={
                            currentTheme === 'christmas'
                              ? "Ej: que aparezca tu mascota…"
                              : currentTheme === 'halloween'
                                ? "Ej: un objeto mágico, un hechizo especial…"
                                : "Ej: un objeto especial, un lugar secreto…"
                          }
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
                        className="btn btn--primary btn--md taller-btn-primary"
                        onClick={handleNext}
                        style={{ display: currentStep < totalSteps - 1 ? "inline-flex" : "none" }}
                      >
                        Siguiente
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn--primary btn--md taller-btn-primary"
                        onClick={handleGenerate}
                        style={{ display: currentStep === totalSteps - 1 ? "inline-flex" : "none" }}
                      >
                        {currentTheme === 'christmas'
                          ? "Generar cuento navideño"
                          : currentTheme === 'halloween'
                            ? "Crear historia de terror"
                            : "Crear aventura de verano"}
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
