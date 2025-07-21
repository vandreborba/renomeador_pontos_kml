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

    const placemarks = xml.getElementsByTagName("Placemark");
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

    // Garante o cabeçalho XML e namespace correto
    let header = '<?xml version="1.0" encoding="UTF-8"?>\n';
    // Tenta extrair a tag <kml ...> do original
    const kmlTagMatch = originalText.match(/<kml[^>]*>/);
    if (kmlTagMatch) {
      // Substitui a primeira tag <kml> gerada pelo XMLSerializer
      kmlString = kmlString.replace(/<kml[^>]*>/, kmlTagMatch[0]);
    }
    // Adiciona o cabeçalho
    kmlString = header + kmlString;

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
