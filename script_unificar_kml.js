// Unifica múltiplos KMLs (somando Placemarks) e depois renomeia os pontos usando renomearPontosPorCodigo
// Requer que script.js esteja carregado antes (para usar corrigirEstruturaKML e renomearPontosPorCodigo)

async function unificarKMLs() {
  const input = document.getElementById('multiFileInput');
  const status = document.getElementById('status');
  if (!input || !status) return;

  if (!input.files || input.files.length === 0) {
    status.innerHTML = "<span class='text-danger'>⚠️ Selecione um ou mais arquivos KML.</span>";
    return;
  }

  status.innerHTML = "⏳ Lendo arquivos KML...";

  try {
    // Lê todos os arquivos como texto
    const textos = await Promise.all(Array.from(input.files).map(f => lerArquivoTexto(f)));

    // Faz o parse de todos em XML DOM
    const parser = new DOMParser();
    const xmlDocs = textos.map(t => parser.parseFromString(t, 'application/xml'));

    // Validação rápida de parsing
    for (let i = 0; i < xmlDocs.length; i++) {
      const err = xmlDocs[i].getElementsByTagName('parsererror');
      if (err.length > 0) {
        status.innerHTML = `<span class='text-danger'>⚠️ Erro ao analisar o arquivo ${i + 1}. Verifique se é um KML válido.</span>`;
        console.error('Erro parsing XML arquivo', i + 1, err[0].textContent);
        return;
      }
    }

    // Cria um documento base para unificação
    const namespace = 'http://www.opengis.net/kml/2.2';
    const baseDoc = document.implementation.createDocument(namespace, 'kml', null);
    const kmlEl = baseDoc.documentElement;
    const documentEl = baseDoc.createElementNS(namespace, 'Document');
    kmlEl.appendChild(documentEl);

    // Cria um Folder para organização
    const folderEl = baseDoc.createElementNS(namespace, 'Folder');
    const folderName = baseDoc.createElementNS(namespace, 'name');
    folderName.textContent = 'Unificado';
    folderEl.appendChild(folderName);
    documentEl.appendChild(folderEl);

    let totalPlacemarks = 0;

    // Copia todos os Placemarks de cada arquivo para o baseDoc
    for (const xml of xmlDocs) {
      // Encontra o container (Folder/Document) com os placemarks
      const nodes = xml.getElementsByTagName('Placemark');
      for (const node of nodes) {
        // Importa para o doc base (adota o node no novo doc)
        const imported = baseDoc.importNode(node, true);
        folderEl.appendChild(imported);
        totalPlacemarks++;
      }
    }

    if (totalPlacemarks === 0) {
      status.innerHTML = "<span class='text-warning'>⚠️ Não encontrei pontos (Placemarks) nos arquivos informados.</span>";
      return;
    }

    // Renomeia pontos pelo CODIGO DO ENDERECO usando função do script.js
    const alterados = (typeof renomearPontosPorCodigo === 'function') ? renomearPontosPorCodigo(baseDoc) : 0;

    // Serializa e corrige header/namespace
    const serializer = new XMLSerializer();
    let kmlString = serializer.serializeToString(baseDoc);

    // Usa o primeiro texto como referência para headers/namespaces
    const originalRef = textos[0] || '';
    if (typeof corrigirEstruturaKML === 'function') {
      kmlString = corrigirEstruturaKML(kmlString, originalRef);
    }

    // Baixa o arquivo unificado
    const blob = new Blob([kmlString], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kml_unificado.kml';
    a.click();

    status.innerHTML = `✅ Unificação concluída: <strong>${totalPlacemarks}</strong> pontos combinados; <strong>${alterados}</strong> renomeados.`;
  } catch (e) {
    console.error(e);
    status.innerHTML = "<span class='text-danger'>❌ Ocorreu um erro ao unificar os KMLs.</span>";
  }
}

function lerArquivoTexto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
