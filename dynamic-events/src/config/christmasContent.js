/**
 * Contenido de Navidad - Historias y Temas
 * Este archivo contiene todas las historias y temas específicos de Navidad
 * que pueden ser importados en diferentes componentes
 */

// Historia destacada del hero
export const featuredStory = {
  id: 'carta-perdida',
  title: "La Carta Perdida de Navidad",
  icon: "📮",
  story: "En una pequeña ciudad nevada, una joven llamada Elena encontró una carta que nunca llegó a Papá Noel. Era una carta antigua, amarillenta por el tiempo, con una dirección borrosa que apenas podía leerse. Elena, con un corazón lleno de curiosidad y bondad, decidió emprender un viaje mágico antes de que terminara la noche de Navidad. Siguió las pistas que la carta guardaba entre sus pliegues: un copo de nieve especial, un fragmento de campanilla y un pequeño trozo de papel con coordenadas misteriosas. Con la ayuda de sus amigos y un poco de magia navideña, Elena logró encontrar al destinatario original de la carta: un anciano que había perdido la esperanza años atrás. Cuando leyó la carta, sus ojos brillaron con lágrimas de alegría. La carta perdida trajo de vuelta la magia a su corazón y a toda la comunidad. Elena aprendió que nunca es tarde para hacer llegar un mensaje de amor, y que la Navidad tiene el poder de conectar almas perdidas a través del tiempo."
};

// Historias para las cards originales
export const originalStories = [
  {
    id: 'carta-tarde',
    title: "La carta que llegó tarde",
    icon: "📮",
    story: "En una pequeña ciudad nevada, una niña llamada Sofía escribió una carta especial a Papá Noel pidiendo un regalo para su abuela enferma. Sin embargo, la carta se perdió en una tormenta de nieve y llegó al Polo Norte demasiado tarde, justo cuando Santa ya había partido. Un elfo mensajero llamado Pip descubrió la carta y, conmovido por el pedido de Sofía, decidió ayudar. Con la ayuda de los renos más veloces y un poco de magia navideña, logró alcanzar a Santa en pleno vuelo. Santa, emocionado por la bondad de Sofía, preparó un regalo especial: una manta tejida con hilos de esperanza que ayudaría a la abuela a sentirse mejor. La carta que llegó tarde se convirtió en el regalo más importante de esa Navidad, recordando a todos que nunca es tarde para la bondad y el amor."
  },
  {
    id: 'arbol-luces',
    title: "El árbol sin luces",
    icon: "🎄",
    story: "En el centro del pueblo había un árbol de Navidad gigante que cada año se iluminaba con miles de luces de colores. Pero ese año, una tormenta eléctrica había dañado todas las luces y no había tiempo para reemplazarlas antes de la víspera de Navidad. Los niños del pueblo estaban tristes, especialmente Mateo, quien amaba ver el árbol brillante. Decidió pedirle ayuda a sus amigos y juntos crearon luces caseras con frascos, velas y papel de colores. Cada familia del pueblo contribuyó con su propia creación. Cuando llegó la noche de Navidad, el árbol brillaba con una luz cálida y especial que nunca antes habían visto. El árbol sin luces se convirtió en el más hermoso de todos, iluminado por la creatividad y el trabajo en equipo de toda la comunidad."
  },
  {
    id: 'reno-timido',
    title: "El reno tímido",
    icon: "🦌",
    story: "Blitzen era un reno joven y muy tímido que soñaba con volar junto al trineo de Santa, pero tenía miedo de hablar con los otros renos. Cada Navidad, observaba desde lejos cómo los renos principales despegaban mientras él se quedaba en el establo. Una noche, una estrella fugaz cayó cerca y Blitzen la siguió hasta un claro mágico donde conoció a un sabio reno anciano. El anciano le enseñó que el coraje no es la ausencia de miedo, sino actuar a pesar de él. Con esta lección, Blitzen regresó y le pidió a Santa una oportunidad. En la víspera de Navidad, cuando uno de los renos principales se resfrió, Blitzen se ofreció a tomar su lugar. Guió al trineo con valentía y determinación, superando su timidez y convirtiéndose en uno de los renos más confiables del equipo de Santa."
  }
];

