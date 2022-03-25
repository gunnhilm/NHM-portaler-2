<html>
<head>
  <title>Barcoded fungi in NorBOL</title>
  <link rel="stylesheet" type="text/css" href="http://nhm2.uio.no/lav/web/LavStyle.css" />
  
  <script language="javascript">
  function vis(tekst)
  {
    fulltekst = tekst + "<p><input type=button value=Close onClick=\"javascript:window.close()\">"
	w = window.open()
	w.document.write(fulltekst)
  }
</script>

  
</head>

<body>
<h2>Barcoded fungi in NorBOL</h2>

<?php
#echo "<h3>".date("Y-m-d")."</h3>";
echo "<h4>"."Last update 10.8.2021"."</h4>";

$stativene = array();  # Stativene som er samplet eller klare for sampling, men uten resultat i fasta.fas. CCDB-nummeret

$sp      = $_GET['sp'];
$pfx     = $_GET['pfx'];   if (! $pfx) {$pfx = 'O-F-';}
$pr      = $_GET['pr'];
$gui     = $_GET['gui'];
$fullgui = $pfx.$gui;
$full    = $_GET['full'];
$okN     = $_GET['okN'];
$ok0     = $_GET['ok0'];
$ok1     = $_GET['ok1'];
$ok2     = $_GET['ok2'];

#if ($okN == '' && $ok0 == '' && $ok1 == '' && $ok2 == '') {
#  $okN = '1'; $ok0 = '1'; $ok1 = '1'; $ok2 = '1';
#}
#else {$okTest = '1';}
if ($okN == '1' || $ok0 == '1' || $ok1 == '1' || $ok2 == '1') {$okTest = '1';}

#if (preg_match('/aceae$/', $sp)) { # Søker etter familie
#if ($sp == 'Acarosporaceae') {$sp = 'Acarosporaceae|Acarospora|Glypholecia|Lithoglypha|Pleopsidium|Polysporina|Sarcogyne|Thelocarpella';}
#elseif ($sp == 'Acrospermaceae') {$sp = 'Acrospermaceae|Acrospermum|Oomyces';}
#elseif ($sp == 'Adelococcaceae') {$sp = 'Adelococcaceae|Adelococcus|Sagediopsis';}
#else {$sp = 'Not found';}
#}

if ($gui && $full < 1) {$full = 1;}   # Kun "full data"-view når søkes etter enkelteksemplar

if ($full == "1") {
  $checked_1= "checked";
  echo "<h3>Barcoded fungi at the Natural History Museum, University of Oslo</h3>\n";
} 
elseif ($full == "2") {
  $checked_2= "checked";
  echo "<h3>Barcoded fungi at the Natural History Museum, University of Oslo</h3>\n";
} 
else {
  $checked_0 = "checked";
}

$addSp   = $_GET['addSp'];  if ($addSp) {$checked_Add = 'checked';} else {$checked_Add = '';}

echo "<form action=nobas.php method=get>\n";
echo "<br>Taxon:&nbsp; &nbsp; &nbsp; <input type=text name=sp value=\"$sp\">\n";
#echo "<br>Specimen: <input type=text name=pfx value=\"$pfx\" size=4> <input type=text name=gui value=\"$gui\">\n";

