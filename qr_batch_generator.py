from __future__ import annotations
import argparse
import csv
import sys
from pathlib import Path
from urllib.parse import urlparse
from typing import List, Optional

try:
    import segno  # type: ignore
except ImportError as e:
    print("[ERRO] Biblioteca 'segno' não encontrada. Instale com: pip install segno", file=sys.stderr)
    sys.exit(1)


# Lista fixa de links (serão usados caso não informe nada por argumento)
DEFAULT_URLS = [
    "#",
    "#",
    "#"
]


def is_likely_url(s: str) -> bool:
    try:
        p = urlparse(s.strip())
        return bool(p.scheme and p.netloc)
    except Exception:
        return False


def read_lines_from_file(path: Path) -> List[str]:
    with path.open("r", encoding="utf-8", errors="ignore") as f:
        return [line.strip() for line in f if line.strip()]


def read_urls_from_csv(path: Path, col: str) -> List[str]:
    urls: List[str] = []
    with path.open("r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        if col not in (reader.fieldnames or []):
            raise ValueError(f"Coluna '{col}' não encontrada. Cabeçalhos: {reader.fieldnames}")
        for row in reader:
            val = (row.get(col) or "").strip()
            if val:
                urls.append(val)
    return urls


def collect_urls(args: argparse.Namespace) -> List[str]:
    urls: List[str] = []
    if args.urls:
        urls.extend([u.strip() for u in args.urls if u.strip()])
    if args.input:
        path = Path(args.input)
        if not path.exists():
            raise FileNotFoundError(f"Arquivo não encontrado: {path}")
        if args.csv_col:
            urls.extend(read_urls_from_csv(path, args.csv_col))
        else:
            urls.extend(read_lines_from_file(path))
    if args.stdin and not sys.stdin.isatty():
        stdin_data = sys.stdin.read().splitlines()
        urls.extend([l.strip() for l in stdin_data if l.strip()])

    # Se nada foi passado, usa os DEFAULT_URLS
    if not urls:
        urls = DEFAULT_URLS

    # Remover duplicatas
    unique_urls = []
    seen = set()
    for u in urls:
        if not args.allow_plain and not is_likely_url(u):
            continue
        if u not in seen:
            seen.add(u)
            unique_urls.append(u)
    return unique_urls


def sanitize_filename(s: str) -> str:
    safe = "".join(c if c.isalnum() or c in "-._" else "_" for c in s)
    return safe.strip("_")[:200] or "qrcode"


def generate_qr_png(data: str, outdir: Path, prefix: str, scale: int, border: int, ecc: str) -> Path:
    qr = segno.make(data, error=ecc.upper())
    filename = f"{prefix}{sanitize_filename(data)}.png"
    outpath = outdir / filename
    qr.save(outpath, scale=scale, border=border)
    return outpath


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        prog="qr_batch_generator",
        description="Gera QR Codes em PNG a partir de links (entrada por argumentos, arquivo, CSV ou STDIN).",
    )
    parser.add_argument("urls", nargs="*", help="Um ou mais links para converter em QR Code.")
    parser.add_argument("--input", "-i", help="Arquivo de entrada (.txt ou .csv).")
    parser.add_argument("--csv-col", help="Nome da coluna do CSV que contém as URLs.")
    parser.add_argument("--stdin", action="store_true", help="Ler URLs da entrada padrão (stdin).")
    parser.add_argument("--outdir", "-o", default="qrcodes", help="Diretório de saída (padrão: qrcodes).")
    parser.add_argument("--prefix", default="", help="Prefixo do nome do arquivo (ex.: link_).")
    parser.add_argument("--scale", type=int, default=8, help="Escala do PNG (tamanho). Padrão: 8.")
    parser.add_argument("--border", type=int, default=4, help="Borda do QR em módulos. Padrão: 4.")
    parser.add_argument("--ecc", choices=["l", "m", "q", "h"], default="m",
                        help="Correção de erro: l (baixo), m (médio), q (alto), h (máximo). Padrão: m.")
    parser.add_argument("--allow-plain", action="store_true",
                        help="Permite strings sem esquema/domínio (útil para payloads arbitrários).")
    args = parser.parse_args(argv)

    urls = collect_urls(args)

    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    created: List[Path] = []
    for u in urls:
        try:
            p = generate_qr_png(u, outdir, args.prefix, args.scale, args.border, args.ecc)
            created.append(p)
        except Exception as e:
            print(f"[ERRO] Falha ao gerar QR para '{u}': {e}", file=sys.stderr)

    if created:
        print(f"[OK] {len(created)} QR Code(s) gerado(s) em: {outdir.resolve()}")
        for p in created:
            print(f" - {p.name}")
        return 0
    else:
        print("[ERRO] Nenhum arquivo gerado.", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
