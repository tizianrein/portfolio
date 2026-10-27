const B="images/projects/";

const KAT={
  de:{umbau:"Umbau",neubau:"Neubau",forschung:"Forschung"},
  en:{umbau:"Renovation",neubau:"New Build",forschung:"Research"}
};

const UI={
  de:{alle:"Alle",info:"Info",
      worte:["umbau","neubau","forschung","reparatur","bestand","weiterbauen","denkmalpflege","fabrikation","kontinuität","instandsetzung"],
      orte:"München <i>●</i> Bad Honnef"},
  en:{alle:"All",info:"Info",
      worte:["transformation","new build","research","repair","the existing","heritage","fabrication","continuity","maintenance"],
      orte:"Munich <i>●</i> Bad Honnef"}
};

/* Meta-Schlüssel werden je Sprache beschriftet */
const METAKEYS={
  de:{ort:"Ort",jahr:"Jahr",nutzung:"Nutzung",rolle:"Rolle",typ:"Typ",
      betreuung:"Betreuung",zusammen:"Zusammenarbeit",kontext:"Kontext",status:"Status",material:"Material",software:"Software"},
  en:{ort:"Place",jahr:"Year",nutzung:"Use",rolle:"Role",typ:"Type",
      betreuung:"Supervision",zusammen:"Collaboration",kontext:"Context",status:"Status",material:"Material",software:"Software"}
};

