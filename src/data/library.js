// ═══════════════════════════════════════════════════════════
// ElewacjaPro — Biblioteka materiałów i robocizny
// Ceny orientacyjne netto, maj 2026
// Źródła: styro24.pl, mega1000.pl, atlas.com.pl, weber.saint-gobain.pl,
//         ceresit.pl, baumit.pl, isover.pl, rockwool.com/pl
// ═══════════════════════════════════════════════════════════

export const LIBRARY_DATE = '2026-05-25';

// ─── BIBLIOTEKA MATERIAŁÓW ────────────────────────────────
// Ceny netto (bez VAT). VAT: materiały budowlane 8%, mat. wykończ. 23%.
// low = najtańsza hurtownia | avg = średnia rynkowa | high = markowy producent
export const MATERIAL_LIBRARY = [

  // ── STYROPIAN EPS ──────────────────────────────────────
  {id:'eps_b_038_10',cat:'styropian',name:'Styropian EPS 70-038 biały 10cm',unit:'m²',low:15,avg:18,high:22,lambda:0.038,note:''},
  {id:'eps_b_038_12',cat:'styropian',name:'Styropian EPS 70-038 biały 12cm',unit:'m²',low:18,avg:21,high:25,lambda:0.038,note:''},
  {id:'eps_b_038_15',cat:'styropian',name:'Styropian EPS 70-038 biały 15cm',unit:'m²',low:22,avg:26,high:30,lambda:0.038,note:'standard fasadowy'},
  {id:'eps_b_040_15',cat:'styropian',name:'Styropian EPS 70-040 biały 15cm',unit:'m²',low:19,avg:23,high:27,lambda:0.040,note:'ekonomiczny'},
  {id:'eps_b_038_20',cat:'styropian',name:'Styropian EPS 70-038 biały 20cm',unit:'m²',low:30,avg:34,high:39,lambda:0.038,note:''},
  {id:'eps_b_038_25',cat:'styropian',name:'Styropian EPS 70-038 biały 25cm',unit:'m²',low:37,avg:43,high:50,lambda:0.038,note:''},
  {id:'eps_g_033_10',cat:'styropian',name:'Styropian grafitowy 033 10cm',unit:'m²',low:19,avg:22,high:26,lambda:0.033,note:''},
  {id:'eps_g_033_12',cat:'styropian',name:'Styropian grafitowy 033 12cm',unit:'m²',low:22,avg:26,high:31,lambda:0.033,note:''},
  {id:'eps_g_033_15',cat:'styropian',name:'Styropian grafitowy 033 15cm',unit:'m²',low:27,avg:31,high:36,lambda:0.033,note:'Lambda Plus'},
  {id:'eps_g_031_15',cat:'styropian',name:'Styropian grafitowy 031 premium 15cm',unit:'m²',low:32,avg:37,high:43,lambda:0.031,note:'Lambda White/Max'},
  {id:'eps_g_033_20',cat:'styropian',name:'Styropian grafitowy 033 20cm',unit:'m²',low:37,avg:42,high:48,lambda:0.033,note:''},
  {id:'eps_g_033_25',cat:'styropian',name:'Styropian grafitowy 033 25cm',unit:'m²',low:46,avg:53,high:62,lambda:0.033,note:''},
  {id:'wm_fasada_10',cat:'styropian',name:'Wełna mineralna fasadowa 10cm',unit:'m²',low:40,avg:50,high:65,lambda:0.036,note:'niepalna, paroprzepuszczalna'},
  {id:'wm_fasada_15',cat:'styropian',name:'Wełna mineralna fasadowa 15cm',unit:'m²',low:55,avg:68,high:85,lambda:0.036,note:'niepalna, paroprzepuszczalna'},
  {id:'wm_fasada_20',cat:'styropian',name:'Wełna mineralna fasadowa 20cm',unit:'m²',low:72,avg:90,high:115,lambda:0.036,note:'gruba izolacja'},

  // ── KLEJE I MASY ────────────────────────────────────────
  {id:'klej_eps_25',cat:'kleje',name:'Klej do styropianu 25kg',unit:'worek',low:36,avg:44,high:54,note:'~5 m²/worek (Atlas, Ceresit, Weber)'},
  {id:'klej_siatka_25',cat:'kleje',name:'Klej do siatki zbrojącej 25kg',unit:'worek',low:40,avg:49,high:61,note:'~3 m²/worek'},
  {id:'klej_uniw_25',cat:'kleje',name:'Klej uniwersalny EPS+siatka 25kg',unit:'worek',low:38,avg:47,high:57,note:'2w1, np. Atlas Rocker 2w1'},
  {id:'klej_grafit_25',cat:'kleje',name:'Klej do EPS grafitowego 25kg',unit:'worek',low:46,avg:55,high:66,note:'Baumit StarContact/Atlas Rocker N'},
  {id:'zaprawa_naprawcza',cat:'kleje',name:'Zaprawa naprawcza/wyrównawcza 25kg',unit:'worek',low:28,avg:36,high:46,note:'ubytki i nierówności podłoża'},
  {id:'masa_wyrown_25',cat:'kleje',name:'Masa wyrównawcza podkładowa 25kg',unit:'worek',low:42,avg:52,high:65,note:'gruba warstwa > 10mm'},
  {id:'klej_piana_eps',cat:'kleje',name:'Klej-piana do EPS 750ml',unit:'szt',low:18,avg:24,high:32,note:'szybkie klejenie, np. Henkel Soudabond'},

  // ── SIATKI ZBROJĄCE ─────────────────────────────────────
  {id:'siatka_145',cat:'siatki',name:'Siatka zbrojąca 145 g/m²',unit:'m²',low:2.6,avg:3.3,high:4.5,note:'standard ETICS, oka 4×4 mm'},
  {id:'siatka_160',cat:'siatki',name:'Siatka zbrojąca 160 g/m²',unit:'m²',low:3.2,avg:4.0,high:5.2,note:'wzmocniona'},
  {id:'siatka_panc',cat:'siatki',name:'Siatka pancerna 330 g/m²',unit:'m²',low:7.5,avg:10.5,high:14,note:'parter, cokół, strefy ryzyka'},
  {id:'siatka_diag',cat:'siatki',name:'Siatka narożna diagonalna 45° 0,5×1m',unit:'szt',low:0.8,avg:1.3,high:2.0,note:'zbrojenie naroży otworów'},

  // ── TYNKI ELEWACYJNE ────────────────────────────────────
  {id:'tynk_sil_15',cat:'tynki',name:'Tynk silikonowy 1,5mm 25kg',unit:'worek',low:112,avg:142,high:185,note:'~3,2 kg/m² (Caparol, Weber, Baumit)'},
  {id:'tynk_sil_20',cat:'tynki',name:'Tynk silikonowy 2,0mm 25kg',unit:'worek',low:118,avg:148,high:188,note:'~4,0 kg/m²'},
  {id:'tynk_silikat_15',cat:'tynki',name:'Tynk silikatowy 1,5mm 25kg',unit:'worek',low:92,avg:118,high:152,note:'~3,0 kg/m², paroprzepuszczalny'},
  {id:'tynk_silikatsil_15',cat:'tynki',name:'Tynk silikonowo-silikatowy 1,5mm 25kg',unit:'worek',low:122,avg:155,high:198,note:'hybryda, odporny na zabrudzenia'},
  {id:'tynk_min_20',cat:'tynki',name:'Tynk mineralny 2,0mm 25kg',unit:'worek',low:50,avg:68,high:92,note:'~3,8 kg/m², do malowania'},
  {id:'tynk_akryl_15',cat:'tynki',name:'Tynk akrylowy 1,5mm 25kg',unit:'worek',low:86,avg:112,high:148,note:'~2,8 kg/m²'},
  {id:'tynk_baranek_sil',cat:'tynki',name:'Tynk silikonowy baranek 2,0mm 25kg',unit:'worek',low:115,avg:148,high:190,note:'faktura pociągana'},
  {id:'tynk_mozaika',cat:'tynki',name:'Tynk mozaikowy 25kg',unit:'worek',low:132,avg:170,high:225,note:'cokół, ścianki balkonowe'},

  // ── GRUNTY I FARBY ──────────────────────────────────────
  {id:'grunt_tynk',cat:'grunty',name:'Grunt podtynkowy kwarcowy 5l',unit:'szt',low:42,avg:55,high:72,note:'~0,15 l/m², pod tynk strukturalny'},
  {id:'grunt_gleb',cat:'grunty',name:'Grunt głębokopenetrujący 5l',unit:'szt',low:33,avg:45,high:60,note:'chłonne podłoża'},
  {id:'grunt_szczep',cat:'grunty',name:'Grunt sczepny / kontaktowy 5l',unit:'szt',low:50,avg:68,high:90,note:'podłoża gładkie, beton'},
  {id:'grunt_kwarc',cat:'grunty',name:'Grunt tynkarski z kwarcem 5l',unit:'szt',low:48,avg:62,high:78,note:'poprawia przyczepność tynku'},
  {id:'farba_silik',cat:'grunty',name:'Farba elewacyjna silikonowa 10l',unit:'szt',low:132,avg:172,high:232,note:'~0,15 l/m²/warstwa'},
  {id:'farba_akryl',cat:'grunty',name:'Farba elewacyjna akrylowa 10l',unit:'szt',low:90,avg:126,high:170,note:'ekonomiczna'},
  {id:'farba_silikat',cat:'grunty',name:'Farba elewacyjna silikatowa 10l',unit:'szt',low:118,avg:152,high:198,note:'mineralna, paroprzepuszczalna'},
  {id:'prep_grzyb',cat:'grunty',name:'Preparat grzybobójczy / biocyd 5l',unit:'szt',low:36,avg:50,high:70,note:'algicyd przed remontem i pod tynk'},
  {id:'prep_hydrofob',cat:'grunty',name:'Impregnat hydrofobowy do tynków 5l',unit:'szt',low:55,avg:75,high:105,note:'ochrona tynku mineralnego'},

  // ── ŁĄCZNIKI / KOŁKI ────────────────────────────────────
  {id:'kolek_pcv_90',cat:'laczniki',name:'Łącznik wbijany PCV 90mm',unit:'szt',low:0.30,avg:0.40,high:0.55,note:'EPS do 4cm (np. Ejot, Koelner)'},
  {id:'kolek_pcv_120',cat:'laczniki',name:'Łącznik wbijany PCV 120mm',unit:'szt',low:0.40,avg:0.52,high:0.70,note:'EPS 6–7cm'},
  {id:'kolek_pcv_140',cat:'laczniki',name:'Łącznik wbijany PCV 140mm',unit:'szt',low:0.45,avg:0.60,high:0.80,note:'EPS 8–9cm'},
  {id:'kolek_pcv_160',cat:'laczniki',name:'Łącznik wbijany PCV 160mm',unit:'szt',low:0.52,avg:0.68,high:0.90,note:'EPS 10–11cm'},
  {id:'kolek_pcv_180',cat:'laczniki',name:'Łącznik wbijany PCV 180mm',unit:'szt',low:0.60,avg:0.78,high:1.02,note:'EPS 12cm'},
  {id:'kolek_pcv_200',cat:'laczniki',name:'Łącznik wbijany PCV 200mm',unit:'szt',low:0.68,avg:0.88,high:1.15,note:'EPS 14–15cm'},
  {id:'kolek_pcv_220',cat:'laczniki',name:'Łącznik wbijany PCV 220mm',unit:'szt',low:0.78,avg:1.00,high:1.30,note:'EPS 16cm'},
  {id:'kolek_pcv_260',cat:'laczniki',name:'Łącznik wbijany PCV 260mm',unit:'szt',low:0.92,avg:1.18,high:1.55,note:'EPS 20cm'},
  {id:'kolek_met_160',cat:'laczniki',name:'Łącznik wkręcany metalowy 160mm',unit:'szt',low:0.82,avg:1.08,high:1.42,note:'EPS 10cm, wełna (np. Hilti, Ejot)'},
  {id:'kolek_met_200',cat:'laczniki',name:'Łącznik wkręcany metalowy 200mm',unit:'szt',low:1.02,avg:1.32,high:1.72,note:'EPS 15cm, wełna'},
  {id:'kolek_met_240',cat:'laczniki',name:'Łącznik wkręcany metalowy 240mm',unit:'szt',low:1.28,avg:1.62,high:2.08,note:'EPS 18–20cm'},
  {id:'kolek_termo_200',cat:'laczniki',name:'Łącznik z wkładką termiczną 200mm',unit:'szt',low:1.18,avg:1.48,high:1.92,note:'bez mostków termicznych, EPS 15cm'},
  {id:'kolek_termo_240',cat:'laczniki',name:'Łącznik z wkładką termiczną 240mm',unit:'szt',low:1.42,avg:1.78,high:2.28,note:'bez mostków, EPS 20cm'},
  {id:'kolek_powiek',cat:'laczniki',name:'Kołek rozporowy do pustaków 200mm',unit:'szt',low:0.55,avg:0.72,high:0.95,note:'pustaki ceramiczne, beton kom.'},

  // ── ZAŚLEPKI ────────────────────────────────────────────
  {id:'zasl_eps_b',cat:'zaslepki',name:'Zaślepka styropianowa biała Ø60mm',unit:'szt',low:0.12,avg:0.18,high:0.28,note:'maskuje głowicę łącznika'},
  {id:'zasl_eps_g',cat:'zaslepki',name:'Zaślepka styropianowa grafitowa Ø60mm',unit:'szt',low:0.15,avg:0.22,high:0.32,note:'do EPS grafitowego'},
  {id:'zasl_welna',cat:'zaslepki',name:'Zaślepka z wełny mineralnej Ø60mm',unit:'szt',low:0.18,avg:0.26,high:0.38,note:'niepalna, klasa A'},
  {id:'zasl_eps_90',cat:'zaslepki',name:'Zaślepka styropianowa Ø90mm',unit:'szt',low:0.22,avg:0.32,high:0.45,note:'do łącznika z dużym talerzem'},

  // ── PROFILE I LISTWY ────────────────────────────────────
  {id:'listwa_start',cat:'profile',name:'Listwa startowa aluminiowa 2m',unit:'szt',low:7,avg:9,high:13,note:'cokół, AL 1,2mm'},
  {id:'listwa_start_pcv',cat:'profile',name:'Listwa startowa PVC 2m',unit:'szt',low:4.5,avg:6.5,high:9,note:'ekonomiczna'},
  {id:'narozn_pcv',cat:'profile',name:'Narożnik PVC z siatką 2,5m',unit:'szt',low:2.5,avg:3.5,high:5.0,note:'ochrona naroży zewnętrznych'},
  {id:'narozn_alu',cat:'profile',name:'Narożnik aluminiowy z siatką 2,5m',unit:'szt',low:5,avg:7,high:10,note:'wytrzymały, AL'},
  {id:'narozn_kapinos',cat:'profile',name:'Narożnik z kapinosem 2m',unit:'szt',low:8,avg:11,high:15,note:'okapnik, odprowadza wodę'},
  {id:'listwa_okienna',cat:'profile',name:'Listwa przyokienna z uszczelką 2,4m',unit:'szt',low:9,avg:13,high:18,note:'dylatacja przy oknie/drzwiach'},
  {id:'profil_dylat',cat:'profile',name:'Profil dylatacyjny PVC 2,5m',unit:'szt',low:12,avg:17,high:24,note:'szczeliny dylatacyjne budynku'},
  {id:'listwa_kapinos',cat:'profile',name:'Listwa okapnikowa 2m',unit:'szt',low:7,avg:10,high:14,note:'gzymsy, parapety, attyki'},
  {id:'profil_cok_siatka',cat:'profile',name:'Profil cokołowy z siatką 2m',unit:'szt',low:9,avg:13,high:18,note:'wykończenie dolnej krawędzi EPS'},
  {id:'profil_okapowy',cat:'profile',name:'Profil okapowy EPS 2m',unit:'szt',low:6,avg:8.5,high:12,note:'krawędź sufitu podbitki'},
  {id:'sznur_dylat',cat:'profile',name:'Sznur dylatacyjny PE Ø10mm 50m',unit:'szt',low:22,avg:32,high:45,note:'wypełnienie szczeliny dyl.'},
  {id:'silikon_elew',cat:'profile',name:'Silikon elewacyjny 310ml',unit:'szt',low:12,avg:17,high:25,note:'uszczelnienie detali i styków'},

  // ── TAŚMY I FOLIE ───────────────────────────────────────
  {id:'tasma_uszcz',cat:'tasmy',name:'Taśma uszczelniająca rozprężna 8m',unit:'szt',low:22,avg:30,high:42,note:'styk okno–EPS (ISO-Chemie, Tremco)'},
  {id:'tasma_rozpr',cat:'tasmy',name:'Taśma rozprężna paroizolacyjna 8m',unit:'szt',low:35,avg:48,high:65,note:'strefa wewnętrzna, pod parapet'},
  {id:'tasma_elew',cat:'tasmy',name:'Taśma elewacyjna ochronna 50m',unit:'szt',low:14,avg:20,high:28,note:'krawędzie i narożniki EPS'},
  {id:'tasma_malar',cat:'tasmy',name:'Taśma malarska 50m',unit:'szt',low:6,avg:9,high:14,note:'maskowanie przy tynkowaniu'},
  {id:'tasma_paroprzep',cat:'tasmy',name:'Taśma paroprzepuszczalna 60mm 25mb',unit:'szt',low:18,avg:26,high:38,note:'uszczelnienie zewnętrzne okna'},
  {id:'folia_okno',cat:'tasmy',name:'Folia ochronna na okna samoprzylepna',unit:'szt',low:3,avg:4.5,high:7,note:'ochrona szyb i ościeżnic'},
  {id:'folia_malar',cat:'tasmy',name:'Folia malarska ochronna 4×5m',unit:'szt',low:8,avg:12,high:18,note:'zabezpieczenie posadzek i nawierzchni'},

  // ── PIANKI MONTAŻOWE ────────────────────────────────────
  {id:'piana_nisko',cat:'pianki',name:'Pianka niskoprężna do okien 750ml',unit:'szt',low:14,avg:19,high:26,note:'do ościeży okiennych'},
  {id:'piana_uniw',cat:'pianki',name:'Pianka montażowa uniwersalna 750ml',unit:'szt',low:10,avg:14,high:20,note:'ogólnego stosowania'},
  {id:'piana_pist',cat:'pianki',name:'Pianka pistoletowa PRO 750ml',unit:'szt',low:16,avg:22,high:30,note:'precyzyjna, do pistoletu'},
  {id:'klej_piana',cat:'pianki',name:'Klej-piana do styropianu 750ml',unit:'szt',low:18,avg:24,high:32,note:'szybkie klejenie płyt EPS'},
  {id:'piana_ogn',cat:'pianki',name:'Pianka ognioodporna B1 750ml',unit:'szt',low:24,avg:32,high:44,note:'p.poż, klasa odporności B1'},

  // ── PARAPETY I BLACHA ───────────────────────────────────
  {id:'blacha_ocynk',cat:'parapety',name:'Arkusz blachy ocynkowanej 1×2m 0,55mm',unit:'ark',low:52,avg:70,high:92,note:'2 m²/ark, cynk ogniowy'},
  {id:'blacha_powlek',cat:'parapety',name:'Arkusz blachy powlekanej 1×2m 0,5mm',unit:'ark',low:72,avg:95,high:128,note:'kolor, 2 m², RAL dowolny'},
  {id:'blacha_tytan',cat:'parapety',name:'Arkusz blachy tytan-cynk 1×2m 0,7mm',unit:'ark',low:175,avg:225,high:295,note:'premium, 2 m² (Rheinzink, VM Zinc)'},
  {id:'parapet_pcv',cat:'parapety',name:'Parapet zewnętrzny PVC 1mb',unit:'mb',low:16,avg:24,high:36,note:'gotowy, biały, szer. 20–30cm'},
  {id:'parapet_alu',cat:'parapety',name:'Parapet zewnętrzny aluminiowy 1mb',unit:'mb',low:26,avg:38,high:55,note:'gotowy, anodowany/lakierowany'},
  {id:'parapet_blacha_mb',cat:'parapety',name:'Parapet z blachy powlekanej 1mb',unit:'mb',low:32,avg:45,high:62,note:'na wymiar, szerokość 20–35cm'},
  {id:'obrobka_atty',cat:'parapety',name:'Obróbka attyki / ogniomuru 1mb',unit:'mb',low:35,avg:52,high:78,note:'blacha na wymiar, złożona'},
];

