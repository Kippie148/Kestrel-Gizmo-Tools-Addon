# TightRope Structure

The TightRope object is pretty understandable by name. It is a tight rope between two points. There is not a single type of rope but many different ones used by the game in different context. These can be found in: *`STUFF/ROPES.txt`*. All of these entries can also be used to create a rope between the points by setting the enum char to the right entry *(dont't forget that enums **start at 0**)*.

## Entry
*The version seen is 19.*
| Offset | Type | Size | Condition | Description |
| :----- | :----- | :----- | :----- | :----- |
| `-` | Uint8 | 1 byte | If version > 4 | Length of upcoming name with null |
| `0x58`  | Utf-8 | Variable | If version > 4 | Name of the entry |
| `0x160` | NuVec | 12 bytes | - | Coordinates of the first base |
| `0x16c` | NuVec | 12 bytes | - | Coordinates of the second base |
| `0x188` | NuVec | 12 bytes | If version > 3 | Set of Coordinates unknown purpose |
| `0x194` | NuVec | 12 bytes | If version > 3 | Unknown purpose coordinates |
| `0x1ac` | Ushort | 2 bytes | - | RotX 1 |
| `0x1ae` | Ushort | 2 bytes | - | RotX 2 |
| `0x1b0` | Ushort | 2 bytes | - | RotY 1 |
| `0x1b2` | Ushort | 2 bytes | - | RotY 2 |
| `0x1b4` | Bool | 1 byte | - | Base 1 invisible? |
| `0x1b5` | Bool | 1 byte | - | Base 2 invisible? |
| `0x1b6` | Char | 1 byte | If version != 2 | Unknown |
| `0x238` | Uint8 | 1 byte | If version > 6 | Enum about rope typ from `ROPES.txt` |
| `-` | Char | 1 byte | If version != 7 | Length of the AttachEndToSpecial |
| `Unk` | Unknown | Variable | if length char > 0 | AttachEndToSpecial block id 0 *(unknown)* |
| `-` | Char | 1 byte | If version != 7 | Length of the AttachEndToSpecial |
| `Unk` | Unknown | variable | if length char > 0 | AttachEndToSpecial block id 1 *(unknown)* |
| `0x23c` | Ushort | 2 bytes | If version > 8 | Unknown content, casted to 4 byte int |
| `0x240` | Ushort | 2 bytes | If version > 8 | Unknown content, casted to 4 byte int |
| `0x244` | Bool | 1 byte | if version != 9 | Defines ropes height *(low/high)* |
| `0x245` | Uchar | 1 byte | if version > 10 | Unknown |
| `0x246` | Bool | 1 byte | if version != 11 | Slow walking rope |
| `0x247` | Uchar | 1 byte | if version > 12 | Unkown |
| `0x248` | Bool | 1 byte | if version != 13 | Auto jump off? |
| `0x249` | Uchar | 1 byte | if version > 14 | Unknown |
| `0x24a` | Uchar | 1 byte | if version != 15 | Unknown |
| `0x24b` | Uchar | 1 byte | if version > 16 | Unknown |
| `0x24c` | Uchar | 1 byte | if version != 17 | Unknown |
| `0x24d` | Uchar | 1 byte | if version > 18 | Unknown |
| `Unk` | Section | variable | - | Generic ending *(see: **[generic ending](../GIZ_Format_Documentation.md#Generic-Ending)**)* |

> [!NOTE]
> I would guess that the AttachEndToSpecial is some kind of function to attach gizmo's to each other but I haven not seen any reference in all the files I've parsed so there is no good reference point for now.

Click **[here](../GIZ_Format_Documentation.md#Long-Header-Sections)** to go back to the section selection.