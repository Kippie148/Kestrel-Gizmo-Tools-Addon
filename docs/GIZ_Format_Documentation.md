# GIZ File Format (Lego City Undercover) — Reverse Engineering Documentation

This document describes the findings from reverse engineering the `.GIZ` file format used in LEGO City Undercover. The format is binary, little-endian, and contains multiple sections, each with its own structure. Not everything is already understood — unknown or uncertain fields are marked as such.

## General File Structure

A `.GIZ` file broadly consists of:

1. An **special types section** at the beginning of the file there are some specific types of gizmo's like ledges, grapple or MiniCut. These are using a older format also known in classic tt lego games like TCS, LIJ1 and LB1 but those games only use these special types.
2. A block with **pickup gizmo's**. This is technicly a special type but the block is pretty important and exists in every file so i mention it here specificly. 
3. An **object sections**, which have specific types based on how they have to be spawned and work in a predictable format and the block looks to be always the last one (not fully confirmed).

Sections are not strictly defined by offset and files can have blocks mixed in different ways; they must be located by searching for known class names/section names as anchor points within the buffer.

## Special types of gizmo's

These types are not all fully understood yet and have been written slightly different based on what they need to do. Most of the types below are partially reverse engineered but they are not understood well enough to write them yet. Some interpretation is still speculation. Only ledge is intergrated for now but the other special types do have good paterns, good enough to parse them partially with usefull information. We have a good idea how the special types header works so they can alos be intergrated to make finding positions easier.
> [!NOTE]
> Some of the new special types are only tested on SF_ROOFTOP.GIZ for now.

## Special Types Headers

The general structure of the header is fully clear, allmost all special types use the exact same format but because of a few object data blocks that don't use the full header I can't expend it here even though most of the special blocks use the same extra 8 bytes structure after this start. Most headers have a version uint32 after the block length. I will note there which version is already seen for that specific type.

**General header structure:**
| Type | Size | Description |
| :-- | :-- | :-- |
| uint32 | 4 bytes | Header name length |
| string | variable | Header name (no null)|
| uint32 | 4 bytes | Block length |

## Pole Section

The pole sections places invisible poles on the map that are used to make other objects seem climable. So this type is made to easily make other objects work like a pole would.
> [!TIP]
> Examples of ingame use: The beanstalk in the second robber open world missions has a pole overlayed.

**Pole header structure:**
| Type | Size | Description |
| :-- | :-- | :-- |
|  -  | 12 bytes | Starts with general header |
| uint32 | 4 bytes | Type version `(seen: 3)` |
| uint32 | 4 bytes | Amount of entries |
| - | 2 bytes | Most headers end with `00 00` |

What is part of the entry is not fully clear. All the files I have seen only have one single pole entry. This makes it hard to define if the next section until the entry name belongs to the header or entry itself.
> [!NOTE]
> Also only tested on one file for now. Needs more.

**Pole entry structure:**
| Type | Size | Description |
| :-- | :-- | :-- |
| float32 | 4 bytes | Height of the pole |
| float32 | 4 bytes | With of the pole |
|  -  | 32 bytes | Unknown (seen with only zeroes) |
| uint8 | 1 bytes | length: (name + null) |
| string | variable | Entry name + null |
| float32 | 12 bytes | x,y,z coördinates |
| - | 10 bytes | Unknown (seen with only zeroes) |

The empty blocks are still a mystery but those might also be empty space. This type is rearely used so it is a bit harder to find many test examples for testing.
> [!NOTE]
> The name of this type might seem to refer to the parkour poles/pipes but these are different. These poles can only be placed over objects with mesh and go straight up.

**Open questions:** what do the 2 empty blocks mean? Is it just padding?

## Ledge Section

What kind of objects Ledge specificly holds is not fully clear. For now these are observed as the ledges which Chase can hold on to parkour. It could hold more then only that kind of ledge but that needs to be figured out first.