const P=[

 {n:"025",y:"2026",c:"forschung",
  t:{de:"Human-Robot Repair",en:"Human-Robot Repair"},
  d:{de:"Können intelligente Maschinen helfen, Reparatur zu strukturieren und auszuführen? In unserem Workshop „Actionable Repair“ auf der <a href=\"https://robarch2026.org\" target=\"_blank\" rel=\"noopener\">ROB|ARCH 2026</a> an der <a href=\"https://aarch.dk/en/\" target=\"_blank\" rel=\"noopener\">Aarhus School of Architecture</a> untersuchten und reparierten neun Teilnehmer drei Tage lang eine Fachwerkecke im Maßstab 1:1 mit geschädigten Hölzern. Sie kartierten die Schäden in einer Web-Anwendung und entwickelten mit einem multimodalen KI-Assistenten Reparaturstrategien als nachvollziehbare Abfolgen von Arbeitsschritten. Ein mobiler UR20-Roboter riss die Schnittlinien an, scannte die Kontaktflächen und fräste passende Einsatzstücke, die die Teilnehmer einpassten. Entscheidungen blieben vorrangig beim Menschen. Gemeinsam mit <a href=\"https://www.arc.ed.tum.de/en/df/team/avishek-das/\" target=\"_blank\" rel=\"noopener\">Avishek Das</a>, <a href=\"https://www.arc.ed.tum.de/en/df/team/beguem-saral/\" target=\"_blank\" rel=\"noopener\">Begüm Saral</a> und <a href=\"https://www.arc.ed.tum.de/en/df/team/kathrin-doerfler/\" target=\"_blank\" rel=\"noopener\">Kathrin Dörfler</a> an der <a href=\"https://www.arc.ed.tum.de/en/df/\" target=\"_blank\" rel=\"noopener\">Professur für Digital Fabrication</a> der Technischen Universität München.",
     en:"Can intelligent machines help us structure and carry out repair? In our workshop “Actionable Repair” at <a href=\"https://robarch2026.org\" target=\"_blank\" rel=\"noopener\">ROB|ARCH 2026</a> at the <a href=\"https://aarch.dk/en/\" target=\"_blank\" rel=\"noopener\">Aarhus School of Architecture</a>, nine participants spent three days investigating and repairing a full-scale half-timbered corner with damaged members. They mapped the damage in a web application and developed repair strategies with a multimodal AI assistant as inspectable sequences of steps. A mobile UR20 robot scribed the cutting lines, scanned the contact surfaces and milled matching insertion pieces, which the participants fitted. Decisions remained primarily with the humans. Made together with <a href=\"https://www.arc.ed.tum.de/en/df/team/avishek-das/\" target=\"_blank\" rel=\"noopener\">Avishek Das</a>, <a href=\"https://www.arc.ed.tum.de/en/df/team/beguem-saral/\" target=\"_blank\" rel=\"noopener\">Begüm Saral</a> and <a href=\"https://www.arc.ed.tum.de/en/df/team/kathrin-doerfler/\" target=\"_blank\" rel=\"noopener\">Kathrin Dörfler</a> at the <a href=\"https://www.arc.ed.tum.de/en/df/\" target=\"_blank\" rel=\"noopener\">Professorship of Digital Fabrication</a> at TUM."},
  pre:"Tizian-Rein-Human-Robot-Repair-025.",
  imgs:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","7.jpg","8.jpg","9.jpg","10.jpg","11.jpg","12.jpg","13.jpg","14.jpg","15.jpg","16.jpg","18.jpg","19.jpg"]},

 {n:"023",y:"2025–26",c:"umbau",
  t:{de:"Separate Wohneinheit",en:"Detached Apartment"},
  d:{de:"Umbau und Neuordnung eines freistehenden Wohnhauses in Bonn aus dem Jahr 1958. Der bestehende Grundriss wird überarbeitet, Bad und Küche werden neu angeordnet und an die heutige Nutzung angepasst. Durch das Abtrennen und den Ausbau der ehemaligen Waschküche und der Abstellräume entsteht im Untergeschoss eine eigenständige Wohneinheit mit separatem Eingang. Wenige, gezielte Eingriffe in den Bestand schaffen so eine zweite, vollwertige Wohnung, ohne den Charakter des Hauses zu überformen. Entwurf und Planung, derzeit in Ausführung.",
     en:"Conversion and reorganization of a detached house in Bonn dating from 1958. The existing floor plan is reworked, and the bathroom and kitchen are repositioned for contemporary use. By separating and fitting out the former laundry and storage rooms, a self-contained apartment with its own entrance is created on the lower floor. A few precise interventions in the existing fabric produce a second, fully functional dwelling without overwriting the character of the house. Design and planning, currently under construction."},
  pre:"Tizian-Rein-Separate-Wohneinheit-022.",
  imgs:["12.jpg","13.jpg","4.jpg","5.jpg","14.jpg","1.jpg","11.jpg","6.gif","8.jpg","3.jpg","9.jpg","10.jpg"]},

 {n:"024",y:"2025",c:"umbau",
  t:{de:"Haus mit Auge",en:"House with an Eye"},
  d:{de:"Ein kleines Wohnhaus mit verzierter Putzfassade, über dessen Eingang ein ornamentales Auge sitzt. Nach längerem Leerstand wird das Haus umgebaut und in zwei Wohneinheiten geteilt. Das Budget ist gering, deshalb bleibt vom Bestand so viel wie möglich erhalten: Wände, Fachwerk und Öffnungen werden nur dort verändert, wo die neue Aufteilung es verlangt. Für das Erdgeschoss entstanden zahlreiche Grundrissvarianten. Eine zentrale Frage war dabei, wo die zweite Wohnung ihren eigenen Eingang bekommt. Das Haus erhält ein zweites Auge, ohne dabei zu schielen.",
     en:"A small house with a decorated stucco facade and an ornamental eye above its entrance. After standing empty for a long time, the house is converted and divided into two apartments. The budget is small, so as much of the existing fabric as possible is kept: walls, timber framing and openings change only where the new layout requires it. Numerous floor plan variants were developed for the ground floor. A central question was where the second apartment would get its own entrance. The house gets a second eye without starting to squint."},
  pre:"Tizian-Rein-Haus-mit-Auge-024.",
  imgs:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"]},

      {n:"022",y:"2024–25",c:"forschung",
  t:{de:"From Structure to Action",en:"From Structure to Action"},
  d:{de:"Masterarbeit an der <a href=\"https://www.arc.ed.tum.de/en/df/\" target=\"_blank\" rel=\"noopener\">Professorship of Digital Fabrication</a> der Technischen Universität München, betreut von <a href=\"https://www.arc.ed.tum.de/en/df/team/kathrin-doerfler/\" target=\"_blank\" rel=\"noopener\">Prof. Kathrin Dörfler</a> und <a href=\"https://www.arc.ed.tum.de/en/df/team/beguem-saral/\" target=\"_blank\" rel=\"noopener\">Begüm Saral</a>. Zehn ausrangierte Stapelstühle, jeder auf eigene Weise beschädigt, dienen als Testfeld für die Frage, wie künstliche Intelligenz bei der Reparatur helfen kann. Ein Framework mit multimodalen KI-Modellen leitet aus Fotos, Skizzen und Notizen ein Modell des Stuhls und seiner Schäden ab, schlägt Reparaturschritte vor und begleitet die Arbeit in der Werkstatt. Zwei Bücher dokumentieren die Arbeit: „From Structure to Action“ und „Ten Derelicts“. <a class=\"pdf\" href=\"https://www.arc.ed.tum.de/fileadmin/w00cgv/df/pdf/Rein_Tizian_2025_FromStructureToAction.pdf\" target=\"_blank\" rel=\"noopener\">[PDF]</a>",
     en:"Master's thesis at the <a href=\"https://www.arc.ed.tum.de/en/df/\" target=\"_blank\" rel=\"noopener\">Professorship of Digital Fabrication</a>, TUM, supervised by <a href=\"https://www.arc.ed.tum.de/en/df/team/kathrin-doerfler/\" target=\"_blank\" rel=\"noopener\">Prof. Kathrin Dörfler</a> and <a href=\"https://www.arc.ed.tum.de/en/df/team/beguem-saral/\" target=\"_blank\" rel=\"noopener\">Begüm Saral</a>. Ten discarded stacking chairs, each damaged in its own way, serve as a test bed for the question of how artificial intelligence can help with repair. A framework built on multimodal AI models derives a model of the chair and its damage from photographs, sketches and notes, proposes repair steps and guides the work in the workshop. Two books document the project: “From Structure to Action” and “Ten Derelicts”. <a class=\"pdf\" href=\"https://www.arc.ed.tum.de/fileadmin/w00cgv/df/pdf/Rein_Tizian_2025_FromStructureToAction.pdf\" target=\"_blank\" rel=\"noopener\">[PDF]</a>"},
  pre:"Tizian-Rein-Master-Thesis-From-Structure-to-Action-023.",
  imgs:["31.jpg","34.jpg","33.jpg","23.jpg","21.jpg","35.jpg","36.jpg","40.jpg","37.jpg","38.jpg","44.jpg","45.jpg","14.jpg","41.jpg","42.jpg","4.jpg","43.jpg","39.jpg","8.jpg","2.jpg"]},

 {n:"021",y:"seit 2022",c:"umbau",
  t:{de:"Waldfriedhofskapelle Rhöndorf",en:"Cemetery Chapel"},
  d:{de:"Eine fortlaufende Forschungs- und künstlerisch-aktivistische Auseinandersetzung mit der Waldfriedhofskapelle in Rhöndorf, einem feinen Beispiel sakraler Nachkriegsarchitektur. Die Arbeit dokumentiert den Bau, ordnet ihn baugeschichtlich ein und macht seinen kulturellen Wert öffentlich sichtbar. 2024 wurde ein Abrissantrag der Stadtverwaltung nach öffentlicher Besorgnis und erneuter Diskussion über die Bedeutung des Bauwerks zurückgezogen. Inzwischen ist die Kapelle instand gesetzt: ein Beleg dafür, wie sorgfältige Vermittlung den Erhalt eines bedrohten Gebäudes mittragen kann.",
     en:"An ongoing research and artistic-activist engagement with the woodland cemetery chapel in Rhöndorf, a fine example of post-war sacred architecture. The work documents the building, situates it within architectural history and makes its cultural value publicly visible. In 2024 a demolition proposal by the municipality was withdrawn after public concern and renewed debate about the building's significance. The chapel has since been repaired, evidence of how careful advocacy can help preserve a threatened structure."},
  pre:"Tizian-Rein-Waldfriedhofskapelle-Rh%C3%B6ndorf-021.",
  imgs:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"]},

 {n:"020",y:"2022–23",c:"umbau",
  t:{de:"Beamtenwohnung Bonn",en:"Civil Servant's Apartment"},
  d:{de:"Sanierung und Innenausbau einer Wohnung in einem Nachkriegsbau in Bonn. Aus einem kompakten, in die Jahre gekommenen Grundriss werden mit wenigen, präzisen Eingriffen neue Beziehungen zwischen den Räumen geschaffen sowie zu Balkon und Garten. Oberflächen, Einbauten und Licht werden so überarbeitet, dass die ursprünglichen Qualitäten der Wohnung lesbar bleiben und zugleich ein zeitgemäßer Wohnkomfort entsteht. Entwurf und Innenausbau, realisiert.",
     en:"Renovation and interior fit-out of an apartment in a post-war building in Bonn. From a compact, dated floor plan, a few precise interventions create new relationships between the rooms and toward the balcony and garden. Surfaces, built-in elements and light are reworked so that the apartment's original qualities remain legible while a contemporary level of comfort is achieved. Design and interior fit-out, completed."},
  pre:"Tizian-Rein-Wohnung-eines-Beamten-020.",
  imgs:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"]},

 {n:"019",y:"2024",c:"neubau",
  t:{de:"Unterstand",en:"Shelter"},
  d:{de:"Entwurf für einen robusten und funktionalen Fahrradunterstand, der auch Lastenrädern Platz bietet. Die Konstruktion ist bewusst einfach und langlebig gehalten und lässt sich an unterschiedliche Standorte anpassen. Im Rahmen der Konzeption wurde untersucht, das Dach mit Solarmodulen einzudecken, sodass der Unterstand neben dem Wetterschutz auch Strom erzeugen kann.",
     en:"Design for a robust and functional bicycle shelter that also accommodates cargo bikes. The structure is deliberately simple and durable and can be adapted to different sites. As part of the concept, the option of covering the roof with solar modules was studied, so that the shelter can generate electricity in addition to providing weather protection."},
  pre:"Tizian-Rein-Fahrrad-Unterstand-019.",
  imgs:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg"]},

 {n:"018",y:"2024",c:"neubau",
  t:{de:"ZAKK Gartenstuhl",en:"ZAKK Garden Chair"},
  d:{de:"ZAKK kann fliegen. ZAKK kann eintauchen. ZAKK ist variabel, ZAKK ist haltbar. Der Gartenstuhl entsteht vollständig aus einfachen Baumarkt-Teilen: Erdhülsen bilden das Gestell, ein Kellerfenstergitter wird zur Sitz- und Rückenfläche. Verzinkt und wetterfest ist ZAKK für den dauerhaften Einsatz im Freien gedacht. ZAKK ist ein Objekt, das aus genormten Halbzeugen mit minimalem Aufwand ein eigenständiges Möbel macht.",
     en:"ZAKK can fly. ZAKK can dive. ZAKK is versatile, ZAKK is durable. The garden chair is made entirely from simple hardware-store parts: ground anchors form the frame, a basement window grille becomes the seat and back. Galvanized and weatherproof, ZAKK is designed for permanent outdoor use. ZAKK is an object that turns standardized semi-finished parts into an independent piece of furniture with minimal effort."},
  pre:"Tizian-Rein-Zakk-Gartenstuhl-",
  imgs:["1.jpg","2.gif","3.jpg","4.jpg"]},

 {n:"017",y:"2024",c:"neubau",
  t:{de:"Free/Bird",en:"Free/Bird"},
  d:{de:"Eine parametrisch gesteuerte Holzkonstruktion für ein Bauteillager auf einem SBB-Areal in Zürich, entworfen vollständig in der virtuellen Realität im Maßstab 1:1. Statt mit physischen Modellen wird der Entwurf als begehbarer Raum entwickelt und präsentiert: Bauteile werden in der VR-Software <a href=\"https://radii.info/\" target=\"_blank\" rel=\"noopener\">RADii</a> direkt gesetzt, geprüft und angepasst. Die Arbeit entstand gemeinsam mit <a href=\"https://lancelotburwell.ch/\" target=\"_blank\" rel=\"noopener\">Lancelot Burwell</a> im Immersive Studio von <a href=\"https://gramaziokohler.arch.ethz.ch/\" target=\"_blank\" rel=\"noopener\">Gramazio Kohler Research</a> an der ETH Zürich und lotet aus, wie sich räumliches Entwerfen verändert, wenn Maßstab und Körper unmittelbar Teil des Werkzeugs werden. Foto VR-Arena: Gramazio Kohler Research, ETH Zürich. <a href=\"https://arch.ethz.ch/news-und-veranstaltungen/news-kanal/2024/06/im-virtuellen-raum-entwerfen.html\" target=\"_blank\" rel=\"noopener\">Artikel</a>",
     en:"A parametrically controlled timber structure for a component store on an SBB site in Zurich, designed entirely in virtual reality at 1:1 scale. Instead of using physical models, the design is developed and presented as a space you can walk into: parts are placed, tested and adjusted directly in the VR software <a href=\"https://radii.info/\" target=\"_blank\" rel=\"noopener\">RADii</a>. The project was made together with <a href=\"https://lancelotburwell.ch/\" target=\"_blank\" rel=\"noopener\">Lancelot Burwell</a> in the Immersive Studio of <a href=\"https://gramaziokohler.arch.ethz.ch/\" target=\"_blank\" rel=\"noopener\">Gramazio Kohler Research</a> at ETH Zurich and explores how spatial design changes when scale and body become an immediate part of the tool. VR Arena photo: Gramazio Kohler Research, ETH Zurich. <a href=\"https://arch.ethz.ch/news-und-veranstaltungen/news-kanal/2024/06/im-virtuellen-raum-entwerfen.html\" target=\"_blank\" rel=\"noopener\">Article</a>"},
  video:"Tizian-Rein-Free-Bird-017.video.mp4",
  pre:"Tizian-Rein-Free-Bird-017.",
  imgs:["1.jpg","2.jpg","3.jpg","4.jpg"]},

 {n:"016",y:"2023",c:"forschung",
  t:{de:"Harboring Histories",en:"Harboring Histories"},
  d:{de:"Reluctant Relics — Memories of a Molecule ist ein spekulativer Katalog für ein Palermo der Zukunft, in dem Denkmäler, Erzählungen und Artefakte zu einem architektonischen Bühnenstück verschmelzen. Die Arbeit verhandelt, wie eine Stadt mit ihren widerständigen, unbequemen Überresten umgeht und welche Geschichten sie für künftige Generationen aufbewahrt. Entstanden gemeinsam mit Virginia Zaretskie im <a href=\"https://meteora.ch/\" target=\"_blank\" rel=\"noopener\">Studio Meteora</a> am Lehrstuhl für Digital Architectonics von Prof. Dr. Ludger Hovestadt an der ETH Zürich, verbindet das Projekt Recherche, Erzählung und Entwurf zu einer offenen Auseinandersetzung mit Erinnerung und Erbe. Das Projekt ist in der Sektion Studio Meteora (Season 9: Contracting) von <a href=\"https://birkhauser.com/en/book/9783035631494\" target=\"_blank\" rel=\"noopener\"><i>Meteora. Mechanics of Architecture in an Intelligent World</i></a> (Birkhäuser 2026) veröffentlicht. <a class=\"pdf\" href=\"pdf/Tizian-Rein-Reluctant-Relics-Catalogue.pdf\" target=\"_blank\" rel=\"noopener\">[PDF]</a>",
     en:"Reluctant Relics — Memories of a Molecule is a speculative catalog for a future Palermo, in which monuments, narratives and artifacts merge into an architectural stage play. The work negotiates how a city deals with its resistant, uncomfortable remains and which stories it preserves for future generations. Made together with Virginia Zaretskie in <a href=\"https://meteora.ch/\" target=\"_blank\" rel=\"noopener\">Studio Meteora</a> at the Chair of Digital Architectonics of Prof. Dr. Ludger Hovestadt at ETH Zurich, the project combines research, narrative and design into an open inquiry into memory and heritage. The project is published in the Studio Meteora section (Season 9: Contracting) of <a href=\"https://birkhauser.com/en/book/9783035631494\" target=\"_blank\" rel=\"noopener\"><i>Meteora. Mechanics of Architecture in an Intelligent World</i></a> (Birkhäuser, 2026). <a class=\"pdf\" href=\"pdf/Tizian-Rein-Reluctant-Relics-Catalogue.pdf\" target=\"_blank\" rel=\"noopener\">[PDF]</a>"},
  pre:"Tizian-Rein-Harboring-Histories-016.",
  imgs:["8.jpg","9.jpg","10.jpg","11.jpg","2.jpg","12.jpg","13.jpg","14.jpg","15.jpg","16.jpg","17.jpg","18.jpg","5.jpg","19.jpg","20.jpg","21.jpg","22.jpg","23.jpg","24.jpg","25.jpg"]},

 {n:"015",y:"2023",c:"forschung",slug:"versoehnungskirche-dachau",pfad:"015-versoehnungskirche-dachau-church-of-reconciliation",
  t:{de:"Versöhnungskirche Dachau",en:"Church of Reconciliation"},
  d:{de:"Bauaufnahme an der Versöhnungskirche auf dem Gelände der KZ-Gedenkstätte Dachau, die Helmut Striffler 1965 bis 1967 in Sichtbeton und ohne einen einzigen rechten Winkel baute. Untersucht wurde die bis zu fünf Meter hohe Wand am tiefsten und engsten Punkt des Weges in die Kirche. Aus rund 690 Fotos entstand ein photogrammetrisches Modell, auf dem Material, Bauspuren und Schäden kartiert sind. Brettabdrücke und Arbeitsfugen zeigen, in welchen Abschnitten die Wand betoniert wurde. Mit Alireza Yadollahisheikh an der Professur für Neuere Baudenkmalpflege der Technischen Universität München (Prof. Dr. Andreas Putz, Meltem Çavdar).",
     en:"Survey at the Church of Reconciliation on the grounds of the Dachau Concentration Camp Memorial Site, built by Helmut Striffler between 1965 and 1967 in exposed concrete and without a single right angle. The study focuses on the wall, up to five metres high, at the lowest and narrowest point of the path into the church. About 690 photographs were combined into a photogrammetric model that maps materials, construction traces and damage. Board marks and construction joints show the sections in which the wall was poured. With Alireza Yadollahisheikh at the Professorship of Recent Building Heritage Conservation at TUM (Prof. Dr. Andreas Putz, Meltem Çavdar)."},
  pre:"Tizian-Rein-Versoehnungskirche-Dachau-015.",
  imgs:["1.jpg","2.gif","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg"]},

 {n:"013",y:"2023",c:"forschung",
  t:{de:"RoboSgraffito",en:"RoboSgraffito"},
  d:{de:"Traditionelle Putztechniken wie Kratzen, Schleifen, Hobeln, Ziehen und Stempeln werden in robotische Bewegungsabläufe übersetzt, um mehrschichtige, mehrfarbige Fassaden herzustellen. Das Projekt verbindet ein altes handwerkliches Wissen mit der Präzision und Wiederholbarkeit roboterbasierter Fertigung und fragt, wie sich überlieferte Oberflächentechniken in einen zeitgenössischen, digital gesteuerten Prozess überführen lassen, ohne ihren materiellen Reichtum zu verlieren. Entstanden an der Technischen Universität München, betreut von <a href=\"https://www.arc.ed.tum.de/en/eud/\" target=\"_blank\" rel=\"noopener\">Prof. Andreas Hild</a> und <a href=\"https://www.arc.ed.tum.de/en/df/team/kathrin-doerfler/\" target=\"_blank\" rel=\"noopener\">Prof. Kathrin Dörfler</a>.",
     en:"Traditional plastering techniques such as scratching, sanding, planing, drawing and stamping are translated into robotic motion sequences to produce multi-layered, multicolored façades. The project combines an old craft knowledge with the precision and repeatability of robotic fabrication, asking how inherited surface techniques can be carried into a contemporary, digitally controlled process without losing their material richness. Made at TUM, supervised by <a href=\"https://www.arc.ed.tum.de/en/eud/\" target=\"_blank\" rel=\"noopener\">Prof. Andreas Hild</a> and <a href=\"https://www.arc.ed.tum.de/en/df/team/kathrin-doerfler/\" target=\"_blank\" rel=\"noopener\">Prof. Kathrin Dörfler</a>."},
  pre:"Tizian-Rein-RoboSgraffito-013.",
  imgs:["1.jpg","3.jpg","2.jpg","5.jpg","6.jpg","7.jpg"]},

 {n:"012",y:"2023",c:"forschung",
  t:{de:"Structural Patterns",en:"Structural Patterns"},
  d:{de:"Eine Untersuchung von Gleichgewicht in architektonischen Strukturen durch stereotomische Prinzipien, gezielt gesetzte Hohlräume und ineinandergreifende Geometrien. Über digitale Simulation und physische 3D-Drucktests wird ausgelotet, wie Lastabtrag, Materialeinsatz und Form zusammenhängen und wie sich aus dem Prinzip des Steinschnitts neue, materialsparende Tragmuster ableiten lassen. Forschung und Prototyping an der <a href=\"https://www.arc.ed.tum.de/sd/\" target=\"_blank\" rel=\"noopener\">Professur für Structural Design</a> der Technischen Universität München.",
     en:"An investigation of equilibrium in architectural structures through stereotomic principles, deliberately placed voids and interlocking geometries. Through digital simulation and physical 3D-printing tests, it explores how load transfer, material use and form relate, and how new, material-saving structural patterns can be derived from the principle of stone-cutting. Research and prototyping at the <a href=\"https://www.arc.ed.tum.de/en/sd/\" target=\"_blank\" rel=\"noopener\">Professorship of Structural Design</a>, TUM."},
  pre:"Tizian-Rein-Structural-Patterns-012.",
  imgs:["3.jpg","4.jpg","1.jpg","2.jpg"]},

 {n:"011",y:"2022",c:"neubau",
  t:{de:"Rheinschwimmbad",en:"Rhine River Baths"},
  d:{de:"Ein schwimmendes Flussbad auf dem Rhein mit Saunaturm, Badehallen und Restaurant in monolithischen Baukörpern. Die Bachelorarbeit an der TH Köln macht die stark wechselnden Wasserstände des Flusses sicher nutzbar und zugleich zum räumlichen Erlebnis: Eine bewegliche Rampenfassade reagiert dynamisch auf den Pegel und hält das Bad bei jedem Wasserstand barrierefrei zugänglich. So wird die Unbeständigkeit des Flusses vom Problem zum architektonischen Thema.",
     en:"A floating river bath on the Rhine with a sauna tower, bathing halls and a restaurant in monolithic volumes. The bachelor's thesis at TH Cologne makes the river's strongly fluctuating water levels safely usable and at the same time turns them into a spatial experience: a movable ramp façade responds dynamically to the level and keeps the bath accessible at any state of the water. The river's instability thus shifts from a problem to an architectural theme."},
  pre:"Tizian-Rein-Bachelor-Thesis-Rheinschwimmbad-011.",
  imgs:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg","11.jpg","12.jpg"]},

 {n:"009",y:"2019",c:"neubau",
  t:{de:"Wohnen in Nippes",en:"Living in Nippes"},
  pfad:"009-wohnen-in-nippes",
  d:{de:"Ein Wohnungsbauprojekt an der TH Köln für eine Baulücke in Köln-Nippes. Der Entwurf mischt unterschiedliche Wohnungstypologien, aktiviert die Erdgeschosszone für gemeinschaftliche und gewerbliche Nutzungen und entwickelt eine Fassade, die im Dialog mit dem historischen Straßenraum steht. Ziel ist ein dichter, lebendiger Baustein, der die Lücke schließt und zugleich das Quartier im Erdgeschoss belebt.",
     en:"A housing project at TH Cologne for an infill plot in Cologne-Nippes. The design mixes different apartment typologies, activates the ground floor for communal and commercial uses, and develops a façade in dialogue with the historic streetscape. The aim is a dense, lively building block that closes the gap while animating the neighborhood at street level."},
  pre:"Tizian-Rein-Wohnungsbau-Nippes-009.",
  imgs:["5.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg","1.jpg","2.jpg","3.jpg","4.jpg"]}
];

const INFO_HTML={
de:`
    <p class="bio">Viele Dinge, die wir benötigen, sind schon da. Sie alle sind es wert, erhalten zu werden. Bei Gebäuden ist das eine Entwurfsaufgabe, die sich immer wieder stellt.<span class="nur-info"> Dafür braucht es Wissen, Werkzeuge und Menschen, die kollaborieren. Doch genau daran mangelt es oft. Wie könnte eine Reparaturgesellschaft aussehen? Und wie statten wir sie mit wirkungsvollen Instrumenten aus?<br><br>Ich plane Umbauten und forsche an der Technischen Universität München zu Reparatur und digitaler Fabrikation.</span></p>

    <div class="cv-raster">
      <section class="cv-block">
        <h3>Ausbildung</h3>
        <ul class="cv">
          <li><span class="j">2022–2025</span><span class="w"><b>Technische Universität München, Architektur M.A.</b>, Mentorenprogramm Computational Methods, Abschluss mit Auszeichnung</span></li>
          <li><span class="j">2023–2024</span><span class="w"><b>ETH Zürich, Architektur Masterstudiengang</b>, Stipendiat</span></li>
          <li><span class="j">2018–2021</span><span class="w"><b>TH Köln, Architektur B.A.</b></span></li>
        </ul>
      </section>
      <section class="cv-block">
        <h3>Erfahrung</h3>
        <ul class="cv">
          <li><span class="j">seit 2026</span><span class="w"><b>Wissenschaftlicher Mitarbeiter</b>, <a href="https://www.arc.ed.tum.de/en/df/" target="_blank" rel="noopener">Professorship of Digital Fabrication</a>, Technische Universität München, im <a href="https://www.mirmi.tum.de/en/mirmi/home/" target="_blank" rel="noopener">Munich Institute for Robotics and Machine Intelligence (MIRMI)</a> und am <a href="https://www.csail.mit.edu/" target="_blank" rel="noopener">MIT CSAIL</a>, Cambridge (US)</span></li>
          <li><span class="j">seit 2026</span><span class="w"><b>Junior-Architekt AKNW</b>, freischaffende planerische Tätigkeit in Bad Honnef und München</span></li>
          <li><span class="j">2023–2026</span><span class="w"><b>Wissenschaftliche Hilfskraft</b>, <a href="https://www.arc.ed.tum.de/en/df/" target="_blank" rel="noopener">Professorship of Digital Fabrication</a>, Technische Universität München</span></li>
          <li><span class="j">2023–2024</span><span class="w"><b>Wissenschaftliche Hilfskraft</b>, <a href="https://gramaziokohler.arch.ethz.ch/" target="_blank" rel="noopener">Gramazio Kohler Research</a>, ITA, ETH Zürich</span></li>
          <li><span class="j">2021–2022</span><span class="w"><b>Projektassistenz</b>, <a href="https://www.maxundjakob.de/" target="_blank" rel="noopener">Atelier Max &amp; Jakob Giese</a>, Gehlert</span></li>
          <li><span class="j">2020–2021</span><span class="w"><b>Studentischer Prodekan Architektur</b>, gewählter Vertreter an der TH Köln</span></li>
          <li><span class="j">2019–2021</span><span class="w"><b>Tutor für Entwurf und Konstruktion</b>, Prof. Carola Wiese, TH Köln</span></li>
          <li><span class="j">seit 2016</span><span class="w"><b>Selbstständige Tätigkeit</b>, 3D-Druck und Design</span></li>
        </ul>
      </section>
      <section class="cv-block">
        <h3>Lehre</h3>
        <ul class="cv">
          <li><span class="j">2026</span><span class="w"><i>Renovierung Fritz-Pflaum-Hütte</i>, Masterstudio, <a href="https://www.arc.ed.tum.de/en/df/" target="_blank" rel="noopener">Professorship of Digital Fabrication</a>, Technische Universität München, in Zusammenarbeit mit der <a href="https://aha.ethz.ch/" target="_blank" rel="noopener">Professur für Architektur und Human Augmentation</a>, ETH Zürich, mit Prof. Kathrin Dörfler, Prof. Daniela Mitterberger und Dr. Lidia Atanasova, <a href="https://www.arc.ed.tum.de/en/df/teaching/projects/project-ma-ss-2026/" class="nb" target="_blank" rel="noopener">arc.ed.tum.de</a></span></li>
          <li><span class="j">2026</span><span class="w"><i>Actionable Repair: Multimodal AI for Situated Human–Robot Timber Repair</i>, Workshop, ROB|ARCH 2026, <a href="https://aarch.dk/" target="_blank" rel="noopener">Aarhus School of Architecture</a>, mit Begüm Saral und Dr. Avishek Das, <a href="https://robarch2026.org/workshop-04/" class="nb" target="_blank" rel="noopener">robarch2026.org</a></span></li>
          <li><span class="j">2026</span><span class="w"><i>Actionable Repair via Multimodal AI</i>, Workshop, Future of Construction Symposium, ETH Zürich, mit Begüm Saral sowie Laurence Crouzet, Adrian Pöllinger und Wen-Shan Cui von der <a href="https://www.langenberg.arch.ethz.ch/" target="_blank" rel="noopener">Professur für Konstruktionserbe und Denkmalpflege</a>, ETH Zürich, <a href="https://futureofconstruction.ethz.ch/programme/Workshops/workshop-2.html" class="nb" target="_blank" rel="noopener">futureofconstruction.ethz.ch</a></span></li>
        </ul>
      </section>
      <section class="cv-block">
        <h3>Publikationen / Vorträge</h3>
        <ul class="cv">
          <li><span class="j">2027</span><span class="w"><i>Mechanisms of Innovation Transfer: Patents and Spin-Offs within Architectural Research and Digital Fabrication</i>, mit Marcel Studer, Dominik Reisach und Silke Langenberg, in: Silke Langenberg, Robin Rehm und Sarah M. Schlachetzki (Hg.), <a href="https://d-nb.info/1421032422" target="_blank" rel="noopener"><i>Patents in Architecture: From Historical Construction to Digital Design</i></a>, ArchiTangle, Berlin, 2027 (erscheint)</span></li>
          <li><span class="j">2026</span><span class="w"><i>Harboring Histories</i>, mit Virginia Zaretskie, in: Ludger Hovestadt, Miro Roman, Adil Bokhari, Vera Bühlmann und Jorge Orozco (Hg.), <a href="https://birkhauser.com/en/book/9783035631494" target="_blank" rel="noopener"><i>Meteora. Mechanics of Architecture in an Intelligent World</i></a>, Birkhäuser, 2026, S. 312–319</span></li>
          <li><span class="j">2026</span><span class="w"><i>Translating Intention: AI-Assisted Model Generation for Collaborative Human–Robot Construction</i>, mit Avishek Das, Begüm Saral, Lidia Atanasova und Kathrin Dörfler, in Construction Robotics, <a href="https://doi.org/10.1007/s41693-026-00205-0" class="nb" target="_blank" rel="noopener">DOI 10.1007/s41693-026-00205-0</a></span></li>
          <li><span class="j">2025</span><span class="w"><i>The Architect as Toolmaker: AI as Instrument in Architectural Repair</i>, Future(s) of Educational Design Symposia, TUM Center for Educational Technologies</span></li>
          <li><span class="j">2025</span><span class="w"><i>From Structure to Action: Machine Reasoning and the Logics of Repair</i>, Masterarbeit, TUM School of Engineering and Design, publiziert via mediaTUM</span></li>
          <li><span class="j">2025</span><span class="w"><i>From Prototype to Product: Start-ups and Intellectual Property in Digital Fabrication</i>, mit Marcel Studer und Dominik Reisach, <a href="https://www.langenberg.arch.ethz.ch/" target="_blank" rel="noopener">Professur für Konstruktionserbe und Denkmalpflege</a> (Prof. Silke Langenberg), Startup Architecture Symposium, ETH Zürich</span></li>
          <li><span class="j">2025</span><span class="w"><i>From Material to Market: How Materiality Drives Innovation in Architectural Technologies</i>, mit Marcel Studer und Dominik Reisach, <a href="https://www.langenberg.arch.ethz.ch/" target="_blank" rel="noopener">Professur für Konstruktionserbe und Denkmalpflege</a> (Prof. Silke Langenberg), Architecture &amp; Patents Conference, ETH Zürich</span></li>
          <li><span class="j">2024</span><span class="w"><i>Die Neue Kapelle auf dem Waldfriedhof</i>, eingeladener Vortrag, Bürgerhaus Rhöndorf</span></li>
          <li><span class="j">2024</span><span class="w"><i>Den Erhalt der Kapelle unterstützen</i>, Gastbeitrag, <a href="https://honnef-heute.de/friedhofskapelle-stadt-in-der-verantwortung/" target="_blank" rel="noopener">Honnef Heute</a></span></li>
          <li><span class="j">2022</span><span class="w"><i>Die Waldfriedhofskapelle in Rhöndorf</i>, ISBN 978-3-00-071896-0</span></li>
        </ul>
      </section>
      <section class="cv-block">
        <h3>Mitgliedschaften</h3>
        <ul class="cv">
          <li><span class="j">seit 2026</span><span class="w"><b><a href="https://www.deutscher-werkbund.de/homepage/bayern/" target="_blank" rel="noopener">Deutscher Werkbund Bayern</a></b></span></li>
          <li><span class="j">seit 2026</span><span class="w"><b><a href="https://www.initiative-umbau.org/" target="_blank" rel="noopener">initiative.umbau Köln</a></b></span></li>
          <li><span class="j">seit 2025</span><span class="w"><b><a href="https://www.rheinischer-verein.de/" target="_blank" rel="noopener">Rheinischer Verein für Denkmalpflege und Landschaftsschutz</a></b></span></li>
          <li><span class="j">seit 2022</span><span class="w"><b><a href="https://www.gutenberghaus.org/" target="_blank" rel="noopener">Verein Gutenberghaus Bad Honnef e.V.</a></b></span></li>
          <li><span class="j">seit 2022</span><span class="w"><b><a href="https://www.rhoendorf.de/" target="_blank" rel="noopener">Rhöndorfer Bürger- und Ortsverein</a></b></span></li>
        </ul>
      </section>
    </div>`,
en:`
    <p class="bio">Many of the things we need are already there. They are all worth maintaining. Preserving buildings is a design task that never ends.<span class="nur-info"> It takes knowledge, tools and people who collaborate. Yet this is often exactly what is lacking. What could a society of repair look like? And how do we equip it with powerful instruments?<br><br>I design conversions and research repair and digital fabrication at TUM.</span></p>

    <div class="cv-raster">
      <section class="cv-block">
        <h3>Education</h3>
        <ul class="cv">
          <li><span class="j">2022–2025</span><span class="w"><b>TUM, Architecture M.A.</b>, Mentorship Program Computational Methods, graduated with high distinction</span></li>
          <li><span class="j">2023–2024</span><span class="w"><b>ETH Zurich, Architecture Master’s Program</b>, scholarship holder</span></li>
          <li><span class="j">2018–2021</span><span class="w"><b>TH Cologne, Architecture B.A.</b></span></li>
        </ul>
      </section>
      <section class="cv-block">
        <h3>Experience</h3>
        <ul class="cv">
          <li><span class="j">since 2026</span><span class="w"><b>Research associate</b>, <a href="https://www.arc.ed.tum.de/en/df/" target="_blank" rel="noopener">Professorship of Digital Fabrication</a>, TUM, within the <a href="https://www.mirmi.tum.de/en/mirmi/home/" target="_blank" rel="noopener">Munich Institute for Robotics and Machine Intelligence (MIRMI)</a> and at <a href="https://www.csail.mit.edu/" target="_blank" rel="noopener">MIT CSAIL</a>, Cambridge (US)</span></li>
          <li><span class="j">since 2026</span><span class="w"><b>Junior architect AKNW</b>, independent planning practice in Bad Honnef and Munich</span></li>
          <li><span class="j">2023–2026</span><span class="w"><b>Research assistant</b>, <a href="https://www.arc.ed.tum.de/en/df/" target="_blank" rel="noopener">Professorship of Digital Fabrication</a>, TUM</span></li>
          <li><span class="j">2023–2024</span><span class="w"><b>Research assistant</b>, <a href="https://gramaziokohler.arch.ethz.ch/" target="_blank" rel="noopener">Gramazio Kohler Research</a>, ITA, ETH Zurich</span></li>
          <li><span class="j">2021–2022</span><span class="w"><b>Project assistant</b>, <a href="https://www.maxundjakob.de/" target="_blank" rel="noopener">Atelier Max &amp; Jakob Giese</a>, Gehlert</span></li>
          <li><span class="j">2020–2021</span><span class="w"><b>Student vice-dean of architecture</b>, elected representative, TH Cologne</span></li>
          <li><span class="j">2019–2021</span><span class="w"><b>Tutor for design and construction</b>, Prof. Carola Wiese, TH Cologne</span></li>
          <li><span class="j">since 2016</span><span class="w"><b>Self-employed</b>, 3D printing and design</span></li>
        </ul>
      </section>
      <section class="cv-block">
        <h3>Teaching</h3>
        <ul class="cv">
          <li><span class="j">2026</span><span class="w"><i>Fritz-Pflaum-Hütte Renovation</i>, Master Studio, <a href="https://www.arc.ed.tum.de/en/df/" target="_blank" rel="noopener">Professorship of Digital Fabrication</a>, TUM, in collaboration with the <a href="https://aha.ethz.ch/" target="_blank" rel="noopener">Professorship of Architecture and Human Augmentation</a>, ETH Zurich, with Prof. Kathrin Dörfler, Prof. Daniela Mitterberger and Dr. Lidia Atanasova, <a href="https://www.arc.ed.tum.de/en/df/teaching/projects/project-ma-ss-2026/" class="nb" target="_blank" rel="noopener">arc.ed.tum.de</a></span></li>
          <li><span class="j">2026</span><span class="w"><i>Actionable Repair: Multimodal AI for Situated Human–Robot Timber Repair</i>, Workshop, ROB|ARCH 2026, <a href="https://aarch.dk/" target="_blank" rel="noopener">Aarhus School of Architecture</a>, with Begüm Saral and Dr. Avishek Das, <a href="https://robarch2026.org/workshop-04/" class="nb" target="_blank" rel="noopener">robarch2026.org</a></span></li>
          <li><span class="j">2026</span><span class="w"><i>Actionable Repair via Multimodal AI</i>, Workshop, Future of Construction Symposium, ETH Zurich, with Begüm Saral, and Laurence Crouzet, Adrian Pöllinger and Wen-Shan Cui of the <a href="https://www.langenberg.arch.ethz.ch/" target="_blank" rel="noopener">Professorship of Construction Heritage and Preservation</a>, ETH Zurich, <a href="https://futureofconstruction.ethz.ch/programme/Workshops/workshop-2.html" class="nb" target="_blank" rel="noopener">futureofconstruction.ethz.ch</a></span></li>
        </ul>
      </section>
      <section class="cv-block">
        <h3>Publications / Talks</h3>
        <ul class="cv">
          <li><span class="j">2027</span><span class="w"><i>Mechanisms of Innovation Transfer: Patents and Spin-Offs within Architectural Research and Digital Fabrication</i>, with Marcel Studer, Dominik Reisach and Silke Langenberg, in: Silke Langenberg, Robin Rehm and Sarah M. Schlachetzki (eds.), <a href="https://d-nb.info/1421032422" target="_blank" rel="noopener"><i>Patents in Architecture: From Historical Construction to Digital Design</i></a>, ArchiTangle, Berlin, 2027 (forthcoming)</span></li>
          <li><span class="j">2026</span><span class="w"><i>Harboring Histories</i>, with Virginia Zaretskie, in: Ludger Hovestadt, Miro Roman, Adil Bokhari, Vera Bühlmann and Jorge Orozco (eds.), <a href="https://birkhauser.com/en/book/9783035631494" target="_blank" rel="noopener"><i>Meteora. Mechanics of Architecture in an Intelligent World</i></a>, Birkhäuser, 2026, pp. 312–319</span></li>
          <li><span class="j">2026</span><span class="w"><i>Translating Intention: AI-Assisted Model Generation for Collaborative Human–Robot Construction</i>, with Avishek Das, Begüm Saral, Lidia Atanasova and Kathrin Dörfler, in Construction Robotics, <a href="https://doi.org/10.1007/s41693-026-00205-0" class="nb" target="_blank" rel="noopener">DOI 10.1007/s41693-026-00205-0</a></span></li>
          <li><span class="j">2025</span><span class="w"><i>The Architect as Toolmaker: AI as Instrument in Architectural Repair</i>, Future(s) of Educational Design Symposia, TUM Center for Educational Technologies</span></li>
          <li><span class="j">2025</span><span class="w"><i>From Structure to Action: Machine Reasoning and the Logics of Repair</i>, master's thesis, TUM School of Engineering and Design, published via mediaTUM</span></li>
          <li><span class="j">2025</span><span class="w"><i>From Prototype to Product: Start-ups and Intellectual Property in Digital Fabrication</i>, with Marcel Studer and Dominik Reisach, <a href="https://www.langenberg.arch.ethz.ch/" target="_blank" rel="noopener">Professorship of Construction Heritage and Preservation</a> (Prof. Silke Langenberg), Startup Architecture Symposium, ETH Zurich</span></li>
          <li><span class="j">2025</span><span class="w"><i>From Material to Market: How Materiality Drives Innovation in Architectural Technologies</i>, with Marcel Studer and Dominik Reisach, <a href="https://www.langenberg.arch.ethz.ch/" target="_blank" rel="noopener">Professorship of Construction Heritage and Preservation</a> (Prof. Silke Langenberg), Architecture &amp; Patents Conference, ETH Zurich</span></li>
          <li><span class="j">2024</span><span class="w"><i>The New Chapel at the Woodland Cemetery</i>, invited lecture, Bürgerhaus Rhöndorf</span></li>
          <li><span class="j">2024</span><span class="w"><i>Supporting the Preservation of the Chapel</i>, guest contribution, <a href="https://honnef-heute.de/friedhofskapelle-stadt-in-der-verantwortung/" target="_blank" rel="noopener">Honnef Heute</a></span></li>
          <li><span class="j">2022</span><span class="w"><i>Die Waldfriedhofskapelle in Rhöndorf</i>, ISBN 978-3-00-071896-0</span></li>
        </ul>
      </section>
      <section class="cv-block">
        <h3>Memberships</h3>
        <ul class="cv">
          <li><span class="j">since 2026</span><span class="w"><b><a href="https://www.deutscher-werkbund.de/homepage/bayern/" target="_blank" rel="noopener">Deutscher Werkbund Bayern</a></b></span></li>
          <li><span class="j">since 2026</span><span class="w"><b><a href="https://www.initiative-umbau.org/" target="_blank" rel="noopener">initiative.umbau Köln</a></b></span></li>
          <li><span class="j">since 2025</span><span class="w"><b><a href="https://www.rheinischer-verein.de/" target="_blank" rel="noopener">Rheinischer Verein für Denkmalpflege und Landschaftsschutz</a></b></span></li>
          <li><span class="j">since 2022</span><span class="w"><b><a href="https://www.gutenberghaus.org/" target="_blank" rel="noopener">Verein Gutenberghaus Bad Honnef e.V.</a></b></span></li>
          <li><span class="j">since 2022</span><span class="w"><b><a href="https://www.rhoendorf.de/" target="_blank" rel="noopener">Rhöndorfer Bürger- und Ortsverein</a></b></span></li>
        </ul>
      </section>
    </div>`
};
