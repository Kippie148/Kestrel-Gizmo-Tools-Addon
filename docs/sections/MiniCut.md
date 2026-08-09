# MiniCut Structure
The MiniCut section has information about the small ingame mini cutscenes. Some context is still missing but a lot of important information is 
known as you can see below.  
The most important usage of this section is writing down the positions of individual mini-cutscene points with some specific data about the points
so the ingame camera knows how to move. Sadly these entries seem to be not enough for making a cutscene. The entries do control the **camera's** movement paths, transition speed, rotation and for some stuff delays but there seems to be another file that controls the real **internal MiniCut 
flow** *(Could be GizFlow as part of `.led`)*. That means that any changes made to speed don't affect the cutscene length and the camera will jump around if needed for the internal flow.
> [!NOTE]
> Some more reasearch into `.led` can be very valuable for this section.

## Main Entry
*The version seen is 7.*
| Offset | Type | Size | Condition | Description |
| :----- | :----- | :----- | :----- | :----- |
| `-` | Int8 | 1 byte | - | Length of upcoming name with null |
| `0x58` | Utf-8 | variable | - | Name of entry |
| `-` | Char | 1 byte | If version > 1 | Unknown |
| `0xf60` | Float32 | 4 bytes | - | Unknown *(causes start delay)* |
| `0xf64` | Float32 | 4 bytes | - | Unknown |
| `0xf68` | Float32 | 4 bytes | - | Starting movement delay |
| `0xf6c` | Float32 | 4 bytes | - | Slowdown camera animation |
| `0xf70` | Float32 | 4 bytes | - | Unknown |
| `0xf58` | Uint8 | 1 byte | - | Cutscene parts casted to full int32 |
| `-` | Section | variable | if char above > 0 | [Cutscene subentries](#subentry) loop if condition true else restart loop |
| `0xf74` | Uchar | 1 byte | - | Unknown *(very high values gives weird rotation the whole cutscene)* |
| `-` | Section | variable | - | Generic ending *(see: **[generic ending](../GIZ_Format_Documentation.md#Generic-Ending)**)* |

## Subentry
This is the newer version of the subentry and the comparison between types of subentries happens in the **main entry**. The other version is used when version < 7.
| Offset | Type | Size | Description |
| :----- | :----- | :----- | :----- |
| `-` | Int8 | 1 byte | Subentry name length |
| `0x170` | Utf-8 | variable | Name *(does not appear much)* |
| `0x1a0` | Float32 | 4 bytes | X position |
| `0x1a4` | Float32 | 4 bytes | Y position |
| `0x1a8` | Float32 | 4 bytes | Z position |
| `0x1ac` | Float32 | 4 bytes | Camera zoom |
| `0x1b0` | Ushort | 2 bytes | X rotation |
| `0x1b2` | Ushort | 2 bytes | Y rotation |
| `0x1b4` | Ushort | 2 bytes | Z rotation |
| `0x1b8` | Float32 | 4 bytes | Transition
| `0x1bc` | Float32 | 4 bytes | Unknown *(0 skips the animation between points)* |
| `0x1c0` | Float32 | 4 bytes | Unknown |
| `-` | Uchar | 1 byte | Might be bool, value 1 locks all the camera movement between points |

Click **[here](../GIZ_Format_Documentation.md#Long-Header-Sections)** to go back to the section selection.