/*
if ($pr == 'lecideoid') {
  echo "<br>Project: <select name=\"pr\">\n<option> \n<option selected>lecideoid\n<option>redlist\n<option>macrolichens\n<option>all\n</select>\n";
  $prSlekter = 'Adelolecia|Ainoa|Amygdalaria|Arthrosporum|Bacidia|Bacidina|Bactrospora|Bellemerea|Biatora|Bilimbia|Byssoloma|Calvitimela|Carbonea|Catillaria|Catinaria|Catolechia|Cecidonia|Claurouxia|Clauzadea|Clauzadeana|Cliostomum|Elixia|Epilichen|Farnoldia|Fellhanera|Fellhaneropsis|Frutidella|Fuscidea|Helocarpon|Hertelidea|Hypocenomyce|Immersaria|Japewia|Koerberiella|Lecidea|Lecidella|Lecidoma|Lithographa|Lopadium|Megalaria|Micarea|Miriquidica|Mycobilimbia|Mycoblastus|Myochroidea|Orphniospora|Placynthiella|Porpidia|Protoblastenia|Protomicarea|Psilolechia|Psora|Psorinia|Psorula|Puttea|Pycnora|Pyrrhospora|Rhizocarpon|Rimularia|Romjularia|Ropalospora|Schadonia|Schaereria|Scoliciosporum|Steinia|Szczawinskia|Toninia|Trapelia|Trapeliopsis|Tremolecia|Tylothallia|Vezdaea';
  $allfile = 'lecideoid.txt';
}
elseif ($pr == 'redlist') {
  echo "<br>Project: <select name=\"pr\">\n<option> \n<option>lecideoid\n<option selected>redlist\n<option>macrolichens\n<option>all\n</select>\n";
  $prSlekter = '';
  $allfile = 'redlist.txt';
}
elseif ($pr == 'macrolichens') {
  echo "<br>Project: <select name=\"pr\">\n<option> \n<option>lecideoid\n<option>redlist\n<option selected>macrolichens\n<option>all\n</select>\n";
  $prSlekter = 'Alectoria|Allantoparmelia|Anaptychia|Arctocetraria|Arctoparmelia|Asahinea|Blennothallia|Brodoa|Bryocaulon|Bryoria|Bunodophoron|Callome|Candelaria|Cetraria|Cetrariella|Cetrelia|Cladonia|Collema|Cornicularia|Dactylina|Dermatocarpon|Enchylium|Erioderma|Evernia|Flavocetraria|Flavoparmelia|Fuscopannaria|Glypholecia|Heterodermia|Hyperphyscia|Hypogymnia|Hypotrachyna|Imshaugia|Lasallia|Lathagrium|Leprocaulon|Leptochidium|Leptogium|Letharia|Lichenomphalia|Lichina|Lobaria|Massalongia|Melanelia|Melanelixia|Melanohalea|Menegazzia|Montanelia|Nephroma|Nevesia|Normandina|Pannaria|Parmelia|Parmeliella|Parmelina|Parmeliopsis|Parmotrema|Pectenia|Peltigera|Peltula|Phaeophyscia|Physcia|Physconia|Pilophorus|Platismatia|Pleurosticta|Protopannaria|Pseudephebe|Pseudevernia|Pseudocyphellaria|Psoroma|Punctelia|Pycnothelia|Ramalina|Rostania|Rusavskia|Scytinium|Siphula|Solorina|Sphaerophorus|Staurolemma|Stereocaulon|Sticta|Thamnolia|Tholurna|Tuckermanopsis|Umbilicaria|Usnea|Usnocetraria|Vahliella|Vulpicida|Xanthomendoza|Xanthoparmelia|Xanthoria';
  $allfile = 'makrolav.txt';
  }
elseif ($pr == 'all') {
  echo "<br>Project: <select name=\"pr\">\n<option> \n<option>lecideoid\n<option>redlist\n<option selected>\n<option selected>all\n</select>\n";
  $prSlekter = '';
  $allfile = 'norsklav.txt';
  }
else {
  echo "<br>Project: <select name=\"pr\">\n<option selected> \n<option>lecideoid\n<option>redlist\n<option>macrolichens\n<option>all\n</select>\n";
  $prSlekter = '';
  $allfile = '';
}
*/
$f = fopen($allfile, "r");
while ($line = fgets($f)) {
  list ($a, $b) = explode("\t", $line);
  $alleArter[$a] = $b;
} 
fclose($f);

#echo " + <input type=checkbox name=addSp value='x' $checked_Add> Addit. sp.\n";

#knapper til å velge ulike views
#echo "<br><input type=radio name=full value=0 $checked_0> Summary - <input type=radio name=full value=1 $checked_1> Sequenced specimens - <input type=radio name=full value=2 $checked_2> Fasta format\n";

if ($full == 2) {echo "<p>Refine search: <input type=checkbox name=okN value=1> Not checked &ndash; <input type=checkbox name=ok0 value=1> Error &ndash; <input type=checkbox name=ok1 value=1> Aff. &ndash; <input type=checkbox name=ok2 value=1> OK";}

echo " &mdash; <input type=submit value=Go!>\n";

echo "</form>\n";


# -------------------------------------------------------- Leser nomenklaturfiler