// ─── BIBLIOTEKA ROBOCIZNY ─────────────────────────────────
export const LABOR_LIBRARY = [

  // ── PRACE PRZYGOTOWAWCZE ────────────────────────────────
  {id:'rob_skucie',cat:'przygotowanie',name:'Skucie starego tynku',unit:'m²',low:14,avg:20,high:32,note:'z wywozem gruzu'},
  {id:'rob_mycie',cat:'przygotowanie',name:'Mycie ciśnieniowe elewacji',unit:'m²',low:5,avg:8,high:13,note:'myjką 150 bar, przed ETICS'},
  {id:'rob_odgrzyb',cat:'przygotowanie',name:'Aplikacja preparatu grzybobójczego',unit:'m²',low:6,avg:10,high:16,note:'biocyd, 2 warstwy, czas schnięcia'},
  {id:'rob_grunt',cat:'przygotowanie',name:'Gruntowanie podłoża',unit:'m²',low:4,avg:6,high:10,note:'1 warstwa gruntu penetrującego'},
  {id:'rob_wyrown',cat:'przygotowanie',name:'Wyrównanie ubytków ściany',unit:'m²',low:8,avg:14,high:25,note:'zaprawa naprawcza, do 2cm'},
  {id:'rob_demont_par',cat:'przygotowanie',name:'Demontaż starych parapetów',unit:'szt',low:12,avg:18,high:28,note:'z utylizacją'},

  // ── MONTAŻ OCIEPLENIA ───────────────────────────────────
  {id:'rob_klej_eps',cat:'ocieplenie',name:'Klejenie styropianu',unit:'m²',low:18,avg:25,high:35,note:'sam montaż płyt EPS'},
  {id:'rob_kolk',cat:'ocieplenie',name:'Kołkowanie styropianu',unit:'m²',low:6,avg:9,high:14,note:'wiercenie + osadzanie łączników'},
  {id:'rob_siatka',cat:'ocieplenie',name:'Zatapianie siatki (warstwa zbrojna)',unit:'m²',low:16,avg:22,high:30,note:'klej + siatka + zacieranie'},
  {id:'rob_eps_komplet',cat:'ocieplenie',name:'Ocieplenie kompletne (klej+kołki+siatka)',unit:'m²',low:38,avg:52,high:70,note:'bez tynku i rusztowania'},
  {id:'rob_welna',cat:'ocieplenie',name:'Montaż wełny mineralnej (komplet)',unit:'m²',low:58,avg:78,high:105,note:'cięższy montaż, klejenie+kołkowanie'},
  {id:'rob_szlif',cat:'ocieplenie',name:'Szlifowanie styropianu',unit:'m²',low:4,avg:7,high:12,note:'pac styropianowa, wyrównanie'},

  // ── WYKOŃCZENIE / TYNK ──────────────────────────────────
  {id:'rob_gruntu_tynk',cat:'wykonczenie',name:'Gruntowanie pod tynk',unit:'m²',low:3,avg:5,high:8,note:'grunt kwarcowy'},
  {id:'rob_tynk',cat:'wykonczenie',name:'Tynkowanie cienkowarstwowe',unit:'m²',low:26,avg:40,high:58,note:'nakładanie + zacieranie lub ciągnięcie'},
  {id:'rob_tynk_mozaika',cat:'wykonczenie',name:'Tynk mozaikowy (cokół)',unit:'m²',low:32,avg:48,high:68,note:'dokładne zacieranie, dekoracyjny'},
  {id:'rob_malow',cat:'wykonczenie',name:'Malowanie elewacji',unit:'m²',low:10,avg:16,high:25,note:'2 warstwy farby elewacyjnej'},
  {id:'rob_hydrofob',cat:'wykonczenie',name:'Aplikacja impregnatu hydrofobowego',unit:'m²',low:5,avg:8,high:14,note:'ochrona tynku mineralnego'},

  // ── USŁUGI KOMPLEKSOWE ──────────────────────────────────
  {id:'rob_komplet_styro',cat:'kompleksowe',name:'Ocieplenie + tynk (komplet EPS)',unit:'m²',low:80,avg:108,high:148,note:'pełen zakres ETICS bez ruszto.'},
  {id:'rob_komplet_welna',cat:'kompleksowe',name:'Ocieplenie + tynk (komplet wełna)',unit:'m²',low:105,avg:138,high:178,note:'pełen zakres ETICS, wełna'},
  {id:'rob_renowacja',cat:'kompleksowe',name:'Renowacja starej elewacji (bez skucia)',unit:'m²',low:55,avg:78,high:110,note:'mycie + biocyd + grunt + tynk'},

  // ── DETALE I OBRÓBKI ────────────────────────────────────
  {id:'rob_parapet_mont',cat:'detale',name:'Montaż parapetu zewnętrznego',unit:'szt',low:20,avg:32,high:52,note:'wbudowanie, uszczelnienie'},
  {id:'rob_oscieza',cat:'detale',name:'Obrobienie ościeży okiennych',unit:'mb',low:16,avg:26,high:42,note:'docieplenie + listwa + uszcz.'},
  {id:'rob_naroznik',cat:'detale',name:'Montaż narożników i listew',unit:'mb',low:5,avg:8,high:14,note:'narożniki PVC/AL, listwy'},
  {id:'rob_dylatacja',cat:'detale',name:'Wykonanie dylatacji',unit:'mb',low:10,avg:16,high:25,note:'sznur + profil dylatacyjny'},
  {id:'rob_giecie',cat:'detale',name:'Gięcie blachy (parapet/obróbka)',unit:'szt',low:3,avg:5,high:9,note:'cena za 1 gięcie na giętarce'},
  {id:'rob_ciecie',cat:'detale',name:'Cięcie blachy',unit:'szt',low:2,avg:4,high:7,note:'cena za 1 cięcie'},
  {id:'rob_obrobka_bl',cat:'detale',name:'Montaż obróbek blacharskich',unit:'mb',low:20,avg:30,high:48,note:'ogniomury, attyki, gzymsy'},

  // ── RUSZTOWANIE ─────────────────────────────────────────
  {id:'rob_rusz_mont',cat:'rusztowanie',name:'Montaż + demontaż rusztowania',unit:'m²',low:9,avg:13,high:22,note:'cena za m² elewacji (jednorazowo)'},
  {id:'rob_rusz_dzierz',cat:'rusztowanie',name:'Dzierżawa rusztowania (miesiąc)',unit:'m²',low:5.5,avg:8.5,high:15,note:'za m²/miesiąc'},
];

