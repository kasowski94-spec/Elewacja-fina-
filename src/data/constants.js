// ════════════ STAŁE APLIKACJI ════════════

export const THICK = [5,8,10,12,14,15,16,18,20,25,30];

export const WALL_LAMBDA = {
  cegla_pelna:0.77,
  pustak_ceram:0.45,
  beton_kom:0.12,
  zebet:2.0,
  cegla_silikat:0.70,
  inne:null,
};

export const EXTRAS_DEF = [
  {id:'skucie',lbl:'Skucie starych tynków',unit:'m²',qDef:350,pDef:12,hint:'robocizna + wywóz'},
  {id:'wyrownanie',lbl:'Wyrównanie ubytków w ścianie',unit:'m²',qDef:350,pDef:3,hint:'zaprawa naprawcza'},
  {id:'impreg',lbl:'Dodatkowa impregnacja podłoża',unit:'m²',qDef:350,pDef:5,hint:'preparat specjalistyczny'},
  {id:'odgrzyb',lbl:'Odgrzybienie / biocyd',unit:'m²',qDef:350,pDef:8,hint:'przed montażem'},
  {id:'wywoz',lbl:'Wywóz i utylizacja gruzu',unit:'m³',qDef:2,pDef:120,hint:'~0,5 m³ / 100 m²'},
  {id:'ruszt_ex',lbl:'Rusztowanie specjalne (balkon/wykusz)',unit:'kpl',qDef:1,pDef:800,hint:'koszt dodatkowy'},
];

export const FOAM_TYPES = {
  niskoprezna:{name:'Pianka niskoprężna (do okien/EPS)',price:18},
  uniwersalna:{name:'Pianka uniwersalna montażowa',price:14},
  pistoletowa:{name:'Pianka pistoletowa PRO',price:22},
  klej_piana:{name:'Klej-piana do styropianu',price:24},
  ognioodporna:{name:'Pianka ognioodporna B1',price:32},
};

export const PARAPET_DEFAULTS = {
  count:1, width:250, length:1200, bend:40,
  material:'blacha_ocynk', sheetW:1000, sheetL:2000, sheetPrice:72,
  bendsPer:2, bendCost:5, cutsPer:2, cutCost:4, laborPer:30,
};

export const SHEET_TYPES = {
  blacha_ocynk:{name:'Blacha ocynkowana 0,55mm',sheetPrice:72},
  blacha_powlek:{name:'Blacha powlekana 0,5mm',sheetPrice:98},
  blacha_tytan:{name:'Blacha tytan-cynk 0,7mm',sheetPrice:230},
  aluminium:{name:'Aluminium 0,7mm',sheetPrice:140},
  miedz:{name:'Miedź 0,6mm',sheetPrice:420},
};

export const PRICE_DEFS = [
  {id:'p_eps',lbl:'Styropian EPS (zł/m²/cm gr.)',def:1.30,hint:'15cm ≈ 26–30 zł/m²'},
  {id:'p_anchor',lbl:'Łącznik mech. (zł/szt.)',def:0.85,hint:''},
  {id:'p_cap',lbl:'Zaślepka łącznika (zł/szt.)',def:0.22,hint:'styropian/wełna'},
  {id:'p_adhesive',lbl:'Masa klejąca EPS (zł/kg)',def:1.70,hint:'25kg ≈ 42–48 zł'},
  {id:'p_meshkg',lbl:'Masa zbrojąca (zł/kg)',def:1.85,hint:'25kg ≈ 44–50 zł'},
  {id:'p_mesh',lbl:'Siatka zbrojąca (zł/m²)',def:3.50,hint:'145 g/m²'},
  {id:'p_plaster',lbl:'Tynk elewacyjny (zł/kg)',def:5.50,hint:'silikonowy'},
  {id:'p_primer',lbl:'Grunt pod tynk (zł/l)',def:11.0,hint:''},
  {id:'p_paint',lbl:'Farba elewacyjna (zł/l)',def:17.0,hint:''},
  {id:'p_starter',lbl:'Listwa startowa Al 2m (zł/szt.)',def:8.50,hint:''},
  {id:'p_corner',lbl:'Narożnik (zł/mb)',def:3.20,hint:'wg rodzaju'},
  {id:'p_winstrip',lbl:'Listwa przyokienna (zł/mb)',def:6.50,hint:''},
  {id:'p_flash',lbl:'Obróbka blacharska (zł/mb)',def:35.0,hint:''},
  {id:'p_dil',lbl:'Profil dylatacyjny (zł/mb)',def:14.0,hint:''},
  {id:'p_foil',lbl:'Folia okienna (zł/szt.)',def:4.50,hint:''},
  {id:'p_tapew',lbl:'Taśma uszczelniająca okn. (zł/mb)',def:3.50,hint:''},
  {id:'p_tapee',lbl:'Taśma rozprężna (zł/mb)',def:6.00,hint:''},
  {id:'p_tapeelew',lbl:'Taśma elewacyjna ochronna (zł/mb)',def:2.20,hint:''},
  {id:'p_tapemal',lbl:'Taśma malarska (zł/mb)',def:1.20,hint:''},
  {id:'p_primsub',lbl:'Grunt podłoża (zł/l)',def:12.0,hint:''},
  {id:'p_bond',lbl:'Masa sczepna (zł/kg lub l)',def:15.0,hint:''},
  {id:'p_labor',lbl:'Robocizna (zł/m²)',def:80.0,hint:'pełny ETICS'},
];

