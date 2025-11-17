#!/usr/bin/env python3
"""Convert phpstan JSON output into a minimal SARIF 2.1.0 file.

Usage: phpstan_json_to_sarif.py input.json output.sarif
"""
import json
import sys
from pathlib import Path


def to_sarif(input_path: Path, output_path: Path):
    data = json.loads(input_path.read_text())

    runs = []
    tool = {
        "driver": {
            "name": "PHPStan",
            "informationUri": "https://phpstan.org/",
            "rules": []
        }
    }

    results = []
    rule_index = {}

    files = data.get("files", {})
    for file_path, info in files.items():
        messages = info.get("messages", [])
        for m in messages:
            msg_text = m.get("message") or m.get("description") or ""
            line = m.get("line") or None
            identifier = m.get("identifier") or m.get("messageIdentifier") or "phpstan"

            # register rule
            if identifier not in rule_index:
                rule_index[identifier] = len(tool["driver"]["rules"])  # index
                tool["driver"]["rules"].append({
                    "id": identifier,
                    "shortDescription": {"text": identifier},
                    "helpUri": "https://phpstan.org/"
                })

            result = {
                "ruleId": identifier,
                "message": {"text": msg_text},
                "locations": [
                    {
                        "physicalLocation": {
                            "artifactLocation": {"uri": file_path},
                            "region": {"startLine": line} if line else {}
                        }
                    }
                ]
            }
            results.append(result)

    runs.append({"tool": tool, "results": results})

    sarif = {"$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0.json", "version": "2.1.0", "runs": runs}

    output_path.write_text(json.dumps(sarif, indent=2))


def main():
    if len(sys.argv) < 3:
        print("Usage: phpstan_json_to_sarif.py input.json output.sarif")
        sys.exit(2)
    inp = Path(sys.argv[1])
    out = Path(sys.argv[2])
    if not inp.exists():
        print(f"Input file {inp} does not exist")
        sys.exit(1)
    try:
        to_sarif(inp, out)
        print(f"Wrote SARIF to {out}")
    except Exception as e:
        print(f"Conversion failed: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