export const MAT_CATEGORIES = {
  styropian: 'Styropian / izolacja',
  kleje:     'Kleje i masy',
  siatki:    'Siatki zbrojące',
  tynki:     'Tynki elewacyjne',
  grunty:    'Grunty i farby',
  laczniki:  'Łączniki / kołki',
  zaslepki:  'Zaślepki łączników',
  profile:   'Profile i listwy',
  tasmy:     'Taśmy i folie',
  pianki:    'Pianki montażowe',
  parapety:  'Parapety i blacha',
};

export const LABOR_CATEGORIES = {
  przygotowanie: 'Prace przygotowawcze',
  ocieplenie:    'Montaż ocieplenia',
  wykonczenie:   'Wykończenie / tynk',
  kompleksowe:   'Usługi kompleksowe',
  detale:        'Detale i obróbki',
  rusztowanie:   'Rusztowanie',
};

export const COMMON_ITEMS = [
  'Styropian elewacyjny','Klej do styropianu','Klej do siatki','Siatka zbrojąca',
  'Łączniki / kołki','Zaślepki łączników','Listwa startowa','Narożniki PVC',
  'Listwa przyokienna','Grunt podtynkowy','Tynk elewacyjny','Farba elewacyjna',
  'Taśma uszczelniająca','Taśma rozprężna','Pianka montażowa','Folia ochronna',
  'Parapety zewnętrzne','Profil dylatacyjny','Siatka pancerna (cokół)',
  'Zaprawa wyrównawcza','Narożnik z kapinosem','Grunt głębokopenetrujący',
  'Rusztowanie elewacyjne','Klej-piana do EPS','Silikon elewacyjny',
  'Preparat grzybobójczy','Farba silikatowa','Tynk silikonowo-silikatowy',
  'Wełna mineralna fasadowa','Obróbka attyki','Folia malarska',
];