// Temas disponibles para las historias
export const themes = [
  {
    id: 1,
    title: "Un regalo especial",
    icon: "🎁",
    color: "green",
    description: "Un elfo que perdió un regalo importante",
    story: "En el taller del Polo Norte, el elfo Timmy había perdido el regalo más importante de la temporada: un osito de peluche mágico que podía hablar y contar historias. Este regalo estaba destinado a una niña llamada Emma, quien había pedido un amigo que nunca la dejara sola. Timmy buscó por todo el taller, entre cajas y papeles de regalo, pero no lo encontró. Con lágrimas en sus ojos, decidió pedirle ayuda a sus amigos elfos. Juntos, buscaron en cada rincón hasta que finalmente lo encontraron en el trineo de Santa, quien lo había guardado porque sabía lo especial que era. Emma recibió su regalo en Navidad y nunca estuvo sola de nuevo.",
    image: "/images/theme-gift.png"
  },
  {
    id: 2,
    title: "El árbol mágico",
    icon: "🎄",
    color: "brown",
    description: "Una estrella mágica que guía a los duendes",
    story: "En lo alto del árbol de Navidad del Polo Norte brillaba una estrella especial. Esta estrella no era como las demás; tenía el poder de guiar a los duendes cuando se perdían en la noche nevada. Una noche, tres duendes jóvenes salieron a buscar piñas para decorar, pero una tormenta de nieve los desorientó. La estrella comenzó a brillar más fuerte que nunca, creando un camino de luz dorada que los guió de regreso a casa. Desde entonces, los duendes siempre miraban la estrella antes de salir, sabiendo que ella los protegería. La estrella se convirtió en el símbolo de esperanza del Polo Norte.",
    image: "/images/theme-tree.png"
  },
  {
    id: 3,
    title: "Leyenda de nieve",
    icon: "⛄",
    color: "red",
    description: "Un pueblo sin nieve en víspera de Navidad",
    story: "El pueblo de Villa Esperanza nunca había pasado una Navidad sin nieve, pero ese año el clima había cambiado. Los niños estaban tristes porque no podrían hacer muñecos de nieve ni tener una blanca Navidad. La pequeña Luna decidió escribirle a Santa pidiéndole, no juguetes, sino nieve para su pueblo. Santa leyó la carta y se conmovió tanto que pidió ayuda a Jack Frost, el espíritu del invierno. Juntos crearon una tormenta mágica que cubrió el pueblo con la nieve más brillante que habían visto. Los niños despertaron en Navidad con un paisaje blanco y mágico, y Luna aprendió que la generosidad es el mejor regalo.",
    image: "/images/theme-snowman.png"
  },
  {
    id: 4,
    title: "El reno valiente",
    icon: "🦌",
    color: "green",
    description: "Un reno que quiere volar por primera vez",
    story: "Rudolph era un reno joven que soñaba con volar junto al trineo de Santa, pero tenía miedo de las alturas. Cada Navidad, veía a los otros renos despegar mientras él se quedaba en el suelo. Una noche, una estrella fugaz cayó cerca del establo y Rudolph la siguió. La estrella lo llevó a un lugar mágico donde conoció a un sabio reno anciano que le enseñó que el coraje no es la ausencia de miedo, sino actuar a pesar de él. Con esta lección, Rudolph regresó y le pidió a Santa una oportunidad. En la víspera de Navidad, Rudolph guió al trineo con su nariz brillante, superando su miedo y convirtiéndose en el reno más valiente del Polo Norte.",
    image: null
  },
  {
    id: 5,
    title: "La carta perdida",
    icon: "📮",
    color: "brown",
    description: "Una carta que llega tarde al Polo Norte",
    story: "En el último día antes de Navidad, una carta especial se perdió en una tormenta de nieve. Era la carta de un niño llamado Leo, quien pedía un regalo para su abuela enferma. La carta viajó por el viento hasta llegar a las manos de un elfo mensajero que se había quedado dormido. Cuando despertó y vio la fecha, supo que tenía que actuar rápido. Con la ayuda de los renos más veloces y la magia de Santa, la carta llegó justo a tiempo. Santa leyó el pedido de Leo y se emocionó tanto que preparó un regalo especial: una manta tejida con hilos de esperanza que ayudaría a la abuela a sentirse mejor. Leo y su abuela pasaron la Navidad más cálida de sus vidas.",
    image: null
  },
  {
    id: 6,
    title: "El juguete mágico",
    icon: "🧸",
    color: "red",
    description: "Un juguete que cobra vida en la noche de Navidad",
    story: "En el taller de juguetes, había un osito de peluche llamado Teddy que anhelaba tener un dueño. Cada noche, miraba cómo otros juguetes eran elegidos, pero él siempre se quedaba. En la víspera de Navidad, una magia especial recorrió el taller y Teddy cobró vida. Decidió buscar a un niño que lo necesitara. Viajó por la nieve hasta encontrar una casa donde un pequeño llamado Tomás estaba triste porque sus padres no podían comprar regalos. Teddy se presentó y le dijo que él sería su mejor amigo. A la mañana siguiente, Tomás encontró a Teddy bajo el árbol y supo que la Navidad había traído algo más valioso que cualquier juguete: un amigo verdadero.",
    image: null
  },
  {
    id: 7,
    title: "El taller secreto",
    icon: "🔨",
    color: "green",
    description: "Un niño que desea conocer el taller de Santa",
    story: "Mateo era un niño curioso que siempre había querido ver el taller de Santa. Escribió una carta especial pidiendo visitar el Polo Norte. Santa, conmovido por su entusiasmo, le concedió el deseo de manera mágica. Una noche, Mateo se despertó en el taller más increíble que había visto: elfos trabajando, renos relinchando y juguetes por todas partes. Pasó el día ayudando a los elfos y aprendiendo el valor del trabajo en equipo. Antes de regresar, Santa le dio un pequeño martillo mágico como recuerdo. Mateo despertó en su cama con el martillo en sus manos, sabiendo que había vivido una aventura real. Desde entonces, siempre creyó en la magia de Navidad.",
    image: null
  },
  {
    id: 8,
    title: "La campana de la esperanza",
    icon: "🔔",
    color: "brown",
    description: "Una campana que suena solo para corazones puros",
    story: "En la cima del árbol de Navidad del pueblo había una campana antigua que solo sonaba cuando alguien con un corazón puro la tocaba. Nadie la había escuchado en años, hasta que una niña llamada Sofía, que siempre ayudaba a los demás sin esperar nada a cambio, pasó por allí. Cuando Sofía extendió su mano hacia la campana, esta comenzó a sonar con una melodía mágica que llenó el pueblo de alegría. El sonido atrajo a Santa, quien había estado buscando a alguien especial para entregar un regalo muy importante: la capacidad de hacer felices a los demás. Desde ese día, Sofía se convirtió en la portadora de la magia navideña, y la campana siempre sonaba cuando ella estaba cerca, recordando a todos que la bondad es el verdadero espíritu de Navidad.",
    image: null
  }
];

