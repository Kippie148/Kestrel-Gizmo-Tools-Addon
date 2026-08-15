# GizObstacle Structure
There is a seperate section for `GizObstacle` but it is also used as a class in the regular objects. This section is for some of those entries also 
just **additional code** if they need it. The specific name get's referenced there and then it loads extra data for the object. 
It is not fully clear if all kinds of entries have the same rol or how they are triggered.
> [!WARNING]
> A lot is unknown so you won't get much context out of it.

## Entry
*The versions seen are 40, 41, 44, 46, 47.*
| Offset | Type | Size | Condition | Description |
| :----- | :----- | :----- | :----- | :----- |
| `0x180` | NuVec | 12 bytes | - | Holds coords |
| `0x2a0` | Float32 | 4 bytes | - | Unknown |
| `0x2a8` | Float32 | 4 bytes | - | Unknown |
| `0x2e0` | NuVec | 12 bytes | - | Not coords for once |
| `0x328` | Short | 2 bytes | - | Unknown |
| `0x2f0` | Uint64 | 8 bytes | if version > 39 | Unknown |
| `0x2f8` | Int32 | 4 bytes | - | Unknown |
| `0x400` | Char | 1 byte | - | Unknown |
| `0x401` | Char | 1 byte | - | Unkown |
| `0x2cc` | Float32 | 4 bytes | - | Unknown |
| `0x2c8` | Float32 | 4 bytes | - | Unknown |
| `0x2d0` | Float32 | 4 bytes | - | Unknown |
| `0x2d4` | Float32 | 4 bytes | - | Unknown |
| `0x300` | Float32 | 4 bytes | - | Unknown |
| `0x402` | Char | 1 byte | - | Seen multiple times as `ff` |
| `-` | Section | Variable | - | GizmoFileReadGameAnimSet *(**see: [function](#GizmoFileReadGameAnimSet)**)* |
| `0x2b0` | Float32 | 4 bytes | - | Uses NuFloatToHalf and stores it in `0x700` |
| `0x2b4` | Float32 | 4 bytes | - | Uses NuFloatToHalf and stores it in `0x2be` |
| `0x2c0` | Float32 | 4 bytes | - | Unknown |
| `0x33c` | Int32 | 4 bytes | - | Unknown |
| `0x314` | Short | 2 bytes | - | Unkown |
| `0x316` | Short | 2 bytes | - | Unkown |
| `0x308` | NuVec | 12 bytes | - | Unkown |
| `0x318` | Float32 | 4 bytes | - | Unknown |
| `0x33a` | Short | 2 bytes | - | Unkown |
| `-` | Uint8 | 1 byte | - | Sound id name length |
| `0x340` | Utf-8 | variable | - | Sound if name *(direct lookup to store short on mem adress)* |
| `-` | Uint8 | 1 byte | - | Sound id 2 name length |
| `0x342` | Utf-8 | variable | - | Sound if name 2 *(direct lookup to store short on mem adress)* |
| `-` | Uint8 | 1 byte | Some name length |
| `0x278` | utf-8 | variable | Some name, unknown what |
| `0x2fc` | Short | 2 bytes | - | Unkown |
| `0x2fe` | Short | 2 bytes | - | Unkown |
| `-` | Uint8 | 1 byte | - | Extra name length |
| `0x288` | Utf-8 | variable | - | Extra name *(special system lookup)* |
| `0x403` | Char | 1 byte | - | Unkown |
| `0x405` | Char | 1 byte | - | Unkown |
| `0x406` | Char | 1 byte | - | Unkown |
| `-` | Uint8 | 1 byte | - | linked name length? |
| `-` | Utf-8 | variable | - | linked name? |
| `0x338` | Short | 2 bytes | - | Unknown |
| `-` | Section | variable | - | Generic ending *(see: **[generic ending](../GIZ_Format_Documentation.md#Generic-Ending)**)* |
> [!NOTE]
> Some context for NuFloatToHalf:
> It takes in a **single precision float** (`32 bits`) and turns it into a **half precision float** (`16 bits`).

## GizmoFileReadGameAnimSet
*Structure for version > 2 that is only used by GizObstacle.*
| Type | Size | Description |
| :----- | :----- | :----- |
| Uint8 | 1 byte | Length of upcoming name |
| Utf-8 | variable | Name of animation |
| Float32 | 4 bytes | Unknown |
| Float32 | 4 bytes | Unknown |
| Int | 4 bytes | Unknown |
> [!CAUTION]
> There are 2 bytes **missing** from this structure!  
> What they are, mean or do is unknown.

Click **[here](../GIZ_Format_Documentation.md#Long-Header-Sections)** to go back to the section selection.