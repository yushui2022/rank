from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
GENERATED_ROOT = ROOT / "src" / "data" / "generated"
TRACKS_ROOT = GENERATED_ROOT / "tracks"


def extract_const(path: Path, name: str) -> Any:
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(
        rf"export const {re.escape(name)}(?:: [^=]+)? = (?P<payload>.*?);\s*(?:export|\Z)",
        re.DOTALL,
    )
    match = pattern.search(text)
    if not match:
        raise ValueError(f"Missing generated export {name!r} in {path}")
    return json.loads(match.group("payload").strip())


def fail(message: str) -> None:
    print(f"verify_generated_data: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    manifest_path = GENERATED_ROOT / "manifest.ts"
    entities_path = GENERATED_ROOT / "entities.ts"
    sources_path = GENERATED_ROOT / "sources.ts"
    if not manifest_path.exists():
        fail(f"missing manifest: {manifest_path}")
    if not entities_path.exists():
        fail(f"missing entities dataset: {entities_path}")
    if not sources_path.exists():
        fail(f"missing sources dataset: {sources_path}")
    if not TRACKS_ROOT.exists():
        fail(f"missing track data directory: {TRACKS_ROOT}")

    domains = extract_const(manifest_path, "domains")
    tracks = extract_const(manifest_path, "tracks")
    entity_track_index = extract_const(manifest_path, "entityTrackIndex")
    entities = {entity["id"]: entity for entity in extract_const(entities_path, "entities")}
    sources = {source["id"]: source for source in extract_const(sources_path, "sources")}

    if not domains:
        fail("manifest has no domains")
    if not tracks:
        fail("manifest has no tracks")
    if not entities:
        fail("entities dataset is empty")
    if not sources:
        fail("sources dataset is empty")

    domain_ids = {domain["id"] for domain in domains}
    track_ids = {track["id"] for track in tracks}
    checked_rows = 0
    checked_sources = 0

    for track in tracks:
        track_id = track["id"]
        if track.get("domainId") not in domain_ids:
            fail(f"track {track_id} references unknown domain {track.get('domainId')}")

        track_path = TRACKS_ROOT / f"{track_id}.ts"
        if not track_path.exists():
            fail(f"missing track dataset for {track_id}: {track_path}")

        dataset = extract_const(track_path, "trackDataset")
        if dataset.get("trackId") != track_id:
            fail(f"track dataset id mismatch in {track_path}")

        rankings = dataset.get("rankings", [])

        if not rankings:
            fail(f"track {track_id} has no ranking rows")
        if track.get("companyCount") != len(rankings):
            fail(
                f"track {track_id} companyCount={track.get('companyCount')} "
                f"but rankings={len(rankings)}"
            )

        track_source_count = sum(
            1 for source in sources.values() if source.get("trackId") == track_id
        )
        if track.get("sourceCount") != track_source_count:
            fail(
                f"track {track_id} sourceCount={track.get('sourceCount')} "
                f"but own sources={track_source_count}"
            )

        seen_ranks = set()
        for row in rankings:
            checked_rows += 1
            entity_id = row.get("entityId")
            rank = row.get("rank")
            if entity_id not in entities:
                fail(f"track {track_id} row rank {rank} references missing entity {entity_id}")
            if row.get("trackId") != track_id:
                fail(f"track {track_id} contains row for {row.get('trackId')}")
            if rank in seen_ranks:
                fail(f"track {track_id} duplicates rank {rank}")
            seen_ranks.add(rank)

            indexed_tracks = entity_track_index.get(entity_id, [])
            if track_id not in indexed_tracks:
                fail(f"entityTrackIndex missing {track_id} for {entity_id}")

            for source_id in row.get("sourceIds", []):
                if source_id not in sources:
                    fail(f"row {track_id}/{entity_id} references missing source {source_id}")

        checked_entity_ids = {row.get("entityId") for row in rankings}
        for entity_id in checked_entity_ids:
            entity = entities.get(entity_id)
            if not entity:
                fail(f"track {track_id} references missing entity {entity_id}")
            if track_id not in entity.get("trackIds", []):
                fail(f"entity {entity['id']} missing active track {track_id}")
            for source_id in entity.get("sourceIds", []):
                if source_id not in sources:
                    fail(f"entity {entity['id']} references missing source {source_id}")

        checked_sources += track_source_count

    extra_track_files = {
        path.stem for path in TRACKS_ROOT.glob("*.ts")
    } - track_ids
    if extra_track_files:
        fail(f"extra generated track files: {', '.join(sorted(extra_track_files))}")

    print(
        "Generated data verified: "
        f"{len(domains)} domains, {len(tracks)} tracks, "
        f"{len(entities)} entities, {checked_rows} ranking rows, "
        f"{len(sources)} sources, {checked_sources} track-owned source links."
    )


if __name__ == "__main__":
    main()
