# GIZ File Format — Reverse Engineering Documentation

This document describes the findings from reverse engineering the `.GIZ` file format used in LEGO City Undercover. The format is binary, little-endian, and contains multiple sections, each with its own structure. Not everything has been fully decoded — unknown or uncertain fields are marked as such.

## General File Structure

A `.GIZ` file broadly consists of:

1. An **special types section** at the beginning of the file there are some unknown specific types for cutscens or special types like ledges, grapple or cutscenes.  There is also extra information that is used by later objects.
2. A block with **coins gizmo's**. These are have their own format that is different from regular objects. 
3. One or more **object sections**, which have specific types based on how they have to be spawned and work in a predictable format.

Sections are not strictly defined by offset and files can have blocks mixed in different ways; they must be located by searching for known class names/section names as anchor points within the buffer.

# Special Types of Gizmo's

These types are not all fully understood yet and have been written slightly different based on what they need to do. The types below are partially reverse engineered but do they are not understood enough to write them yet. Some interpretation is still speculation. Only ledge can be parsed pretty precisely. Grapple, Tube and Tightrope do have a pretty good patern but they are not confirmed yet. The headers are now mostly understandable but a few have extra params that are unknown. Some of the new special types are also only tested on SF_ROOFTOP.GIZ for now.

## Special Types Headers

The general structure of the header is pretty clear only the second variable is not fully sure but very likely right. Some types do seem to use more then just the template header but that is further specified in the individual documentation.
Generic header:

```
[uint32: header name length][ASCII: type specifier]
[uint32: upcoming block size starts after these 4 bytes]
[uint32: some kind of type identifier]
[uint32: amount of entries in this block]
```

## Ledge Section

Header signature: 4-byte length prefix (`05 00 00 00`) followed by ASCII `"Ledge"` (no null terminator on the class name itself — the length is explicit, just like with coins).

```
[generic template header]
[uint32: might be a extra parameter but unknown]
[2 bytes unknown]
```

This is followed by a series of individual, named point entries (`ledge1`, `ledge2`, ... sequentially numbered, with gaps in the numbering):

```
[1 byte: nameLen][name: e.g. "ledge49"][00 null]
[intermediate block of variable length — not fully decoded]
[1 byte: linkNameLen][link name: e.g. "ledge"][00 null]   ← optional, not every entry has this
[12 bytes: position x,y,z floats]
[footer, variable length — mostly zeros]
```

Each ledge refers to another ledge name through the `linkedTo` field. This forms a **graph** (not a strict linear chain) — some links are bidirectional (A→B and later B→A with nearly identical positions), while others are one-way or entirely absent (standalone ledges without a link but this might be a problem in the parsing system now or just a thing the game does).

**Recommended processing:** treat `linkedTo` as an edge in a graph and determine connected components (BFS/DFS) to group related ledges together — see `groupLedgesByConnection` in the parser. Verified: chains with small, incremental position changes (for example only along the z-axis) correspond to the parkour hanging ledge structure which probably get their inbetween pole position and length determined by the positions of the ledge entries.

**Open questions:** the exact contents of the intermediate block before the (optional) link name, the precise meaning of the footer bytes, and confirm object type between files.

## TightRope Section

Header signature: 4-bytes length prefix + ASCII `"TightRope"`, followed by the header. 

```
[uint32: length=9]["TightRope"]
[Generic template header]
```

Per rope entry (numbered, e.g. `tightrope1`, `tightrope2`, and an unnamed `tightrope`):

```
[1 byte: nameLen][name][00 null]
[N × 12 bytes: consecutive (x,y,z) float triples — variable count, until the first invalid/garbage triple]
```

Each rope name appears **twice**:
- 1st occurrence: the first to are the positions of the bases that get connected by the game itself. The other 2 are unknown and have weird placements as coördinates. + 2 or 1 additional slot(s) might be in there too that do not appear to contain valid positions (possibly separate parameters, not confirmed).
- 2nd occurrence: 1 (or 2) point(s), sometimes identical to one of the 4 main points, sometimes a completely new standalone point — presumably an anchor point for interaction or possibly the spawning point for the start of end object of the rope. This needs to be investigated more.

