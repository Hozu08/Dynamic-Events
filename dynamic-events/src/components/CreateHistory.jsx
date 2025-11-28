import { useState } from "react";
import { Header } from "./base/Header";
import { Dropdown } from "./base/Dropdown";
import { ScrollToTop } from "./base/ScrollToTop";
import "../styles/ChristmasLanding.css";
import "../styles/CreateHistory.css";
import "../styles/base/utilities.css";

/**
 * CreateHistory - Página para crear historias navideñas con IA mediante formulario por pasos
 * 
 * @param {Object} props
 * @param {Function} props.onNavigateToLanding - Callback para volver a la landing
 * @param {Function} props.onNavigateToGame - Callback para navegar al juego
 * @param {Object} props.selectedTheme - Tema seleccionado (opcional) para precargar datos
 */
export function CreateHistory({ onNavigateToLanding, onNavigateToGame, selectedTheme = null }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    relacion: "",
    tipo: "",
    escenario: "",
    personajes: "",
    nivelMagia: "Mágico",
    duracion: "Corta",
    mensaje: "",
    extra: ""
  });

  const [showResult, setShowResult] = useState(false);
  const [generatedStory, setGeneratedStory] = useState({ title: "", meta: "", text: "" });

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
    } else if (group === "duracion") {
      updateFormData("duracion", value);
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

  // Construir historia
  const buildStory = () => {
    const { nombre, edad, relacion, tipo, escenario, personajes, nivelMagia, duracion, mensaje, extra } = formData;
    
    const storyText = `En una noche especial de Navidad, ${nombre} (${edad}) se encontraba en ${escenario}. 
Mientras el mundo se preparaba para las fiestas, ${nombre} vivía una historia de tipo "${tipo}" junto a ${personajes}.

Gracias a un nivel de magia ${nivelMagia.toLowerCase()}, cada detalle parecía brillar: las luces, la nieve y hasta los susurros del viento que llegaban desde el taller de Santa.

A lo largo de esta aventura, ${nombre} descubrirá que ${mensaje.trim()}.

${extra ? "Además, algo muy especial sucede: " + extra.trim() + "\n\n" : ""}Cuando la noche termine, esta experiencia quedará guardada en el corazón de ${nombre} como uno de los recuerdos más mágicos de toda su vida navideña.`;

    return {
      title: `La aventura navideña de ${nombre}`,
      meta: `${tipo} · ${duracion} · Nivel de magia: ${nivelMagia}`,
      text: storyText
    };
  };

  // Generar historia
  const handleGenerate = () => {
    if (!validateStep(currentStep)) return;
    const story = buildStory();
    setGeneratedStory(story);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Volver a editar
  const handleBackToEdit = () => {
    setShowResult(false);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Copiar historia
  const handleCopy = async () => {
    const fullText = `${generatedStory.title}\n\n${generatedStory.meta}\n\n${generatedStory.text}`;
    try {
      await navigator.clipboard.writeText(fullText);
      alert("¡Historia copiada al portapapeles!");
    } catch (err) {
      console.error("Error al copiar:", err);
      alert("Error al copiar. Por favor, selecciona y copia manualmente.");
    }
  };

  // Calcular progreso
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="christmas-landing">
      {/* HEADER */}
      <Header
        logo="Dynamic Events"
        className="christmas-header"
        sticky
        variant="light"
        onLogoClick={onNavigateToLanding}
      >
        <a href="#historia-actual" className="nav-link" onClick={(e) => { e.preventDefault(); }}>
          Minijuegos
        </a>
        <a href="#" className="nav-link nav-link--active" onClick={(e) => { e.preventDefault(); }}>
          Crear historia IA
        </a>
        <Dropdown
          label="Escoger época"
          variant="pill"
          size="md"
          position="bottom-left"
          items={[
            {
              label: "Halloween",
              icon: "🎃",
              onClick: () => {
                console.log("Navegar a Halloween");
              },
            },
            {
              label: "Navidad",
              icon: "🎄",
              onClick: () => {
                onNavigateToLanding();
              },
            },
            {
              label: "Vacaciones",
              icon: "🏖️",
              onClick: () => {
                console.log("Navegar a Vacaciones");
              },
            },
          ]}
        />
      </Header>

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
      {!showResult && (
        <section className="landing-section">
          <div className="taller-santa">
          <div className="taller-inner" id="tallerFormulario">
            <div className="luces-navidad"></div>
            <img 
              src="https://i.imgur.com/ym8e7uO.png" 
              className="duende-animado" 
              alt="Duende del taller de Santa" 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

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

                      <div className="field-group">
                        <label className="field-label">Duración de la historia *</label>
                        <div className="chips-group">
                          <button
                            type="button"
                            className={`chip-option chip-duracion ${formData.duracion === "Corta" ? "chip-selected" : ""}`}
                            onClick={() => selectChip("duracion", "Corta")}
                          >
                            Corta
                          </button>
                          <button
                            type="button"
                            className={`chip-option chip-duracion ${formData.duracion === "Mediana" ? "chip-selected" : ""}`}
                            onClick={() => selectChip("duracion", "Mediana")}
                          >
                            Mediana
                          </button>
                          <button
                            type="button"
                            className={`chip-option chip-duracion ${formData.duracion === "Larga" ? "chip-selected" : ""}`}
                            onClick={() => selectChip("duracion", "Larga")}
                          >
                            Larga
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
      </section>
      )}

      {/* RESULTADO */}
      {showResult && (
        <section className="landing-section" id="resultadoHistoria">
          <div className="resultado-historia">
          <div className="resultado-carta">
            <p className="resultado-etiqueta">Historia generada con IA 🎄</p>
            <h2 className="resultado-titulo">{generatedStory.title}</h2>
            <p className="resultado-meta">{generatedStory.meta}</p>
            <div className="resultado-texto">{generatedStory.text}</div>

            <div className="resultado-controles">
              <button
                type="button"
                className="btn-secundario"
                onClick={handleBackToEdit}
              >
                Volver a editar
              </button>
              <button
                type="button"
                className="taller-btn-primary"
                onClick={handleCopy}
              >
                Descargar / copiar
              </button>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>Navegación</h3>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToLanding(); }}>Inicio</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToLanding(); }}>Cambiar época</a>
            <a href="#historia-actual" onClick={(e) => { e.preventDefault(); }}>Minijuegos</a>
            <a href="#" onClick={(e) => { e.preventDefault(); }}>Crear historias con IA</a>
          </div>

          <div className="footer-column">
            <h3>Información</h3>
            <a href="#">Políticas del sitio</a>
            <a href="#">Preguntas frecuentes</a>
            <a href="#">Instrucciones</a>
          </div>

          <div className="footer-column">
            <h3>Sobre la empresa</h3>
            <a href="#">Conócenos</a>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
          </div>
        </div>
      </footer>

      {/* SCROLL TO TOP */}
      <ScrollToTop variant="primary" position="bottom-right" />
    </div>
  );
}