$nomfil = "/site/nhm2/botanisk/nxd/sopp/data/NOM.TXT";   # NSDs nomenklaturfil
$fh = fopen("$nomfil", 'r');
while (! feof($fh)) {
  $a = fgets($fh); $a = ucfirst(strtolower($a)); 
  $bb = fgets($fh); $bb = ucfirst(strtolower($bb)); $b = preg_replace('/\r\n/', '', $bb);
  if ($a == $bb) {$nom[$a] = $b;}
}
fclose($fh);
  
#$gh = fopen('NOM_SUPL.TXT', 'r');                        # Supplementsfil for navn som ikke er kjent av NLD
#while (! feof($gh)) {
#  $a = fgets($gh); $a = ucfirst(strtolower($a)); 
#  $b = fgets($gh); $b = ucfirst(strtolower($b)); $b = preg_replace('/\r\n/', '', $b);
#  $nom[$a] = $b;
#}
#fclose($gh);
  
# ------------------------------------------------------- Leser bold_sjek.txt
$file = "bold_sjekk.txt";
$fb = fopen($file, "r");
while ($line = fgets($fb)) {
  $line = str_replace("\r\n","",$line);
  $l = explode("\t", $line);
  $pID = $l[0]; $pID = '000'.$pID; $pID = substr($pID, -4);
  $ccdb[$pID] = $l[1];
  $ok[$pID] = $l[2];
  $blast[$pID] = $l[3];
  $kommentar[$pID] = $l[4];
  if (! $kommentar[$pID]) {$kommentar[$pID] = '&nbsp;';}
  $corrSpecimenID[$pID] = $l[5];
  $corrArt[$pID] = $l[6];
  $label[$pID] = $l[10];
}
fclose($fb);


# ------------------------------------------------------- Record view
if ($full == 1) {

/*
#  $tlcfil = "/site/nhm2/botanisk/nxd/lav/db/TLC.TXT";   # NLDs tlc-fil
#  $fh = fopen("$tlcfil", 'r');
#  while (! feof($fh)) {
#    $a = fgets($fh); $a = preg_replace('/\r\n/', '', $a); $a = str_replace('L', 'L-', $a); $a = str_replace('--', '-', $a); $a = str_replace(' ', '', $a); 
#    $b = fgets($fh); $b = preg_replace('/\r\n/', '', $b); $b = str_replace('|', '; ', $b);
#    $tlc[$a] = $b;
#  }
#  fclose($fh);

  echo "<table border=1 cellpadding=5>\n";
  echo "<thead>\n";
  echo "<tr bgcolor=#FFFF99><th>&nbsp;<th>Species<th>Specimen<th>Photo<th>ProcID<th>&nbsp;<th>Marker<th>TLC<th>Comments</tr>\n";
  echo "</thead>\n";
  
  $f = fopen("bold.txt", "r");
  while ($line = fgets($f)) {
    $boldlinje = explode("\t", $line);
    if ($boldlinje[17]) {
      $gui_komment[$boldlinje[0]] = $boldlinje[17];
	}
  }  
  fclose($f);

  $file = "fasta.fas";
  $f = fopen($file, "r");

  while ($line = fgets($f)) {
    if (preg_match('/^>/', $line)) {  # heading-linje
      if (preg_match('/_/', $line)) {$avgrenser = '_';} else {$avgrenser = '|';}   # Tillater to typer avgrensere i headingen: | og _
      list($prID, $species, $GUI, $ITS) = explode("$avgrenser", $line);				#Gunnhild bytter om på $species og $GUI pga nytt format i fasta-fila
      $prID = ltrim($prID,'>');
	  $pID  = ltrim($prID,'NOBAS');
	  $pID  = substr($pID,0,-3); $pID = '000'.$pID; $pID = substr($pID, -4);
	  if ($corrSpecimenID[$pID]) {$GUI     = $corrSpecimenID[$pID];}
	  if ($corrArt[$pID])        {$species = $corrArt[$pID];}
	  if ($gui_komment[$GUI]) {$kommentar[$pID] = $gui_komment[$GUI] .". " . $kommentar[$pID];}
	  list ($g0, $g1, $g2) = explode("-", $GUI);
	  $g3 = '00000'.$g2;
	  $g4 = substr($g3, -6);
	  $GUI_0 = "$g0-$g1-$g4";
	  $seq = '';
	  
	  if ($ok[$pID] == '2') {                  # Kontrollert, art trolig riktig
	    $farge1 = '<font color=green><b>';
		$farge0 = '</b></font>';}
	  elseif ($ok[$pID] == '1') {              # Kontrollert, slekt trolig riktig
	    $farge1 = '<font color=orange><b>';
		$farge0 = '</b></font>';}
	  elseif ($ok[$pID] == '0') {              # Kontrollert, trolig eller sikkert feil slekt
	    $farge1 = '<font color=red><b>';
		$farge0 = '</b></font>';}
	  else {                                   # Ikke kontrollert
	    $farge1 = '';
	    $farge0 = '';
	  }
    }
    else {
      $seq = $line; # Gitt opp å lese multiline sekvens
	  $blast = 'http://www.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Put&DATABASE=nr&PROGRAM=blastn&HITLIST_SZE=50&QUERY=' . $seq;
      if ($tlc[$GUI]) {$tlcdata = $tlc[$GUI];} else {$tlcdata = '&nbsp;';}
      if     ($gui && ! preg_match("/$fullgui/", $GUI))    {}
      elseif ($sp  && ! preg_match("/$sp/", $species)) {}
      else {
		list ($slekt, $epitet) = explode(' ', $species);
        if     ($pr &&   $prslekter && ! preg_match("/$slekt/", $prSlekter)) {}     # Prosjekt der inkluderte slekter er definert
 	    elseif ($pr && ! $prslekter && ! $alleArter[$species]) {}                       # Prosjekt der artslisten styrer
        else {
          echo "<tr><td><a href=$blast target=\"_new\">BLAST</a><td><i>$species</i><td><a href=http://nhm2.uio.no/lichens/dc/index.php?id=$GUI>$GUI</a><td><a href=http://nhm2.uio.no/sopp/barcode/collphoto.php?gui=$GUI_0&width=1200 target='_new'>jpeg</a><td>$pID<td>&nbsp;<td>$farge1$ITS$farge0<td>$tlcdata<td>$kommentar[$pID]</tr>";
          ++$i;
		}
      }
    }
  }

  echo "</table>\n";
  if ($i) {
    echo "<p>$i specimen(s)\n";
  }
  else {
    echo "<p><font color=red>Sorry, no record matching filter criteria $fullgui</font>\n";
  }
  */
}

