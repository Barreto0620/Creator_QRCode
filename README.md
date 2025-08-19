# Creator QRCode 🚀

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/Barreto0620/Creator_QRCode?tab=MIT-1-ov-file)
[![GitHub](https://img.shields.io/badge/GitHub-WebCash--inc-black.svg)](https://github.com/WebCash-inc)

Uma ferramenta robusta e flexível para gerar QR codes em lote a partir de diversas fontes de dados.

## 🌟 Sobre o Projeto

O **`Creator QRCode`** é uma ferramenta de linha de comando (CLI) projetada para automatizar a geração de QR codes a partir de URLs, textos ou dados contidos em arquivos. Ele pode processar entradas da linha de comando, arquivos de texto (`.txt`), planilhas CSV ou até mesmo dados "piped" (`stdin`).

Cada entrada é convertida em uma imagem de QR code escaneável e salva em um arquivo PNG, garantindo uma organização eficiente e um fluxo de trabalho otimizado.

### ✨ Principais Características

* **Múltiplas Entradas:** Processa URLs/textos da CLI, arquivos de texto ou CSV.
* **Customização:** Opções para ajustar o tamanho (`--scale`), a borda (`--border`) e o nível de correção de erro (`--ecc`).
* **Organização:** Salva os arquivos gerados em um diretório de saída customizável (`--outdir`) com nomes de arquivos únicos e descritivos.
* **Processamento em Lote:** Projetado para gerar centenas de QR codes de uma vez, tornando-o ideal para automação e projetos de grande escala.
* **Código Limpo:** Arquitetura modular e bem definida, tornando-o fácil de entender e manter.

## 📋 Requisitos

### Pré-requisitos do Sistema
- **Python:** Versão 3.8 ou superior
- **Sistema Operacional:** Windows, Linux ou macOS

### Dependências
- `segno` - Geração de QR codes
- `pandas` - Processamento de arquivos CSV
- `Pillow` - Manipulação de imagens

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/WebCash-inc/creator-qrcode.git
cd creator-qrcode

# Crie um ambiente virtual (recomendado)
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt
```

### Arquivo requirements.txt
```txt
segno>=1.4.0
pandas>=1.3.0
Pillow>=8.0.0
```

## 💻 Como Usar (CLI)

O `Creator QRCode` foi feito para ser simples de usar. Abra seu terminal, navegue até o diretório do projeto e execute os comandos a seguir.

### 1. Geração Básica

Gere um QR code para uma única URL.

```bash
python qr_batch_generator.py "https://www.exemplo.com"
```

O resultado será um arquivo `exemplo_com.png` salvo na pasta padrão `qrcodes/`.

### 2. Opções de Customização

Ajuste o tamanho e o diretório de saída do QR code.

```bash
python qr_batch_generator.py "https://docs.python.org" --outdir meus_qrs --scale 15
```

Isso criará um QR code maior (`--scale 15`) para `https://docs.python.org` e o salvará na pasta `meus_qrs/`.

### 3. Geração em Lote

Use a opção `--input` para gerar QR codes de um arquivo de texto ou CSV.
Seu arquivo `links.txt` deve ter uma URL por linha:

```
https://www.google.com
https://www.github.com
https://www.linkedin.com
```

**Comando:**

```bash
python qr_batch_generator.py --input links.txt
```

Para arquivos CSV, especifique a coluna que contém as URLs usando `--column`:

```bash
python qr_batch_generator.py --input data.csv --column URL
```

### 4. Geração de Texto Simples

Para gerar QR codes a partir de textos que não são URLs, use a flag `--allow-plain`:

```bash
python qr_batch_generator.py "Olá Mundo" --allow-plain
```

### 5. Parâmetros Disponíveis

| Parâmetro | Descrição | Valor Padrão |
|-----------|-----------|--------------|
| `--input` | Arquivo de entrada (.txt ou .csv) | - |
| `--column` | Nome da coluna no CSV | primeira coluna |
| `--outdir` | Diretório de saída | `qrcodes/` |
| `--scale` | Tamanho do QR code | `10` |
| `--border` | Largura da borda | `4` |
| `--ecc` | Nível de correção de erro (L/M/Q/H) | `M` |
| `--allow-plain` | Permite texto simples | `false` |

-----

## 🏗️ Arquitetura do Projeto

O `Creator QRCode` é construído com uma arquitetura modular, onde cada componente tem uma função clara e distinta.

### 1. **Interface de Linha de Comando (CLI)**

Este é o "painel de controle" do projeto. Ele usa `argparse` para analisar os argumentos fornecidos pelo usuário, como `--outdir`, `--scale` e as URLs de entrada.

### 2. **Orquestrador de Fluxo de Trabalho**

O cérebro da aplicação. A função principal (`main`) orquestra a execução de todas as tarefas na ordem correta:

1. Coleta todas as URLs da entrada fornecida.
2. Prepara o diretório de saída.
3. Itera sobre cada URL, chamando o Renderizador de QR Code.
4. Salva o arquivo e fornece um relatório final ao usuário.

### 3. **Gerenciamento de Entrada de URLs**

Responsável por coletar e sanitizar as URLs. Ele suporta a leitura de múltiplos formatos de entrada e remove duplicatas para garantir um processamento eficiente.

### 4. **Renderizador de QR Code**

O "artista" do projeto. Usa a biblioteca `segno` para transformar dados de texto em imagens de QR code. Ele aplica as configurações de `scale`, `border` e `ecc` fornecidas pelo usuário.

### 5. **Manipulador de Arquivos de Saída**

O "arquivista". Este módulo garante que cada arquivo seja salvo corretamente. Ele cria a pasta de saída, sanitiza os nomes dos arquivos para evitar caracteres inválidos e salva a imagem gerada no local especificado.

-----

## 🤝 Contribuições

Contribuições são bem-vindas! Se você encontrar um bug ou tiver uma ideia de melhoria, sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

1. Faça um `fork` do projeto.
2. Crie uma nova *branch* (`git checkout -b feature/sua-feature`).
3. Faça suas alterações e commit (`git commit -m 'feat: Adiciona nova funcionalidade'`).
4. Envie suas alterações (`git push origin feature/sua-feature`).
5. Abra um *Pull Request*.

## 📄 Licença

Este projeto é distribuído sob a Licença MIT. Veja o arquivo [LICENSE](https://github.com/Barreto0620/Creator_QRCode?tab=MIT-1-ov-file) para mais detalhes.

## 📬 Contato

Desenvolvido por WebCash-inc.

* **GitHub:** [WebCash-inc](https://github.com/WebCash-inc)
