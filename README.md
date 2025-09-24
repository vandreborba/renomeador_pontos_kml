# Renomeador de Pontos KML

Este projeto foi desenvolvido para apoiar profissionais no trabalho de campo com arquivos KML. Ao trabalhar com arquivos KML contendo pontos geográficos, a estrutura dos pontos nem sempre está otimizada para facilitar a identificação e manipulação durante as atividades externas. Este editor realiza ajustes automáticos no arquivo, tornando o processo mais ágil e eficiente.

## Privacidade
Privacidade total: Nenhum dado é enviado ou armazenado em servidores. Todo o processamento ocorre localmente no seu navegador, garantindo segurança e confidencialidade dos arquivos.

## O que o sistema faz?
- Permite o upload de um arquivo `.kml` e renomeia seus pontos.
- Lê cada ponto (Placemark) e substitui o conteúdo da tag `<name>` pelo valor encontrado na descrição, especificamente o `CODIGO DO ENDERECO`.
- Unifica vários arquivos `.kml` em um único arquivo, somando todos os pontos, e já aplica a renomeação pelo `CODIGO DO ENDERECO`.
- Gera e baixa um novo arquivo KML ajustado para facilitar o trabalho de campo.

## Exemplo
Antes:
```xml
<Placemark>
  <name>72</name>
  <description>CODIGO DO ENDERECO: 831</description>
</Placemark>
```
Depois:
```xml
<Placemark>
  <name>831</name>
  <description>CODIGO DO ENDERECO: 831</description>
</Placemark>
```

## Como usar, acesse o link:
https://vandreborba.github.io/renomeador_pontos_kml/

## Passo a passo

### Renomear um arquivo KML
1. Em “Selecione um arquivo KML”, escolha o arquivo `.kml`.
2. Clique em “Processar e Baixar Novo KML”.
3. Baixe o arquivo ajustado com os nomes dos pontos substituídos pelo `CODIGO DO ENDERECO`.

### Unificar vários KMLs e renomear
1. Em “Selecione vários KMLs”, selecione dois ou mais arquivos `.kml` (pode usar Ctrl/Shift).
2. Clique em “Unificar e Baixar”.
3. O arquivo `kml_unificado.kml` será baixado com todos os pontos combinados e já renomeados.

## Repositório
Acesse o código-fonte e contribua: [renomeador_pontos_kml](https://github.com/vandreborba/renomeador_pontos_kml)