**Parsing stop condition:** as soon as an entry no longer yields a valid (x,y,z) triple, you have exited the TightRope section and are probably already in the regular object list (GizObstacle/GIZSIMPLEPROPOBJECT, etc.).

**Open question:** the exact meaning of the 2 additional slots in the first occurrence and the relationship between the anchor point and the curve.

## Grapple Section

Header: 4-byte length prefix + ASCII `"Grapple"` + header ints.

```
[uint32: length=7]["Grapple"]
[Generic template header]
[unknown variable-length remainder of the header before the first name]
```

Per grapple point (numbered with gaps by devs, e.g. `grapple1`, `grapple2`, `grapple4`, and an unnamed `grapple`):

```
[1 byte: nameLen][name][00 null]
[12 bytes: position x,y,z]
[1st footer: 25 bytes — contains, among other things, the presumed trigger radius]
repetition of the same name:
[1 byte: nameLen][name][00 null]
[12 bytes: identical position]
[2nd footer: variable length (up to 88 bytes observed) — are probably additional parameters]
```

### 1st Footer — Identified Fields (offsets relative to footer start):
```
offset 2  : float, always 1.0 (constant)
offset 7  : float — presumed trigger radius/swing length (values 1.08–1.70 observed)
offset 16 : byte ("flagA") — observed values 0 and 7
offset 19 : byte ("flagB") — correlates with radius: radius 1.7 → flagB 35 (0x23); smaller radius → flagB 3 (0x03)
```

### 2nd Footer — Additional Floats Not Yet Fully Understood

Contains a varying number of small floats per grapple (often around 0.5, or an outlier such as -71.68 that may represent an angle in degrees). Not every grapple contains the same amount of data here; some are nearly empty.

**Hypothesis (not yet 100% confirmed, but consistent with in-game behavior):** grapples with radius ≈1.7/flagB 35 are points that trigger an interaction popup from a larger range and/or multiple angles; grapples with a smaller radius/flagB 3 are stricter, short-range triggers. One grapple with a notable angle value (-71.68°) in the 2nd footer may have a unique swing direction or might be a trigger for a specific action.


# Coins And Other Pickups Section (GizmoPickup)

Header signature: hex `47697a6d6f5069636b7570` = ASCII `"GizmoPickup"`.

```
[header: "GizmoPickup" as a standalone string, no length prefix in this form]
... at offset headerIndex+19: [uint32LE: entry count]
... entries begin at offset headerIndex+51
```

Per coin entry:
```
[4 bytes: typeHex]       → matches known coin-type table (see objectsList in parser)
[6 bytes unknown/padding]
[1 byte: strLen, including null terminator]
[string of strLen-1 bytes][00 null]
[4 bytes float: x]
[4 bytes float: y]
[4 bytes float: z]
[10-byte footer, fixed — contents not yet decoded]
```

Known type hex values (see `objectsList` in the parser code):
```
67000000 Coin_Gold_1      73000000 Coin_Silver_1    6a000000 Coin_Blue_1
67000002 Coin_Gold_2      73000002 Coin_Silver_2     50000000 Coin_Blue_2
70000000 Coin_Purple      77850000 Shield_TL         62000000 Coin_Blue_3
78850000 Shield_TR        7a000000 Token_1           72000000 Brick_Red
7a000400 Token_2          7a010000 Token_3
```

note: 
These are know to have issues with the coins and pickups parser. They seem to have some strange formatting which confuses the parser so it writes garbage information.
```
- SCRAPYARD_ENTRANCE_TECH.GIZ,
- MINE_CAVERN.GIZ,
- MINE_FREEFALL_TECH.GIZ
- MOONBASE2_ROCKETCOCKPIT.GIZ
```

# Regular Objects (GizObstacle, ComplexGizmo, GizItem, GizSpellIt, GIZSIMPLEPROPOBJECT, ...)

These objects share one common pattern. There is **no global header with an entry count** for this entire list — the parser must use known class names as anchors and search backward from them to find the start of an entry.