export const CORNER_MULT = {
  pvc_siatka:1.0, pvc:0.7, alu:1.6, kapinos:1.8, pcv_diag:2.2, siatka_pancerna:1.5,
};

export const SHOP_MULT = {
  'mega1000.pl':0.95,
  'styro24.pl':0.92,
  'Castorama/LM':1.18,
  'srednia':1.05,
  'posrednia':0.98,
  'reczne':1.0,
};

export const SHOP_LABELS = {
  'styro24.pl':'styro24.pl',
  'mega1000.pl':'mega1000.pl',
  'Castorama/LM':'Castorama/LM',
  'srednia':'Średnia rynkowa',
  'posrednia':'Opcja pośrednia',
  'reczne':'Ceny ręczne',
  'własna':'Cena własna',
};

export const PROJECT_SCHEMA_VER = 2;

export const CUSTOM_TABS = ['ustawienia','materialy','parapety','dodatki','lacze'];

export const TABS_ORDER = [
  'ustawienia','warianty','materialy','biblioteka','parapety',
  'dodatki','lacze','ceny','porownanie','wycena','rusztowanie',
];

// Mapowanie pól cen na pozycje z biblioteki materiałów / robocizny
export const PRICE_LIBRARY_MAP = {
  p_eps:{lib:'mat',ids:['eps_b_038_15','eps_g_033_15','eps_g_031_15','eps_b_040_15','eps_b_038_10','eps_g_033_10','eps_b_038_20','eps_g_033_20','wm_fasada_15'],
    transform:(it)=>{const m=it.id.match(/_(\d+)$/);const cm=m?parseInt(m[1],10):15;return{low:it.low/cm,avg:it.avg/cm,high:it.high/cm,note:'÷ '+cm+' cm = zł/m²/cm'};}},
  p_anchor:{lib:'mat',ids:['kolek_pcv_160','kolek_pcv_200','kolek_pcv_220','kolek_pcv_260','kolek_met_200','kolek_met_240','kolek_termo_200','kolek_termo_240']},
  p_cap:{lib:'mat',ids:['zasl_eps_b','zasl_eps_g','zasl_welna','zasl_eps_90']},
  p_adhesive:{lib:'mat',ids:['klej_eps_25','klej_uniw_25','klej_grafit_25'],transform:(it)=>({low:it.low/25,avg:it.avg/25,high:it.high/25,note:'÷ 25 kg = zł/kg'})},
  p_meshkg:{lib:'mat',ids:['klej_siatka_25','klej_uniw_25'],transform:(it)=>({low:it.low/25,avg:it.avg/25,high:it.high/25,note:'÷ 25 kg = zł/kg'})},
  p_mesh:{lib:'mat',ids:['siatka_145','siatka_160','siatka_panc']},
  p_plaster:{lib:'mat',ids:['tynk_sil_15','tynk_sil_20','tynk_silikat_15','tynk_min_20','tynk_akryl_15','tynk_mozaika'],transform:(it)=>({low:it.low/25,avg:it.avg/25,high:it.high/25,note:'worek 25 kg → zł/kg'})},
  p_primer:{lib:'mat',ids:['grunt_tynk'],transform:(it)=>({low:it.low/5,avg:it.avg/5,high:it.high/5,note:'kanister 5 l → zł/l'})},
  p_paint:{lib:'mat',ids:['farba_silik','farba_akryl'],transform:(it)=>({low:it.low/10,avg:it.avg/10,high:it.high/10,note:'wiadro 10 l → zł/l'})},
  p_starter:{lib:'mat',ids:['listwa_start']},
  p_corner:{lib:'mat',ids:['narozn_pcv','narozn_alu','narozn_kapinos'],transform:(it)=>({low:it.low/2.5,avg:it.avg/2.5,high:it.high/2.5,note:'profil 2,5 m → zł/mb'})},
  p_winstrip:{lib:'mat',ids:['listwa_okienna'],transform:(it)=>({low:it.low/2.4,avg:it.avg/2.4,high:it.high/2.4,note:'listwa 2,4 m → zł/mb'})},
  p_dil:{lib:'mat',ids:['profil_dylat'],transform:(it)=>({low:it.low/2.5,avg:it.avg/2.5,high:it.high/2.5,note:'profil 2,5 m → zł/mb'})},
  p_foil:{lib:'mat',ids:['folia_okno','folia_malar']},
  p_tapew:{lib:'mat',ids:['tasma_uszcz'],transform:(it)=>({low:it.low/8,avg:it.avg/8,high:it.high/8,note:'rolka 8 m → zł/mb'})},
  p_tapee:{lib:'mat',ids:['tasma_rozpr'],transform:(it)=>({low:it.low/8,avg:it.avg/8,high:it.high/8,note:'rolka 8 m → zł/mb'})},
  p_tapeelew:{lib:'mat',ids:['tasma_elew'],transform:(it)=>({low:it.low/50,avg:it.avg/50,high:it.high/50,note:'rolka 50 m → zł/mb'})},
  p_tapemal:{lib:'mat',ids:['tasma_malar'],transform:(it)=>({low:it.low/50,avg:it.avg/50,high:it.high/50,note:'rolka 50 m → zł/mb'})},
  p_primsub:{lib:'mat',ids:['grunt_gleb','grunt_szczep'],transform:(it)=>({low:it.low/5,avg:it.avg/5,high:it.high/5,note:'kanister 5 l → zł/l'})},
  p_bond:{lib:'mat',ids:['grunt_szczep'],transform:(it)=>({low:it.low/5,avg:it.avg/5,high:it.high/5,note:'kanister 5 l → zł/l'})},
  p_flash:{lib:'mat',ids:['blacha_ocynk','blacha_powlek','blacha_tytan'],transform:(it)=>({low:it.low/2,avg:it.avg/2,high:it.high/2,note:'arkusz 2 m² → zł/mb obróbki'})},
  p_labor:{lib:'rob',ids:['rob_komplet_styro','rob_komplet_welna','rob_eps_komplet','rob_tynk','rob_klej_eps','rob_kolk','rob_siatka','rob_malow']},
};