**Ledge header structure:**
| Type | Size | Description |
| :-- | :-- | :-- |
|   -  | 13 bytes | Starts with the general header |
| uint32 | 4 bytes | Type version `(seen: 10)` |
| uint32 | 4 bytes | Amount of entries |
| uint32 | 4 bytes | Unkown yet (often seen 0) |
| - | 2 bytes | Most headers end with `00 00` |
> The type version most of the time changes the amount of data in the specific header.

The entries could also have a identifiër for what type it is in them but that needs some research in the unknown blocks below.

**Ledge entry structure:**
| Type | Size | Description |
| :-- | :-- | :-- |
| uint8 | 1 byte | Length: (name + null) |
| string | variable | name + null |
|  -  | variable | Unknown content |
| uint8 | 1 bytes | Length (linked name + null) |
| string | variable | Linked name + null |
| float32 | 12 bytes | x,y,z coördinates |
|  -  | variable | Ends with unknown block (mostly zeroes) |


Each ledge refers to another ledge name through the `linked name`. This forms a **graph** (not a strict linear chain) — some links are bidirectional (A→B and later B→A with nearly identical positions), while others are one-way or entirely absent (standalone ledges without a link but this might be a problem in the parsing system now).
> [!NOTE]
> Verified: chains with small, incremental position changes (for example only along the z-axis) correspond to the parkour hanging ledge structure which probably get their inbetween pole position and length determined by the positions of the ledge entries

**Recommended processing:** treat `linkedTo` as an edge in a graph and determine connected components (BFS/DFS) to group related ledges together — done by `groupLedgesByConnection` in the parser.

**Open questions:** the exact contents of the intermediate block before the (optional) link name, the precise meaning of the ending bytes, and look if Ledges holds one kind object or multiple different.

## TightRope Section

This type places tightropes in the game like the name suggests. These can be al sorts of ropes/chains, *see: STUFF/ROPES.txt*, much about this type is still unknown but some key parts can already be parsed.

**TightRope header structure:**
| Type | Size | Description |
| :-- | :-- | :-- |
|  -  | 17 bytes | starts with general header |
| uint32 | 4 bytes | type version `(seen: 19)`|
| uint32 | 4 bytes | amount of entries |

The standalone entries have a lot of unknown data for now but position data can be gathered and edited.

**TightRope entry structure:**
| Type | Size | Description |
| :-- | :-- | :-- |
| uint8 | 1 byte | length: (name + null) |
| string | variable | name + null |
| float32 | 12 bytes | x,y,z coördinates startingpoint |
| float32 | 12 bytes | x,y,z coördinates endpoint |
| float32 | 12 bytes | x,y,z unknown |
| float32 | 12 bytes | x,y,z unkown |
| - | 28 bytes | unknown, has resonable floats in it |
| uint8 | 1 byte | length: (name + null) |
| string | variable | name + null (exact copy of first name) |
| float32 | 12 bytes | x,y,z unknown |
| - | 10 bytes | unknown data (test has resonable int at +4) |
> [!WARNING]
> Not enough entries has this been tested on and the bigger entry with six sets of coördinates is not included yet.

Each rope name appears **twice**:
- 1st occurrence: the first 2 sets of coördinates define the base and the end of the rope but the 2/4 additional slots are not known why they exist but they do. More testing required.
- 2nd occurrence: 1 (or 2) point(s), sometimes identical to one of the 4 main points, sometimes a completely new standalone point - I don't know the purpose of them.

**Open question:** the exact meaning of the 2/4 additional slots in the first occurrence, the purpose of the second occurence and the unkown blocks inbetween.

## Grapple Section

What the grapple type exactly does is not known yet but we can at least get some information out of it and parsing it might give more insight in what it does ingame. This header structure does need te be updated later because this is based on to little research. Take the structure with a grain of salt for now.