# ------------------------------------------------------------ Fasta-visning
elseif ($full == 2) {

#  $tlcfil = "/site/nhm2/botanisk/nxd/lav/db/TLC.TXT";   # NLDs tlc-fil
#  $fh = fopen("$tlcfil", 'r');
#  while (! feof($fh)) {
#    $a = fgets($fh); $a = preg_replace('/\r\n/', '', $a); $a = str_replace('L', 'L-', $a); $a = str_replace('--', '-', $a); $a = str_replace(' ', '', $a); 
#    $b = fgets($fh); $b = preg_replace('/\r\n/', '', $b); $b = str_replace('|', '; ', $b);
#    $tlc[$a] = $b;
#  }
#  fclose($fh);

#  $substfil = "substanser.txt";   # Lavsubstanser med forkortelser
#  $fh = fopen("$substfil", 'r');
#  while (! feof($fh)) {
#  ++$test;
#    $l = fgets($fh);
#	$l = preg_replace("/\r\n/", '', $l);
#	list($a, $b) = explode('|', $l);
#    $shortSub[$a] = $b;
#  }
#  fclose($fh);

/*  echo "<form action=\"http://www.ebi.ac.uk/Tools/services/web_clustalo/toolform.ebi\" enctype=\"multipart/form-data\" id=\"jd_toolSubmissionForm\" method=\"post\" target=\"_new\">\n";
  echo "<input id=\"tool\" name=\"tool\" type=\"hidden\" value=\"clustalo\">\n";
  echo "<input id=\"outfmt\" name=\"outfmt\" type=\"hidden\" value=\"fa\">\n";
  echo "<hr><br><input name=\"submit\" type=submit value=\"Align and make phylogenetic tree using Clustal Omega\">\n";
  echo "<p><textarea cols=\"240\" id=\"sequence\" name=\"sequence\" rows=\"50\">\n";
  
  $file = "fasta.fas";
  $f = @fopen($file, "r");

  while ($line = fgets($f)) {
    if (preg_match('/^>/', $line)) {  # heading-linje
      if (preg_match('/_/', $line)) {$avgrenser = '_';} else {$avgrenser = '|';}   # Tillater to typer avgrensere i headingen: | og _
      list($prID, $species, $GUI, $ITS) = explode("$avgrenser", $line);			#Gunnhild bytter om på $species og $GUI pga nytt format i fasta-fila
      $prID = ltrim($prID,'>');
	  $pID  = ltrim($prID,'NOBAS');
	  $pID  = substr($pID,0,-3); $pID = '000'.$pID; $pID = substr($pID, -4);
	  $pxID = 'ProcID-'.$pID;
	  if ($corrSpecimenID[$pID]) {$GUI     = $corrSpecimenID[$pID];}
	  if ($corrArt[$pID])        {$species = $corrArt[$pID];}
	  $seq = '';
	  if ($label[$pID]) {$labl= '_'. $label[$pID];} else {$labl = '';}
	  if ($ok[$pID] == '2') {                  # Kontrollert, art trolig riktig
	    $checked_seq = 'OK';
        if ($okTest && $ok2) {$ut = '1';}}
	  elseif ($ok[$pID] == '1') {              # Kontrollert, slekt trolig riktig
	    $checked_seq = 'AFF';
		if ($okTest && $ok1) {$ut = '1';}}
	  elseif ($ok[$pID] == '0') {              # Kontrollert, trolig eller sikkert feil slekt
	    $checked_seq = 'ERROR';
		if ($okTest && $ok0) {$ut = '1';}}
	  else {$farge1='';                        # Ikke kontrollert
		$checked_seq = 'NOT_CHECKED';
		if ($okTest && $okN) {$ut = '1';}}	
	}
    else {
      $seq = $seq . $line;  # Forsøk på å lese multiline-sekvenser, men virker ikke. Hele sekvensen må forsatt ligge på én linje
      if     ($gui && ! preg_match("/$fullgui/", $GUI))    {}
      elseif ($sp  && ! preg_match("/$sp/", $species)) {}
	  else {
		list ($slekt, $epitet) = explode(' ', $species);
        if ($tlc[$GUI]) {
          $subList = '|';
          $substansListe = explode('; ', $tlc[$GUI]);
          foreach ($substansListe as $su) {
		    if ($shortSub[$su]) {   # Hvis kortformen av lavsyren finnes, bruk kortformen
              $subList = $subList . '_' . $shortSub[$su];
			}
			else {                  # Hvis ikke, skriv lavsyrens navn med mellomrom erstattet med bindestrek
			  $sux = str_replace(' ', '-', $su);
			  $subList = $subList . '_' . $sux;
			}
          }  
          $subList = preg_replace("/\|_/", '|', $subList);
		}
        else {$subList = '';}

        if     ($pr &&   $prslekter && ! preg_match("/$slekt/", $prSlekter)) {}     # Prosjekt der inkluderte slekter er definert
 	    elseif ($pr && ! $prslekter && ! $alleArter[$species]) {}                   # Prosjekt der artslisten styrer
        elseif ($okTest && $ut == '') {}                                            # Begrenset til sjekket materiale
        else {
          echo ">$slekt"."_$epitet$subList|$pxID|$GUI|ITS|$checked_seq$labl\n";
		  echo "$seq";
          ++$i;
		}
      }
	$ut = '';
    }
  }
  echo "</textarea>\n";
  echo "<p>$i sequences\n";
  echo "</form>\n"; 
*/

}