export const LABOR_TARGETS = {
  rob_komplet_styro:{target:'p_labor'},
  rob_komplet_welna:{target:'p_labor'},
  rob_eps_komplet:{target:'p_labor'},
  rob_skucie:{target:'ext_p_skucie'},
  rob_wyrown:{target:'ext_p_wyrownanie'},
  rob_grunt:{target:'ext_p_impreg'},
  rob_odgrzyb:{target:'ext_p_odgrzyb'},
  rob_klej_eps:{target:'p_labor'},
  rob_kolk:{target:'p_labor'},
  rob_siatka:{target:'p_labor'},
  rob_tynk:{target:'p_labor'},
  rob_malow:{target:'p_labor'},
  rob_parapet_mont:{target:'parapet_labor'},
  rob_giecie:{target:'parapet_bend'},
  rob_ciecie:{target:'parapet_cut'},
};

export const SUBTABS_MAP = {
  biblioteka:[
    {id:'mat',label:'Materiały',emoji:'🧱',type:'mode'},
    {id:'rob',label:'Robocizna',emoji:'👷',type:'mode'},
    {id:'fav',label:'Ulubione',emoji:'⭐',type:'mode'},
  ],
  wycena:[
    {id:'wys-body-eps',label:'EPS',emoji:'🧊',type:'anchor'},
    {id:'wys-body-kleje',label:'Kleje',emoji:'🧪',type:'anchor'},
    {id:'wys-body-tynk',label:'Tynk',emoji:'🎨',type:'anchor'},
    {id:'wys-body-lacze',label:'Łączniki',emoji:'🔩',type:'anchor'},
    {id:'wys-body-profile',label:'Profile',emoji:'📏',type:'anchor'},
    {id:'wys-body-parapety',label:'Parapety',emoji:'🪟',type:'anchor'},
    {id:'wys-body-tasmy',label:'Taśmy',emoji:'🩹',type:'anchor'},
    {id:'wys-body-labor',label:'Robocizna',emoji:'👷',type:'anchor'},
    {id:'wys-body-rusz',label:'Rusztowanie',emoji:'🏗',type:'anchor'},
    {id:'wys-body-prace',label:'Prace dod.',emoji:'🔧',type:'anchor'},
    {id:'wycena-summary',label:'Podsumowanie',emoji:'📊',type:'anchor'},
  ],
  ceny:[
    {id:'pricesGrid',label:'Ceny ręczne',emoji:'💰',type:'anchor'},
    {id:'laborLibList',label:'Robocizna z biblioteki',emoji:'👷',type:'anchor'},
    {id:'costSection',label:'Koszty wariantu',emoji:'📦',type:'anchor'},
    {id:'porownanie',label:'Porównanie hurtowni',emoji:'📊',type:'route'},
  ],
  warianty:[
    {id:'cardsContainer',label:'Karty wariantów',emoji:'📦',type:'anchor'},
    {id:'costTableBody',label:'Tabela kosztów',emoji:'📋',type:'anchor'},
  ],
  lacze:[
    {id:'anchorResult',label:'Kalkulator',emoji:'🧮',type:'anchor'},
    {id:'anchorTableBody',label:'Tabela długości',emoji:'📋',type:'anchor'},
    {id:'custom-lacze',label:'Własne pozycje',emoji:'➕',type:'anchor'},
  ],
};
