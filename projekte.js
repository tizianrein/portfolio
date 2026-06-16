const B="images/projects/";

const KAT={
  de:{umbau:"umbau",neubau:"neubau",forschung:"forschung"},
  en:{umbau:"renovation",neubau:"new build",forschung:"research"}
};

const UI={
  de:{alle:"alle",info:"info",claim:"büro für",
      worte:["umbau","neubau","forschung","reparatur"],
      banner:" büro für umbau, neubau und forschung ", orte:"münchen <i>●</i> bad honnef"},
  en:{alle:"all",info:"info",claim:"studio for",
      worte:["renovation","new build","research","repair"],
      banner:" studio for renovation, new build and research ", orte:"munich <i>●</i> bad honnef"}
};

/* Meta-Schlüssel werden je Sprache beschriftet */
const METAKEYS={
  de:{ort:"Ort",jahr:"Jahr",nutzung:"Nutzung",rolle:"Rolle",typ:"Typ",
      betreuung:"Betreuung",zusammen:"Zusammenarbeit",kontext:"Kontext",status:"Status",material:"Material"},
  en:{ort:"Place",jahr:"Year",nutzung:"Use",rolle:"Role",typ:"Type",
      betreuung:"Supervision",zusammen:"Collaboration",kontext:"Context",status:"Status",material:"Material"}
};