```
[1 byte: nameLen, including null terminator]
[name string of nameLen-1 bytes][00 null]
[1 byte: classLen, including null terminator]
[class/type string of classLen-1 bytes][00 null]
[1 byte: idLen, including null terminator]
[id string of idLen-1 bytes][00 null]   (idLen ≤ 1 → id = "UNKNOWN")
[4 bytes float: x]
[4 bytes float: y]
[4 bytes float: z]
[1 byte flag]
[2 bytes int: rotY]
[2 bytes int: rotX]
[endLine: variable length (includes flag and rotation), see below]
```

The type field is read **individually for each entry** — there is no "last seen type" inheritance. Known class names are only needed to (a) locate the first starting point in the buffer and (b) validate the boundary with the next entry.

## EndLine Structure (Variable Length)

Based what is know now about the endline but most is just guessing:

```
[1 byte: flags]
[2 bytes Int16LE: rotY (must be included empty for spawning endline)]
[2 bytes Int16LE: rotX (must be included empty for spawning endline)]
[1 byte unknown, possibly related to decompiled offset 0xc2]
[4 bytes: int, unknown]
[1 byte: AttachTo flag]
  0x00 → no extra data, endLine ends here (total 8–9 bytes)
  0x03 → [1 byte len][string][1 byte] (short name reference + 1 extra byte)
  0x01 → [1 byte len][string][12 bytes (3 floats)] (name reference + position)
```

There is strong evidence that this reference name points to **another object in the same list** — probably an "attached to" or "trigger target" relationship. The length of the endLine differs exactly by the length difference of the referenced name (e.g. `iHWallRunPad1` versus `iHWallRunPad`: a 1-byte difference in endLine length).

**Important:** a fixed endLine size does not work. The robust approach is to scan forward until the next valid entry name is found (see `readEndBuf`/`isValidEntryAt` in the parser).

**Open question:** the exact meaning of most fields in the fixed 8–9 byte core (except rotY/rotX) has not yet been confirmed.


## Common Parsing Strategy

For all "named point list" sections (Ledge, TightRope, Grapple), the same approach applies:

1. Search for the section name with a **validated length prefix** preceding it (prevents false matches such as "Grapple" inside "GrappleSatellite").
2. Skip a fixed number of header integers (varies per section type — still determined empirically on a case-by-case basis, no universal constant).
3. Search forward for the first valid `[lengthByte][printable name][00]` structure.
4. Read position/data, then search **forward again** (not using a fixed offset!) for the next valid name to determine the footer size.
5. Stop once no valid name/position can be found within a reasonable search window (100–200 bytes) — this is the signal that you have exited the section.

See `findNextValidName`, `isValidEntryAt`, and `exploreNamedPointSection` in the parser code for the generic implementation of this approach.

## Known Open Questions

- Exact meaning of most "header ints" per section (Ledge, TightRope, Grapple) — some appear to be counts, others remain unidentified.
- The intermediate block before the optional second name in Ledge entries.
- The exact role of the 2 additional slots after the 4 main points in TightRope.
- Full meaning of the 2nd footer in Grapple entries (aside from the trigger-radius hypothesis).
- Includes section: minor ambiguity in the string-length counting method (see above).
- There are likely more section types following this "length prefix + name + header ints + point list" pattern that have not yet been specifically investigated (e.g. Door, MiniCut, Message — these have been seen in raw dumps but not yet analyzed separately like Ledge/TightRope/Grapple).
- Writing (saving modified/new data back into this format) has not yet been implemented for the "named point list" sections — only reading is currently robust.

## Reference: Known Class/Section Names Observed So Far

```
GizObstacle, ComplexGizmo, GizItem, GizSpellIt, GIZSIMPLEPROPOBJECT,
Ledge, TightRope, Grapple, MiniCut, Door, Blowup, Ladder, GizSwitch,
GizTimer, GizSuperBuild, Message, DefaultDecal
```

Not every name in this list has already been successfully parsed as a separate section type — some are included here purely because the names were visible in raw byte dumps.
