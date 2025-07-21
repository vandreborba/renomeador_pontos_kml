function processarKML() {
  const input = document.getElementById('fileInput');
  const status = document.getElementById('status');

  if (!input.files[0]) {
    status.innerHTML = "<span class='text-danger'>⚠️ Por favor, selecione um arquivo KML.</span>";
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const originalText = e.target.result;
    const parser = new DOMParser();
    const xml = parser.parseFromString(originalText, "application/xml");

    // Verifica se houve erro no parsing XML
    const parserError = xml.getElementsByTagName("parsererror");
    if (parserError.length > 0) {
      status.innerHTML = "<span class='text-danger'>⚠️ Erro na análise do arquivo KML. Verifique se o arquivo está no formato correto.</span>";
      console.error("Erro de parsing XML:", parserError[0].textContent);
      return;
    }

    // Verifica se é um arquivo KML válido
    if (!xml.getElementsByTagName("kml").length && !xml.getElementsByTagName("Document").length) {
      status.innerHTML = "<span class='text-danger'>⚠️ O arquivo não parece ser um KML válido.</span>";
      return;
    }

    const placemarks = xml.getElementsByTagName("Placemark");
    
    if (placemarks.length === 0) {
      status.innerHTML = "<span class='text-warning'>⚠️ Nenhum ponto (Placemark) encontrado no arquivo KML.</span>";
      return;
    }

    let alterados = 0;

    for (let placemark of placemarks) {
      const desc = placemark.getElementsByTagName("description")[0];
      const name = placemark.getElementsByTagName("name")[0];
      if (desc && name) {
        const match = desc.textContent.match(/CODIGO DO ENDERECO:\s*(\d+)/);
        if (match) {
          name.textContent = match[1];
          alterados++;
        }
      }
    }

    const serializer = new XMLSerializer();
    let kmlString = serializer.serializeToString(xml);

    // Corrige a estrutura KML se necessário
    kmlString = corrigirEstruturaKML(kmlString, originalText);

    const blob = new Blob([kmlString], { type: "application/vnd.google-earth.kml+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "kml_modificado.kml";
    a.click();

    status.innerHTML = `✅ <strong>${alterados}</strong> pontos atualizados. O novo arquivo foi gerado e baixado.`;
  };

  reader.readAsText(file);
}

function corrigirEstruturaKML(kmlString, originalText) {
  // Garante o cabeçalho XML
  let header = '<?xml version="1.0" encoding="UTF-8"?>\n';
  
  // Remove qualquer cabeçalho XML existente
  kmlString = kmlString.replace(/<\?xml[^>]*\?>\s*/i, '');
  
  // Verifica se já tem a tag <kml> principal
  if (!kmlString.includes('<kml')) {
    // Se não tem, precisa envolver o conteúdo
    const namespaceKML = 'xmlns="http://www.opengis.net/kml/2.2"';
    
    // Remove namespaces incorretos do Document se existir
    kmlString = kmlString.replace(/<Document[^>]*xmlns="[^"]*"[^>]*>/, '<Document>');
    
    // Envolve com a tag KML correta
    kmlString = `<kml ${namespaceKML}>\n${kmlString}\n</kml>`;
  } else {
    // Se já tem tag <kml>, tenta extrair do original se possível
    const kmlTagMatch = originalText.match(/<kml[^>]*>/i);
    if (kmlTagMatch) {
      kmlString = kmlString.replace(/<kml[^>]*>/i, kmlTagMatch[0]);
    } else {
      // Garante namespace correto
      kmlString = kmlString.replace(/<kml[^>]*>/i, '<kml xmlns="http://www.opengis.net/kml/2.2">');
    }
  }
  
  // Adiciona o cabeçalho
  return header + kmlString;
}