// Metadatos adicionales para las historias originales
export const originalStoriesMetadata = {
  'carta-tarde': {
    genre: "Fantasía navideña",
    year: "2024",
    author: "Dynamic Events",
    pexelsImage: "https://images.pexels.com/photos/257909/pexels-photo-257909.jpeg?auto=compress&cs=tinysrgb&w=1200"
  },
  'arbol-luces': {
    genre: "Aventura familiar",
    year: "2023",
    author: "Taller de Historias",
    pexelsImage: "https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=1200"
  },
  'reno-timido': {
    genre: "Cuento infantil",
    year: "2022",
    author: "Dynamic Events",
    pexelsImage: "https://images.pexels.com/photos/1661907/pexels-photo-1661907.jpeg?auto=compress&cs=tinysrgb&w=1200"
  }
};

// Metadatos para los temas
export const themesMetadata = {
  1: { genre: "Fantasía navideña", year: "2024", author: "Dynamic Events", pexelsImage: "https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  2: { genre: "Aventura mágica", year: "2024", author: "Dynamic Events", pexelsImage: "https://images.pexels.com/photos/1661907/pexels-photo-1661907.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  3: { genre: "Cuento navideño", year: "2024", author: "Dynamic Events", pexelsImage: "https://images.pexels.com/photos/257909/pexels-photo-257909.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  4: { genre: "Aventura de superación", year: "2023", author: "Taller de Historias", pexelsImage: "https://images.pexels.com/photos/1303098/pexels-photo-1303098.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  5: { genre: "Drama navideño", year: "2023", author: "Dynamic Events", pexelsImage: "https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  6: { genre: "Cuento infantil", year: "2024", author: "Dynamic Events", pexelsImage: "https://images.pexels.com/photos/1661907/pexels-photo-1661907.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  7: { genre: "Aventura familiar", year: "2023", author: "Taller de Historias", pexelsImage: "https://images.pexels.com/photos/257909/pexels-photo-257909.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  8: { genre: "Fantasía espiritual", year: "2024", author: "Dynamic Events", pexelsImage: "https://images.pexels.com/photos/1303098/pexels-photo-1303098.jpeg?auto=compress&cs=tinysrgb&w=1200" }
};