const P=[

 {n:"023",y:"2025–26",c:"umbau",
  t:{de:"separate wohneinheit",en:"detached apartment"},
  d:{de:"Umbau und Neuordnung eines freistehenden Wohnhauses in Bonn aus dem Jahr 1958. Der bestehende Grundriss wird überarbeitet, Bad und Küche werden neu angeordnet und an die heutige Nutzung angepasst. Durch das Abtrennen und den Ausbau der ehemaligen Waschküche und der Abstellräume entsteht im Untergeschoss eine eigenständige Wohneinheit mit separatem Eingang. Wenige, gezielte Eingriffe in den Bestand schaffen so eine zweite, vollwertige Wohnung, ohne den Charakter des Hauses zu überformen.",
     en:"Conversion and reorganisation of a detached house in Bonn dating from 1958. The existing floor plan is reworked, and the bathroom and kitchen are repositioned for contemporary use. By separating and fitting out the former laundry and storage rooms, a self-contained apartment with its own entrance is created on the lower floor. A few precise interventions in the existing fabric produce a second, fully functional dwelling without overwriting the character of the house."},
  meta:{de:{Ort:"Bonn",Jahr:"2025–2026",Bestand:"Freistehendes Wohnhaus, 1958",Nutzung:"Wohnen, Einliegerwohnung",Rolle:"Entwurf und Planung",Status:"In Ausführung"},
        en:{Place:"Bonn",Year:"2025–2026",Existing:"Detached house, 1958",Use:"Housing, secondary apartment",Role:"Design and planning",Status:"Under construction"}},
  pre:"Tizian-Rein-Separate-Wohneinheit-022.",
  imgs:["3.jpg","9.jpg","10.jpg","1.jpg","6.gif","11.jpg","8.jpg","5.jpg","4.jpg"]},

      {n:"022",y:"2024–25",c:"forschung",
  t:{de:"from structure to action",en:"from structure to action"},
  d:{de:"Diese Masterarbeit fragt, wie künstliche Intelligenz zur architektonischen Reparatur als systematischer und zugleich kreativer Entwurfspraxis beitragen kann. Sie entwickelt ein multimodales Framework, das unstrukturierte Informationen über ein beschädigtes Objekt [Fotos, Skizzen, Notizen, Messungen] in strukturierte, fabrizierbare Entwurfsentscheidungen überführt. Anhand zehn geretteter Stapelstühle wird gezeigt, wie menschliche Expertise und maschinelles Schließen zusammenwirken, um aus einem einzelnen Schadensfall eine situierte, herstellbare Reparaturantwort abzuleiten.",
     en:"This master's thesis asks how artificial intelligence can contribute to architectural repair as a practice that is both systematic and creative. It develops a multimodal framework that turns unstructured information about a damaged object [photographs, sketches, notes, measurements] into structured, fabricable design decisions. Working with ten salvaged stacking chairs, it shows how human expertise and machine reasoning can act together to derive a situated, buildable repair response from a single instance of damage."},
  meta:{de:{Kontext:"Masterthesis, Professur für Digitale Fabrikation, TU München",Jahr:"2025",Typ:"Forschung",Betreuung:"Prof. Kathrin Dörfler"},
        en:{Context:"Master's thesis, Professorship of Digital Fabrication, TU Munich",Year:"2025",Type:"Research",Supervision:"Prof. Kathrin Dörfler"}},
  pre:"Tizian-Rein-Master-Thesis-From-Structure-to-Action-023.",
  imgs:["2.jpg","23.jpg","26.jpg","22.jpg","27.jpg","29.jpg","20.jpg","21.jpg","14.jpg","4.jpg","3.jpg","8.jpg"]},

 {n:"021",y:"seit 2022",c:"umbau",
  t:{de:"waldfriedhofskapelle rhöndorf",en:"cemetery chapel"},
  d:{de:"Eine fortlaufende Forschungs- und künstlerisch-aktivistische Auseinandersetzung mit der Waldfriedhofskapelle in Rhöndorf, einem feinen Beispiel sakraler Nachkriegsarchitektur. Die Arbeit dokumentiert den Bau, ordnet ihn baugeschichtlich ein und macht seinen kulturellen Wert öffentlich sichtbar. 2024 wurde ein Abrissantrag der Stadtverwaltung nach öffentlicher Besorgnis und erneuter Diskussion über die Bedeutung des Bauwerks zurückgezogen. Ein Beleg dafür, wie sorgfältige Vermittlung den Erhalt eines bedrohten Gebäudes mittragen kann.",
     en:"An ongoing research and artistic-activist engagement with the woodland cemetery chapel in Rhöndorf, a fine example of post-war sacred architecture. The work documents the building, situates it within architectural history and makes its cultural value publicly visible. In 2024 a demolition proposal by the municipality was withdrawn after public concern and renewed debate about the building's significance. Evidence of how careful advocacy can help preserve a threatened structure."},
  meta:{de:{Ort:"Rhöndorf",Jahr:"seit 2022",Typ:"Bauwerkserhaltung, Vermittlung",Status:"Instandgesetzt"},
        en:{Place:"Rhöndorf",Year:"since 2022",Type:"Heritage, preservation",Status:"repaired"}},
  pre:"Tizian-Rein-Waldfriedhofskapelle-Rh%C3%B6ndorf-021.",
  imgs:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"]},

 {n:"020",y:"2022–23",c:"umbau",
  t:{de:"beamtenwohnung bonn",en:"civil servant's apartment"},
  d:{de:"Sanierung und Innenausbau einer Wohnung in einem Haus der Nachkriegszeit. Aus einem kompakten, in die Jahre gekommenen Grundriss werden mit wenigen, präzisen Eingriffen neue Beziehungen zwischen den Räumen geschaffen sowie zu Balkon und Garten. Oberflächen, Einbauten und Licht werden so überarbeitet, dass die ursprünglichen Qualitäten der Wohnung lesbar bleiben und zugleich ein zeitgemäßer Wohnkomfort entsteht.",
     en:"Renovation and interior fit-out of an apartment in a post-war building. From a compact, dated floor plan, a few precise interventions create new relationships between the rooms and towards the balcony and garden. Surfaces, built-in elements and light are reworked so that the apartment's original qualities remain legible while a contemporary level of comfort is achieved."},
  meta:{de:{Ort:"Bonn",Jahr:"2022–2023",Bestand:"Nachkriegsbau",Nutzung:"Wohnen",Rolle:"Entwurf und Innenausbau",Status:"Realisiert"},
        en:{Place:"Bonn",Year:"2022–2023",Existing:"Post-war building",Use:"Housing",Role:"Design and interior fit-out",Status:"Completed"}},
  pre:"Tizian-Rein-Wohnung-eines-Beamten-020.",
  imgs:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"]},

 {n:"019",y:"2024",c:"neubau",
  t:{de:"unterstand",en:"shelter"},
  d:{de:"Planung für einen robusten und funktionalen Fahrradunterstand, der auch Lastenrädern Platz bietet. Die Konstruktion ist bewusst einfach und langlebig gehalten und lässt sich an unterschiedliche Standorte anpassen. Im Rahmen der Konzeption wurde untersucht, das Dach mit Solarmodulen einzudecken, sodass der Unterstand neben dem Wetterschutz auch Strom erzeugen kann.",
     en:"Design for a robust and functional bicycle shelter that also accommodates cargo bikes. The structure is deliberately simple and durable and can be adapted to different sites. As part of the concept, the option of covering the roof with solar modules was studied, so that the shelter can generate electricity in addition to providing weather protection."},
  meta:{de:{Jahr:"2024",Typ:"Kleinbau, Infrastruktur",Nutzung:"Fahrrad- und Lastenradabstellung",Rolle:"Entwurf"},
        en:{Year:"2024",Type:"Small structure, infrastructure",Use:"Bicycle and cargo-bike parking",Role:"Design"}},
  pre:"Tizian-Rein-Fahrrad-Unterstand-019.",
  imgs:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg"]},

 {n:"018",y:"2024",c:"neubau",
  t:{de:"zakk gartenstuhl",en:"zakk garden chair"},
  d:{de:"ZAKK kann fliegen. ZAKK kann eintauchen. ZAKK ist variabel, ZAKK ist haltbar. Der Gartenstuhl entsteht vollständig aus einfachen Baumarkt-Teilen: Erdhülsen bilden das Gestell, ein Kellerfenstergitter wird zur Sitz- und Rückenfläche. Verzinkt und wetterfest ist ZAKK für den dauerhaften Einsatz im Freien gedacht. ZAKK ist ein Objekt, das aus genormten Halbzeugen mit minimalem Aufwand ein eigenständiges Möbel macht.",
     en:"ZAKK can fly. ZAKK can dive. ZAKK is versatile, ZAKK is durable. The garden chair is made entirely from simple hardware-store parts: ground anchors form the frame, a basement window grille becomes the seat and back. Galvanised and weatherproof, ZAKK is designed for permanent outdoor use. ZAKK is an object that turns standardised semi-finished parts into an independent piece of furniture with minimal effort."},
  meta:{de:{Jahr:"2024",Typ:"Objekt, Außenmöbel",Material:"Erdhülsen, Kellerfenstergitter, verzinkt"},
        en:{Year:"2024",Type:"Object, outdoor furniture",Material:"Ground anchors, window grille, galvanised"}},
  pre:"Tizian-Rein-Zakk-Gartenstuhl-",
  imgs:["1.jpg","2.gif","3.jpg","4.jpg"]},

 {n:"017",y:"2024",c:"neubau",
  t:{de:"free/bird",en:"free/bird"},
  d:{de:"Eine parametrisch gesteuerte Holzkonstruktion für ein Bauteillager auf einem SBB-Areal in Zürich, entworfen vollständig in der virtuellen Realität im Maßstab 1:1. Statt am Bildschirm wird der Entwurf begehbar entwickelt: Bauteile werden in der VR-Umgebung direkt gesetzt, geprüft und angepasst. Die Arbeit entstand im Immersive Studio von Gramazio Kohler Research an der ETH Zürich und lotet aus, wie sich räumliches Entwerfen verändert, wenn Maßstab und Körper unmittelbar Teil des Werkzeugs werden.",
     en:"A parametrically controlled timber structure for a component store on an SBB site in Zurich, designed entirely in virtual reality at 1:1 scale. Rather than on screen, the design is developed as something you can walk through: parts are placed, tested and adjusted directly in the VR environment. The project was made in the Immersive Studio of Gramazio Kohler Research at ETH Zurich and explores how spatial design changes when scale and body become an immediate part of the tool."},
  meta:{de:{Ort:"Zürich",Jahr:"2024",Kontext:"Immersive Studio, Gramazio Kohler Research, ETH Zürich",Kollaboration:"mit Lancelot Burwell"},
        en:{Place:"Zurich",Year:"2024",Context:"Immersive Studio, Gramazio Kohler Research, ETH Zurich",Collaboration:"with Lancelot Burwell"}},
  video:"Tizian-Rein-Free-Bird-017.video.mp4",
  pre:"Tizian-Rein-Free-Bird-017.",
  imgs:["1.jpg","2.jpg","3.jpg"]},

 {n:"016",y:"2023",c:"forschung",
  t:{de:"harboring histories",en:"harboring histories"},
  d:{de:"Reluctant Relics — Memories of a Molecule ist ein spekulativer Katalog für ein Palermo der Zukunft, in dem Denkmäler, Erzählungen und Artefakte zu einem architektonischen Bühnenstück verschmelzen. Die Arbeit verhandelt, wie eine Stadt mit ihren widerständigen, unbequemen Überresten umgeht und welche Geschichten sie für künftige Generationen aufbewahrt. Entstanden im Studio Meteora an der ETH Zürich, verbindet das Projekt Recherche, Erzählung und Entwurf zu einer offenen Auseinandersetzung mit Erinnerung und Erbe.",
     en:"Reluctant Relics — Memories of a Molecule is a speculative catalogue for a future Palermo, in which monuments, narratives and artefacts merge into an architectural stage play. The work negotiates how a city deals with its resistant, uncomfortable remains and which stories it preserves for future generations. Made in Studio Meteora at ETH Zurich, the project combines research, narrative and design into an open inquiry into memory and heritage."},
  meta:{de:{Ort:"Palermo",Jahr:"2023",Kontext:"Studio Meteora, ETH Zürich",Kollaboration:"mit Virginia Zaretskie"},
        en:{Place:"Palermo",Year:"2023",Context:"Studio Meteora, ETH Zurich",Collaboration:"with Virginia Zaretskie"}},
  pre:"Tizian-Rein-Harboring-Histories-016.",
  imgs:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","7.jpg","6.jpg"]},

 {n:"015",y:"",c:"neubau",
  t:{de:"arbor forum",en:"arbor forum"},
  d:{de:"Ein Architekturentwurf, entstanden im Studienkontext an der TU München. Das Projekt untersucht den Übergang zwischen Innen und Außen, Tragwerk und Atmosphäre. Eine ausführliche Dokumentation folgt.",
     en:"An architectural design project developed within the study context at TU Munich. The project explores the threshold between inside and outside, structure and atmosphere. Full documentation to follow."},
  meta:{de:{Kontext:"TU München",Typ:"Architekturentwurf",Status:"Dokumentation folgt"},
        en:{Context:"TU Munich",Type:"Architectural design",Status:"Documentation to follow"}},
  pre:"",imgs:[]},

 {n:"013",y:"2023",c:"forschung",
  t:{de:"robosgraffito",en:"robosgraffito"},
  d:{de:"Traditionelle Putztechniken — Kratzen, Schleifen, Hobeln, Ziehen, Stempeln — werden in robotische Bewegungsabläufe übersetzt, um mehrschichtige, mehrfarbige Fassaden herzustellen. Das Projekt verbindet ein altes handwerkliches Wissen mit der Präzision und Wiederholbarkeit roboterbasierter Fertigung und fragt, wie sich überlieferte Oberflächentechniken in einen zeitgenössischen, digital gesteuerten Prozess überführen lassen, ohne ihren materiellen Reichtum zu verlieren.",
     en:"Traditional plastering techniques — scratching, sanding, planing, drawing, stamping — are translated into robotic motion sequences to produce multi-layered, multi-coloured façades. The project combines an old craft knowledge with the precision and repeatability of robotic fabrication, asking how inherited surface techniques can be carried into a contemporary, digitally controlled process without losing their material richness."},
  meta:{de:{Kontext:"TU München",Jahr:"2023",Typ:"Robotische Fertigung",Betreuung:"Prof. Andreas Hild & Prof. Kathrin Dörfler"},
        en:{Context:"TU Munich",Year:"2023",Type:"Robotic fabrication",Supervision:"Prof. Andreas Hild & Prof. Kathrin Dörfler"}},
  pre:"Tizian-Rein-RoboSgraffito-013.",
  imgs:["1.jpg","3.jpg","2.jpg","5.jpg","6.jpg","7.jpg"]},

 {n:"012",y:"2023",c:"forschung",
  t:{de:"structural patterns",en:"structural patterns"},
  d:{de:"Eine Untersuchung von Gleichgewicht in architektonischen Strukturen durch stereotomische Prinzipien, gezielt gesetzte Hohlräume und ineinandergreifende Geometrien. Über digitale Simulation und physische 3D-Drucktests wird ausgelotet, wie Lastabtrag, Materialeinsatz und Form zusammenhängen und wie sich aus dem Prinzip des Steinschnitts neue, materialsparende Tragmuster ableiten lassen.",
     en:"An investigation of equilibrium in architectural structures through stereotomic principles, deliberately placed voids and interlocking geometries. Through digital simulation and physical 3D-printing tests, it explores how load transfer, material use and form relate, and how new, material-saving structural patterns can be derived from the principle of stone-cutting."},
  meta:{de:{Kontext:"Professur für Structural Design, TU München",Jahr:"2023",Typ:"Tragwerk, 3D-Druck",Rolle:"Forschung und Prototyping"},
        en:{Context:"Professorship of Structural Design, TU Munich",Year:"2023",Type:"Structural Design, 3D printing",Role:"Research and prototyping"}},
  pre:"Tizian-Rein-Structural-Patterns-012.",
  imgs:["3.jpg","4.jpg","1.jpg","2.jpg"]},

 {n:"011",y:"2022",c:"neubau",
  t:{de:"rheinschwimmbad",en:"rhine river baths"},
  d:{de:"Ein schwimmendes Flussbad auf dem Rhein mit Saunaturm, Badehallen und Restaurant in monolithischen Baukörpern. Das Bachelorprojekt macht die stark wechselnden Wasserstände des Flusses nicht nur sicher nutzbar, sondern erhebt sie zum räumlichen Erlebnis: Eine bewegliche Rampenfassade reagiert dynamisch auf den Pegel und hält das Bad bei jedem Wasserstand barrierefrei zugänglich. So wird die Unbeständigkeit des Flusses vom Problem zum architektonischen Thema.",
     en:"A floating river bath on the Rhine with a sauna tower, bathing halls and a restaurant in monolithic volumes. The bachelor project not only makes the river's strongly fluctuating water levels safely usable but raises them to a spatial experience: a movable ramp façade responds dynamically to the level and keeps the bath accessible at any state of the water. The river's instability thus shifts from a problem to an architectural theme."},
  meta:{de:{Ort:"Rhein",Jahr:"2022",Kontext:"Bachelorthesis, TH Köln",Nutzung:"Flussbad, Sauna, Restaurant"},
        en:{Place:"Rhine",Year:"2022",Context:"Bachelor's thesis, TH Cologne",Use:"River bath, sauna, restaurant"}},
  pre:"Tizian-Rein-Bachelor-Thesis-Rheinschwimmbad-011.",
  imgs:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg","11.jpg","12.jpg"]},

 {n:"009",y:"2019",c:"neubau",
  t:{de:"wohnen in nippes",en:"living in nippes"},
  d:{de:"Ein Wohnungsbauprojekt auf einer Baulücke in Köln-Nippes. Der Entwurf mischt unterschiedliche Wohnungstypologien, aktiviert die Erdgeschosszone für gemeinschaftliche und gewerbliche Nutzungen und entwickelt eine Fassade, die im Dialog mit dem historischen Straßenraum steht. Ziel ist ein dichter, lebendiger Baustein, der die Lücke schließt und zugleich das Quartier im Erdgeschoss belebt.",
     en:"A housing project on an infill plot in Cologne-Nippes. The design mixes different apartment typologies, activates the ground floor for communal and commercial uses, and develops a façade in dialogue with the historic streetscape. The aim is a dense, lively building block that closes the gap while animating the neighbourhood at street level."},
  meta:{de:{Ort:"Köln-Nippes",Jahr:"2019",Kontext:"TH Köln",Nutzung:"Wohnen, aktives Erdgeschoss"},
        en:{Place:"Cologne-Nippes",Year:"2019",Context:"TH Cologne",Use:"Housing, active ground floor"}},
  pre:"Tizian-Rein-Wohnungsbau-Nippes-009.",
  imgs:["3.jpg","4.jpg","1.jpg","2.jpg","5.jpg","6.jpg","7.jpg","9.jpg"]}
];

const INFO_HTML={
de:`
    <img class="portrait" loading="lazy" src="images/about/tizian-rein-portrait.jpg" alt="Porträt von Tizian Rein, Architekt und Doktorand" onerror="this.remove()">
    <p class="text">Tizian Rein (*1997 in Rhöndorf) studierte Architektur an der Technischen Universität München, der ETH Zürich und der Technischen Hochschule Köln. Nach seinem Bachelorabschluss und seiner Tätigkeit im Atelier Max &amp; Jakob Giese wandte er sich im Master-Studium technisch-forschenden Feldern zu, die computergestützte Prozesse mit Denkmalpflege verbinden. Diese Interessen verfolgte er zudem als wissenschaftliche Hilfskraft an der Professur für Digitale Fabrikation in München und bei Gramazio Kohler Research an der ETH Zürich. Seine Masterarbeit <em>From Structure to Action: Machine Reasoning and the Logics of Repair</em> (2025) untersucht, wie digitale Entwurfsprozesse Konzepte der Reparatur und Kontinuität aufgreifen können. Derzeit ist er Doktorand an der Professur für Digital Fabrication innerhalb des Munich Institute for Robotics and Machine Intelligence (MIRMI) sowie am MIT (USA). In seiner Arbeit erforscht er, wie computergestützte Methoden und KI tief in das Handwerk und die Erhaltung von Gebäuden eingebettet werden können. Parallel zu seiner Forschung arbeitet er in selbstständiger Praxis an der Weiterentwicklung und Reprogrammierung im Bestand.</p>

    <h3>ausbildung</h3>
    <ul class="cv">
      <li><span class="j">2022–2025</span><span class="w"><b>TU München, Architektur M.A.</b> — Mentorenprogramm Computational Methods, Abschluss mit Auszeichnung</span></li>
      <li><span class="j">2023–2024</span><span class="w"><b>ETH Zürich, Architektur Masterstudiengang</b> — Stipendiat</span></li>
      <li><span class="j">2018–2021</span><span class="w"><b>TH Köln, Architektur B.A.</b></span></li>
    </ul>

    <h3>mitgliedschaften</h3>
    <ul class="cv">
      <li><span class="j">seit 2026</span><span class="w"><b>Deutscher Werkbund</b></span></li>
      <li><span class="j">seit 2026</span><span class="w"><b>initiative.umbau</b> (e.V.i.G.)</span></li>
    </ul>

    <h3>erfahrung</h3>
    <ul class="cv">
      <li><span class="j">seit 2026</span><span class="w"><b>Wissenschaftlicher Mitarbeiter / Doktorand</b> — Professur für Digital Fabrication, TU München, im Munich Institute for Robotics and Machine Intelligence (MIRMI) und am MIT, USA</span></li>
      <li><span class="j">seit 2026</span><span class="w"><b>Junior-Architekt AKNW</b> — freischaffende planerische Tätigkeit in Bad Honnef und München</span></li>
      <li><span class="j">2023–2026</span><span class="w"><b>Wissenschaftliche Hilfskraft</b> — Professur für Digitale Fabrikation, TU München</span></li>
      <li><span class="j">2023–2024</span><span class="w"><b>Wissenschaftliche Hilfskraft</b> — Gramazio Kohler Research, ITA, ETH Zürich</span></li>
      <li><span class="j">2021–2022</span><span class="w"><b>Projektassistenz</b> — Atelier Max &amp; Jakob Giese, Gehlert</span></li>
      <li><span class="j">2020–2021</span><span class="w"><b>Studentischer Prodekan Architektur</b> — gewählter Vertreter an der TH Köln</span></li>
      <li><span class="j">2019–2021</span><span class="w"><b>Tutor für Entwurf und Konstruktion</b> — Prof. Carola Wiese</span></li>
      <li><span class="j">seit 2016</span><span class="w"><b>Selbstständige Tätigkeit</b> — 3D-Druck und Design</span></li>
    </ul>

    <h3>publikationen / vorträge</h3>
    <ul class="cv">
      <li><span class="j">2025</span><span class="w"><i>The Architect as Toolmaker: AI as Instrument in Architectural Repair</i> — Future(s) of Educational Design Symposia, Center of Educational Technologies, TU München</span></li>
      <li><span class="j">2025</span><span class="w"><i>From Structure to Action: Machine Reasoning and the Logics of Repair</i> — Masterthesis, TUM School of Engineering and Design, publiziert via mediaTUM</span></li>
      <li><span class="j">2025</span><span class="w"><i>From Prototype to Product: Start-ups and Intellectual Property in Digital Fabrication</i> — mit Marcel Studer und Dominik Reisach, ITA (Prof. Silke Langenberg), Startup Architecture Symposium, ETH Zürich</span></li>
      <li><span class="j">2025</span><span class="w"><i>From Material to Market: How Materiality Drives Innovation in Architectural Technologies</i> — mit Marcel Studer und Dominik Reisach, ITA (Prof. Silke Langenberg), Architecture &amp; Patents Conference, ETH Zürich</span></li>
      <li><span class="j">2024</span><span class="w"><i>Die Neue Kapelle auf dem Waldfriedhof</i> — eingeladener Vortrag, Bürgerhaus Rhöndorf</span></li>
      <li><span class="j">2024</span><span class="w"><i>Den Erhalt der Kapelle unterstützen</i> — Gastbeitrag, Honnef Heute</span></li>
      <li><span class="j">2022</span><span class="w"><i>Die Waldfriedhofskapelle in Rhöndorf</i> — ISBN 978-3-00-071896-0</span></li>
    </ul>

    <p class="kontakt"><a href="mailto:mail@tizianrein.de">mail@tizianrein.de</a> · münchen / bad honnef</p>`,
en:`
    <img class="portrait" loading="lazy" src="images/about/tizian-rein-portrait.jpg" alt="Porträt von Tizian Rein, Architekt und Doktorand" onerror="this.remove()">
    <p class="text">Tizian Rein (*1997 in Rhöndorf) studied architecture at the Technical University of Munich, ETH Zurich, and the University of Applied Sciences Cologne. After completing his bachelor's degree and working as a project assistant at Atelier Max &amp; Jakob Giese, he turned toward more technical and research-oriented fields that connect computational design with building heritage and preservation. He pursued these interests as a research assistant at the Professorship of Digital Fabrication in Munich and at Gramazio Kohler Research at ETH Zurich. His 2025 master's thesis <em>From Structure to Action: Machine Reasoning and the Logics of Repair</em> explores how digital design processes can engage with notions of repair and continuity. He is currently a doctoral researcher at the Professorship of Digital Fabrication within the Munich Institute for Robotics and Machine Intelligence (MIRMI) and MIT, USA. Through his work, he investigates how computational methods and artificial intelligence can be deeply embedded in the craft and preservation of buildings. Parallel to his research, he works independently on the transformation and reprogramming of the built environment.</p>

    <h3>education</h3>
    <ul class="cv">
      <li><span class="j">2022–2025</span><span class="w"><b>TU Munich, Architecture M.A.</b> — Mentorship Programme Computational Methods, graduated with distinction</span></li>
      <li><span class="j">2023–2024</span><span class="w"><b>ETH Zurich, Architecture Master´s Program</b> — scholarship holder</span></li>
      <li><span class="j">2018–2021</span><span class="w"><b>TH Cologne, Architecture B.A.</b></span></li>
    </ul>

    <h3>memberships</h3>
    <ul class="cv">
      <li><span class="j">since 2026</span><span class="w"><b>Deutscher Werkbund</b></span></li>
      <li><span class="j">since 2026</span><span class="w"><b>initiative.umbau</b> (e.V.i.G.)</span></li>
    </ul>

    <h3>experience</h3>
    <ul class="cv">
      <li><span class="j">since 2026</span><span class="w"><b>Research associate / doctoral researcher</b> — Professorship of Digital Fabrication, TU Munich, within the Munich Institute for Robotics and Machine Intelligence (MIRMI) and at MIT, USA</span></li>
      <li><span class="j">since 2026</span><span class="w"><b>Junior architect AKNW</b> — independent planning practice in Bad Honnef and Munich</span></li>
      <li><span class="j">2023–2026</span><span class="w"><b>Research assistant</b> — Professorship of Digital Fabrication, TU Munich</span></li>
      <li><span class="j">2023–2024</span><span class="w"><b>Research assistant</b> — Gramazio Kohler Research, ITA, ETH Zurich</span></li>
      <li><span class="j">2021–2022</span><span class="w"><b>Project assistant</b> — Atelier Max &amp; Jakob Giese, Gehlert</span></li>
      <li><span class="j">2020–2021</span><span class="w"><b>Student vice-dean of architecture</b> — elected representative, TH Cologne</span></li>
      <li><span class="j">2019–2021</span><span class="w"><b>Tutor for design and construction</b> — Prof. Carola Wiese</span></li>
      <li><span class="j">since 2016</span><span class="w"><b>Self-employed</b> — 3D printing and design</span></li>
    </ul>

    <h3>publications / talks</h3>
    <ul class="cv">
      <li><span class="j">2025</span><span class="w"><i>The Architect as Toolmaker: AI as Instrument in Architectural Repair</i> — Future(s) of Educational Design Symposia, Center of Educational Technologies, TU Munich</span></li>
      <li><span class="j">2025</span><span class="w"><i>From Structure to Action: Machine Reasoning and the Logics of Repair</i> — master's thesis, TUM School of Engineering and Design, published via mediaTUM</span></li>
      <li><span class="j">2025</span><span class="w"><i>From Prototype to Product: Start-ups and Intellectual Property in Digital Fabrication</i> — with Marcel Studer and Dominik Reisach, ITA (Prof. Silke Langenberg), Startup Architecture Symposium, ETH Zurich</span></li>
      <li><span class="j">2025</span><span class="w"><i>From Material to Market: How Materiality Drives Innovation in Architectural Technologies</i> — with Marcel Studer and Dominik Reisach, ITA (Prof. Silke Langenberg), Architecture &amp; Patents Conference, ETH Zurich</span></li>
      <li><span class="j">2024</span><span class="w"><i>The New Chapel at the Woodland Cemetery</i> — invited lecture, Bürgerhaus Rhöndorf</span></li>
      <li><span class="j">2024</span><span class="w"><i>Supporting the Preservation of the Chapel</i> — guest contribution, Honnef Heute</span></li>
      <li><span class="j">2022</span><span class="w"><i>Die Waldfriedhofskapelle in Rhöndorf</i> — ISBN 978-3-00-071896-0</span></li>
    </ul>

    <p class="kontakt"><a href="mailto:mail@tizianrein.de">mail@tizianrein.de</a> · munich / bad honnef</p>`
};