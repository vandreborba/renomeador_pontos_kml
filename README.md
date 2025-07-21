# Renomeador de Pontos KML

Este projeto foi desenvolvido para apoiar servidores de agências do IBGE no trabalho de campo do CNEFE. Ao baixar arquivos KML pelo sistema do IBGE, a estrutura dos pontos nem sempre está otimizada para facilitar a identificação e manipulação durante as atividades externas. Este editor realiza ajustes automáticos no arquivo, tornando o processo mais ágil e eficiente.

## Privacidade
Privacidade total: Nenhum dado é enviado ou armazenado em servidores. Todo o processamento ocorre localmente no seu navegador, garantindo segurança e confidencialidade dos arquivos.

## O que o sistema faz?
- Permite o upload de um arquivo `.kml`.
- Lê cada ponto (placemark) e substitui o conteúdo da tag `<name>` pelo valor encontrado na descrição, especificamente o `CODIGO DO ENDERECO`.
- Gera e baixa um novo arquivo KML já ajustado para facilitar o trabalho de campo.

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

## Repositório
Acesse o código-fonte e contribua: [renomeador_pontos_kml](https://github.com/vandreborba/renomeador_pontos_kml)