# -------------------------------------------------------------- Summary
else {
	
  echo "<p>Legend:<br>\n";
  echo "1: Specimens sequenced at iBOL\n<br>";
  echo "2: Sampled specimens, to be sequenced at iBOL\n<br>";
  echo "3: Specimens selected for sampling at O\n<br><br>";
  echo "Click on species name to see which counties (fylker) the specimens are from<p>";

  echo "<table border=1>\n";
  echo "<thead>\n";
  echo "<tr bgcolor=#FFFF99><th>Species<th>&nbsp; 1 <th>&nbsp; 2 <th>&nbsp; 3 </tr>\n";
  echo "</thead>\n";

#  $fh = fopen('nld_data.txt', 'r');
#  while (! feof($fh)) {
#    $a = fgets($fh);
#    $b = fgets($fh); $b = preg_replace('/\r\n/', '', $b);
#    $nldData[$a] = $b;
#  }
#  fclose($fh);
  
#  $fh = fopen('x_O_data.txt', 'r');                              # Denne blokken har vært MIDLERTIDIG FJERNET PGA FOR LITE MINNE AVSATT TIL PHP PÅ NORBIF
#  while (! feof($fh)) {
#    $a = fgets($fh);
#    $b = fgets($fh); $b = preg_replace('/\r\n/', '', $b);
#    $nldData[$a] = $b;
#  }
#  fclose($fh);

  $file = "fasta.fas";
  $f = fopen($file, "r");
  while ($line = fgets($f)) {
    if (! $andrelinje) {  # leser annenhver linje, førstelinjen er metadata, andrelinjen barkoden
      list($prID, $species, $GUI, $fylke, $ITS) = explode("|", $line);			#Gunnhild bytter om på $species og $GUI pga nytt format i fasta-fila, og legger til fylke
      $prID = ltrim($prID,'>');
	  $pID  = ltrim($prID,'NOBAS');
	  $pID  = substr($pID,0,-3);
	  $fylke = str_replace("\n","",$fylke); 
	  $fylke = str_replace("\r","",$fylke);
	  
	  if ($corrSpecimenID[$pID]) {$GUI     = $corrSpecimenID[$pID];}
	  if ($corrArt[$pID])        {$species = $corrArt[$pID];}
	  $GUI2 = $GUI."\r\n";
	  $labelData = explode("|", $nldData[$GUI2]);
	  if ($labelData[3] <> "Norway") {$labelData[4] = $labelData[3]. ", ". $labelData[4];}
	  $label = "<b>$labelData[4]</b>, $labelData[5], $labelData[6], $labelData[9] m, $labelData[10], $labelData[1], $labelData[0] "; 
      $andrelinje = "1";
    }
    else {
      $andrelinje = "";
	  if (! preg_match("/0|1/", $ok[$pID])) {  # Ikke filtrert vekk pga feilbestemt sekvens
	    $barcoded_species[$species] = $barcoded_species[$species] + 1;
#  	    $tekst[$species] = $tekst[$species] . "<li>" . $label . "(". $GUI . ")";
#Gunnhild endrer til fylke fra fasta-fil, i stedet for tomme data fra ikke-eksisterende musit-dump
  	    $tekst[$species] = $tekst[$species] . "<li>" . $fylke;
	  }
    }
  }
  fclose($f);

#gunnhild erstatter bolken nedenfor med følgende, for å få inn fylke:  
    foreach ($stativene as $stativ) {
     $file = 'samples_'.$stativ.'.txt';
    $f = fopen($file, "r");
    while ($line = fgets($f)) {
	  $line = str_replace("\r","",$line);#denne trengs når eol er CR-LF i inputfila, ikke bare LF
	  $line = str_replace("\n","",$line);#hvis ikke denne er her blir det to linjer per art; en ekstra for denne sampled species
	  $line = str_replace(" \t", "\t", $line);
	  $line = str_replace("\t ", "\t", $line);
      $samples = explode("\t", $line);
	  $fylke = "$samples[2]";
      $fylke = str_replace("\n","",$fylke); 
	  $fylke = str_replace("\r","",$fylke);
	  $species = $samples[0] . ' ' . $samples[1];


	  $sampled_species[$species] = $sampled_species[$species] + 1; 
	  $tekstSampl[$species] = $tekstSampl[$species] . "<li>". $fylke;
	 } 
	 
  fclose($f);
  }
  

/*  foreach ($stativene as $stativ) {
    $file = 'samples_'.$stativ.'.txt';
    $f = fopen($file, "r");
    while ($line = fgets($f)) {
	  $line = str_replace("\r","",$line);
	  $line = str_replace("\n","",$line);
      $samples = explode("\t", $line);
      if ($samples[6] && $samples[6] <> 'Genus') { ++$ii;
        $species = "$samples[6] $samples[7]";
	    $sampled_species[$species] = $sampled_species[$species] + 1;
		if ($samples[4]) {
	      $GUI = "$samples[3]-$samples[4]";
	      $GUI2 = $GUI."\r\n";
	      $labelData = explode("|", $nldData[$GUI2]);
	      if ($labelData[3] <> "Norway") {$labelData[4] = $labelData[3]. ", ". $labelData[4];}
	      $label = "<b>$labelData[4]</b>, $labelData[5], $labelData[6], $labelData[9] m, $labelData[10], $labelData[1], $labelData[0] "; 
		}
        else {
		  $fieldNo = explode(".", $samples[10]);
          $label = "<b>$samples[18]</b> &ndash; " .'Field number: ' . $fieldNo[0] . ' ';
		  $GUI = 'not yet in herbarium';
        }		
        $tekstSampl[$species] = $tekstSampl[$species] . "<li>". $label . "(".$GUI.")";
	  }
   } 
    fclose($f);
  }
  */
  foreach ($sampled_species as $key => $ss) {
    if (! $barcoded_species[$key]) {$barcoded_species[$key] = '&nbsp;';}
  }

  #Gunnhild legger til følgende bolk for å få med fylke på kandidater
  $file = 'candidates.txt';
  $f = fopen($file, "r");
  while ($line = fgets($f)) {
	  $line = str_replace("\n","",$line); 
	  $line = str_replace("\r","",$line);
	  $samples = explode("\t", $line);
	  $fylke = "$samples[2]";
      $fylke = str_replace("\n","",$fylke); 
	  $fylke = str_replace("\r","",$fylke);
	  $species = $samples[0] . ' ' . $samples[1];
	  $tekstCand[$species] = $tekstCand[$species] . "<li>". $fylke;
	++$candidate_species[$species];
      } 
  fclose($f);
  
/*  $file = 'candidates_O.txt';
  $f = fopen($file, "r");
  while ($line = fgets($f)) {
  	$line = 'O-F-' . $line;
    $labelData = explode("|", $nldData[$line]);
	$art = $labelData[11] . ' ' . $labelData[12];
	++$candidate_species[$art];
    if ($labelData[3] <> "Norway") {$labelData[4] = $labelData[3]. ", ". $labelData[4];}
	$label = "<b>$labelData[4]</b>, $labelData[5], $labelData[6], $labelData[9] m, $labelData[10], $labelData[1], $labelData[0] "; 
	$tekstCand[$art] = $tekstCand[$art] . "<li>". $label . "(".$line.")";
  } 
  fclose($f);
  
  $file = 'candidates_BG.txt';
  $f = fopen($file, "r");
  while ($line = fgets($f)) {
  	$line = 'BG-F-' . $line;
    $labelData = explode("|", $nldData[$line]);
	$art = $labelData[11] . ' ' . $labelData[12];
	++$candidate_species[$art];
    if ($labelData[3] <> "Norway") {$labelData[4] = $labelData[3]. ", ". $labelData[4];}
	$label = "<b>$labelData[4]</b>, $labelData[5], $labelData[6], $labelData[9] m, $labelData[10], $labelData[1], $labelData[0] "; 
	$tekstCand[$art] = $tekstCand[$art] . "<li>". $label . "(".$line.")";
  } 
  fclose($f);

  $file = 'candidates_TRH.txt';
  $f = fopen($file, "r");
  while ($line = fgets($f)) {
  	$line = 'TRH-F-' . $line;
    $labelData = explode("|", $nldData[$line]);
	$art = $labelData[11] . ' ' . $labelData[12];
	++$candidate_species[$art];
    if ($labelData[3] <> "Norway") {$labelData[4] = $labelData[3]. ", ". $labelData[4];}
	$label = "<b>$labelData[4]</b>, $labelData[5], $labelData[6], $labelData[9] m, $labelData[10], $labelData[1], $labelData[0] "; 
	$tekstCand[$art] = $tekstCand[$art] . "<li>". $label . "(".$line.")";
  } 
  fclose($f);
*/
  foreach ($candidate_species as $key => $cs) {
    if (! $barcoded_species[$key]) {$barcoded_species[$key] = '&nbsp;';}
  }

  if ($addSp) {
    foreach ($alleArter as $key => $aa) {
      if (! $barcoded_species[$key]) {$barcoded_species[$key] = '&nbsp;';}
    }
  }
    
  ksort($barcoded_species);
  foreach ($barcoded_species as $key => $bs) {
    if (! $sampled_species[$key])   {$sampled_species[$key]   = '&nbsp;';}
	if (! $candidate_species[$key]) {$candidate_species[$key] = '&nbsp;';}
    if     ($gui) {$melding = "Specimen data not available for Summary view";}
    elseif ($sp  && ! preg_match("/$sp/",  $key)) {}
    else {
      if ($bs <> '&nbsp;' or $sampled_species[$key] <> '&nbsp;' or $candidate_species[$key] <> '&nbsp;') {$skrift1 = ''; $skrift0 = '';}
	  elseif ($alleArter[$key] < 1980) {$skrift1 = '<font color=red>'; $skrift0 = '</font>';}
	  elseif ($alleArter[$key] < 2000) {$skrift1 = '<font color=orange>'; $skrift0 = '</font>';}
	  else                             {$skrift1 = '<font color=green>'; $skrift0 = '</font>';}
	  
	  list ($slekt, $epitet) = explode(' ', $key);
      if     ($pr &&   $prslekter && ! preg_match("/$slekt/", $prSlekter)) {}     # Prosjekt der inkluderte slekter er definert
	  elseif ($pr && ! $prslekter && ! $alleArter[$key]) {}                       # Prosjekt der artslisten styrer
      else {
	    $uttekst = "<i>$key</i><p><u>1 - SEQUENCED</u> $tekst[$key]";
		$uttekst = str_replace(" ","%20",$uttekst);
		$uttekst = str_replace("<","&lt;",$uttekst);
		$uttekst = str_replace(">","&gt;",$uttekst);
		$uttekst = str_replace("\"","'",$uttekst);
		$uttekst2 = "<p><u>2 - SAMPLED</u> $tekstSampl[$key]";
		$uttekst2 = str_replace(" ","%20",$uttekst2);
		$uttekst2 = str_replace("<","&lt;",$uttekst2);
		$uttekst2 = str_replace(">","&gt;",$uttekst2);
		$uttekst2 = str_replace("\"","'",$uttekst2);
		$uttekst3 = "<p><u>3 - SELECTED</u> $tekstCand[$key]";
		$uttekst3 = str_replace(" ","%20",$uttekst3);
		$uttekst3 = str_replace("<","&lt;",$uttekst3);
		$uttekst3 = str_replace(">","&gt;",$uttekst3);
		$uttekst3 = str_replace("\r\n","",$uttekst3);
		$uttekst3 = str_replace("\"","'",$uttekst3);
		$artstekst = $uttekst.$uttekst2.$uttekst3;
		$key2 = "$key\r\n";
        if ($epitet && $epitet <> 'sp.' && $key <> $nom[$key2]) {$nb = '<font color=red> (name?)</font>';} else {$nb = '';}  # Rødt navn dersom navn ukjent i NLD-nomenklaturfil
   	    echo "<tr><td>$skrift1<i><a href=javascript:vis(\"$artstekst\")>$key</a></i>$skrift0$nb<td align=right>$bs<td align=right>$sampled_species[$key]<td align=right>$candidate_species[$key]";
    	$sum1 = $sum1 + $bs;
	    $sum2 = $sum2 + $sampled_species[$key];
	    $sum3 = $sum3 + $candidate_species[$key];
	    ++$i;
      }
	}
  }

  echo "<tr bgcolor=#FFFF99><td><b>Sum ($i species)</b><td><b>$sum1</b><td><b>$sum2</b><td><b>$sum3</b></tr>";
  echo "</table>\n";
  echo "<p>1: Specimens sequenced\n<br>";
  echo "2: Sampled specimens, to be sequenced at iBOL\n<br>";
  echo "3: Specimens selected for sampling at O<br>\n";
#  if ($addSp) {         # Dette virker visst ikke lenger
#    echo "<font color=green>green</font>: No specimen selected; latest id &ge; 2000<br>\n";
#    echo "<font color=orange>orange</font>: No specimen selected; latest id 1980-1999<br>\n";
#    echo "<font color=red>red</font>: No specimen selected; latest id &le; 1979<br>\n";
#  }
  if ($i) {
#    echo "<p>$i species\n";
  }
  else {
    if (! $melding) {$melding = "Sorry, no record matching filter criteria";}
    echo "<font color=red><p>$melding</font>\n";
  }
}

?>

</body>
</html>
