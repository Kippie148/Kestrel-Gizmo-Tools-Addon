# Door Structure
The **Door** section is a bit more abstract then most other sections. It seems to handle **area loading** but it also sometimes has a 
reference to a **cutscene**. A lot about Doors is unknown now so more research is needed if we want to give it a good description.

## Entry
*The version seen is 10*
| Offset | Type | Size | Condition | Description |
| :----- | :----- | :----- | :----- | :----- |
| `0x198` | Float32 | 4 bytes | - | Unknown |
| `0x194` | Float32 | 4 bytes | - | Unknown |
| `0x190` | Float32 | 4 bytes | - | Unknown |
| `0x339` | Char | 1 byte | - | Unknown (could be bool) |
| `0x86` | Short | 2 bytes | - | Unknown |
| `0x84` | Short | 2 bytes | - | Unknown |
| `0x33c` | Uint32 | 4 bytes | - | Upcoming array amount |
| `-` | Section | Variable | Array amount != 0 | See: **[array structure](#Array-Structure)** |
| `0x426` | Fixed Block | 32 bytes | - | Destination name(s) |
| `0x428` | Fixed Block | 32 bytes | - | Special string |
| `0x42a` | Fixed Block | 32 bytes | - | Special string (again) |
| `0x338` | Char | 1 byte | - | Unknown |
| `0x33a` | Char | 1 byte | - | Unknown |
| `0x340` | int32 | 4 bytes | - | Unknown |
| `0x398` | Fixed Block | 32 bytes | - | Cutscene name + garbage |
| `-` | Short | 2 bytes | - | Amount of extra names |
| `-` | FixedBlock | 32 bytes | if extra names > 0 | Read extra name x amount above |
| `0x3bc` | NuVec | 12 bytes | - | Coords of Door? |
| `0x3b0` | Short | 2 bytes | - | Unknown |
| `0x3b4` | Short | 2 bytes | - | Unknown |
| `0x3b8` | Short | 2 bytes | if version >= 10 | Unknown |
| `-` | Char | 1 byte | - | Linked name length |
| `-` | Utf-8 | variable | if name length != 0 | Linked name |
| `-` | section | variable | - | Generic ending *(see: **[generic ending](../GIZ_Format_Documentation.md#Generic-Ending)**)* |
> [!NOTE]
> Linked names are not ever observed yet and they might very well never appear in **Lego City Undercover**.

## Array Structure
It is unknown what these array entries actually do at all.
| Type | Size | Description |
| :----- | :----- | :----- |
| Short | 2 bytes | Unkown |
| NuVec | 12 bytes | Some kind of coords |
| Short | 2 bytes | Unknown |

Click **[here](../GIZ_Format_Documentation.md#Long-Header-Sections)** to go back to the section selection.