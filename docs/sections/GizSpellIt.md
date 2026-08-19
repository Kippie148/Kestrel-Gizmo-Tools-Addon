# GizSpellIt Structure

**GizSpellIt** is a class in the regular objects section for some of the gizmo's that can be build from individual lego pieces. However there is also
a section called **GizSpellIt** which I want to talk about here.

| Offset | Type | Size | Condition | Description |
| :----- | :----- | :----- | :----- | :----- |
| `0x200` | NuVec | 12 bytes | - | Unknown *(coords)* |
| `0x210` | NuVec | 12 bytes | - | Unknown *(coords)* |
| `0x220` | NuVec | 12 bytes | - | Unknown *(coords)* |
| `0x230` | NuVec | 12 bytes | - | Unknown *(coords)* |
| `-` | Section | Variable | - | GizmoFileReadGameAnimSet *(**see: [function](#GizmoFileReadGameAnimSet)**)* |
| `0x2ac` | Short | 2 bytes | - | Unknown |
| `0x2d0` | Char | 1 byte | - | Unknown |
| `0x2a8` | Float32 | 4 bytes | - | Unknown |
| `0x2a4` | Float32 | 4 bytes | - | Unknown |
| `0x28c` | Float32 | 4 bytes | - | Unknown |
| `0x290` | Float32 | 4 bytes | - | Unknown |
| `0x294` | Float32 | 4 bytes | - | Unknown |
| `0x298` | Float32 | 4 bytes | - | Unknown |
| `0x29c` | Float32 | 4 bytes | - | Unknown |
| `-` | Uint8 | 1 byte | - | Special name length |
| `0x400` | Utf-8 | variable | length != 0 | Result special system name |
| `0x2bc` | Short | 2 bytes | - | Unknown |
| `0x2be` | Short | 2 bytes | - | Unknown |
| `0x2b0` | NuVec | 12 bytes | - | Unknown *(no coords)* |
| `0x2c0` | Float32 | 4 bytes | - | Unknown |
| `0x2d4` | Uint32 | 4 bytes | - | Unknown |
| `0x2d8` | Uint32 | 4 bytes | - | Unknown |
| `-` | Char | 1 byte | - | Unknown |
| `0x1f0` | Short | 2 bytes | - | Unknown |
| `-` | Char | 1 byte | - | Used for coming block |
| `-` | Fixed block | 32 bytes | char above != 0 | Some name *(Does not appear in lcu)* |
| `0x40c` | Float32 | 4 bytes | version > 9 | Unknown |
| `0x2a0` | Float32 | 4 bytes | version > 9 | Unknown |

## GizmoFileReadGameAnimSet (shared function)
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
> This section is also seen in [GizObstacle](/GizObstacle.md).

Click **[here](../GIZ_Format_Documentation.md#Long-Header-Sections)** to go back to the section selection.