**Grapple header structure:**
| Type | Size | Description |
| :-- | :-- | :-- |
|  -  | 15 bytes | Starts with general header |
| uint32 | 4 bytes | Type version `(seen: 18)` |
| uint32 | 4 bytes | Amount of entries |
| uint32 | 4 bytes | unknown could also be 2x (u)int16 |
| float32 | 4 bytes | unknown |
| uint32 | 4 bytes | unknown could also be 2x (u)int16 |
|  -  | 12 bytes | unknown |
| float32 | 4 bytes | unknown |
|  -  | 50 bytes | unknown |

The specific entries are as hard to understand. This type will need a lot more work.

**Grapple entry structure:**
| Type | Size | Description |
| :-- | :-- | :-- |
| uint8 | 1 byte | length: (name + null) |
| string | variable | name + null |
| float32 | 12 bytes | x,y,z coördinates |
| - | 25 bytes | first footer |
| uint8 | 1 byte | length: (name + null) |
| string | variable | name + null |
| float32 | 12 bytes | same x,y,z again |
| - | variable | second footer | 

These are the hypothesis of what the footers could mean or contain for now. Var types could also still change.

**Footer 1 hypothesis structure:**
| Offset | Type | Size | Description |
| :-- | :-- | :-- | :-- |
| 3 | float32 | 4 bytes | some kind of float only seen as: `1.0` |
| 7 | bool | 1 byte | unknown |
| 8 | float32 | 4 bytes | resonable float but offset 10 also gives a resonable float |
| 12 | bool | 1 byte | unknown |
| 13 | int16 | 2 bytes | unknown |
| 15 | int16 | 2 bytes | unknown |
| 17 | int16 | 2 bytes | unknown seen values: `0 and 7` |
| 19 | int16 | 2 bytes | unknown |



**Footer 2 hypothesis structure:**

| Offset | Type | Size | Description |
| :-- | :-- | :-- | :-- |
| 11 | int32 | 4 bytes | unknown if even int32 |
| 15 | float32 | 4 bytes | might be some angel |
| 19 | int32 | 4 bytes | unknown int length yet |
| 34 | float32 | 4 bytes | float might also be some angle |
| 38 | int32 | 4 bytes | some kind of int but size unknown |

>[!CAUTION]
> This whole section will probably get updated pretty quickly because it is mostly guessing now.

**Open question:** a lot must be done still but just testing values and coming up with new idea's is the most important.

## Coins And Other Pickups Section (GizmoPickup)

GizmoPickups is most of the time a huge block in the file. It contains all kinds of pickups like coins, but also red bricks, character tokens and shieldpieces.
Header signature in kestrel fusion map manager: hex `47697a6d6f5069636b7570` = ASCII `"GizmoPickup"`.

**Header GizmoPickup structure:**
| Type | Size | Description |
| :-- | :-- | :-- |
| - | 19 bytes | Starts with standard header |
| uint32 | 4 bytes | version `(seen: 14)` |
| uint32 | 4 bytes | Amount of entries |
| - | 4 bytes | unknown seen empty |
| float32 | 4 bytes | Draw distance? |
| float32 | 4 bytes | Scale? |
| float32 | 4 bytes | unknown |
| float32 | 4 bytes | unknown |
| float32 | 4 bytes | unknown |
| float32 | 4 bytes | unknown |
| float32 | 4 bytes | unknown |
| int16 | 2 bytes | unknown |

This is the first type of gizmo we can actually write now with the kestrel fusion launcher map manager.

**GizmoPickup entry structure:**
| Type | Size | Description |
| :-- | :-- | :-- |
| hex | 4 bytes | this hex defines the kind of pickup spawned |
| - | 6 bytes | unknown (padding?) |
| uint8 | 1 bytes | length: (name + null) |
| string | variable | name + null |
| float32 | 12 bytes | x,y,z coördinates |
| - | 10 bytes | unknown |

The different types of pickups can be found and written by using these hex paterns:

**Known type hex values (see `objectsList` in the parser code):**
| Object | Hex | | Object | Hex |
| :-- | :-- | :-- | :-- | :-- |
| Coin_Gold_1 | `67000000` | | Coin_Silver_1 | `73000000` |
| Coin_Gold_2 | `67000002` | | Coin_Silver_2 | `73000002` |
| Coin_Blue_1 | `6a000000` | | Coin_Purple | `70000000` |
| Coin_Blue_2 | `50000000` | | Token_1 | `7a000000` |
| Coin_Blue_3 | `62000000` | | Token_2 | `7a000400` |
| Shield_TL | `77850000` | | Token_3 | `7a010000` |
| Shield_TR | `78850000` | | Brick_Red | `72000000` |

> [!NOTE] 
> These are know to have issues with the coins and pickups parser. They seem to have some strange formatting which confuses the parser so it writes garbage information.
> - SCRAPYARD_ENTRANCE_TECH.GIZ
> - MINE_CAVERN.GIZ
> - MINE_FREEFALL_TECH.GIZ
> - MOONBASE2_ROCKETCOCKPIT.GIZ

## Regular Objects (GizObstacle, ComplexGizmo, GizItem, GizSpellIt, GIZSIMPLEPROPOBJECT, ...)

This is the most important part of the giz files for modding. These objects share one common pattern. There is **no global header with an entry count** for this entire list — the parser must use known class names as anchors and search backward from them to find the start of an entry.

**Regular objects structure:**
| Type | Size | Description |
| :-- | :-- | :-- |
| uint8 | 1 byte | length: (name + null) |
| string | variable | name + null |
| uint8 | 1 byte | length: (class name + null) |
| string | variable | class name |
| uint8 | 1 byte | id length (id + null) |
| string | variable | id name + null |
| float32 | 12 bytes | x,y,z coördinates |
| - | variable | see endline structure |

The type field is read **individually for each entry** — there is no "last seen type" inheritance. Known class names are only needed to (a) locate the first starting point in the buffer and (b) validate the boundary with the next entry.

### EndLine Structure (Variable Length)

Based what is know now about the endline but most is just guessing:

**Entry endline structure:**
| Type | Size | Description | 
| :-- | :-- | :-- |
| bool | 1 byte | might be flag |
| uint16 | 2 bytes | rotation y |
| uint16 | 2 bytes | rotation x |
| bool | 2 bytes | might be flags |
| int32 | 4 bytes | unknown might be int |
| - | 3 bytes | unknown |
| int32 | 4 bytes | unknown might be int |
| int8 | 1 byte | might be int8? |
| uint8 | 1 byte | length: (link name + null) |
| string | variable | name + null |
| - | 3 bytes | unknown |
| float32 | 4 bytes | likely float |
| - | 5 bytes | unknown |
| int32 | 4 bytes | possible int

> [!CAUTION]
> The endline needs to be researched more. Also the shorter version still needs to be added.

The link name is a reference to a entry in **extra object blocks at the start of the file.** — it is probably just a link so the structure of the regular objects stay easy. The longer endline with the reference is used by a select small group of objects that for example need a target like `Catapult` objects. They do link to a block that has the same name as the class of the object itself (e.g. `GizObstacle`, `GIZSIMPLEPROBOBJECT` or `GizSpellit`).

**Important:** There is a standard endline that can be used but it can not be used universally. The robust approach is to scan forward until the next valid entry name length is found. The endline must have the rotation cleaned at the start to be used in the map manager.

## Reference: Known Class/Section Names Observed So Far

Not every name in this list has already been successfully parsed as a separate section type — some are included here purely because the names were visible in raw byte dumps.

> [!NOTE]
>
> - GizObstacle
> - GIZSIMPLEPROBOBJECT
> - ComplexGizmo
> - GizSpellit
> - GizSuperBuild
> - GizmoPickup
> - TightRope
> - MiniCut
> - Grapple
> - Ladder
> - Ledge
> - Blowup
> - Techno
> - Pole
> - Tube
