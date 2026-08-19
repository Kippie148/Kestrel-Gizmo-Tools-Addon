# Tube Structure

Ingame **Tube** can be seen as any point where some stream of water or air takes Chase up into the air *(Example: The water stream from Rex's toilet)*.
**Tube** itself is invisible so another effect has to be overlayed to give it a good look.

## Entry
| Offset | Type | Size | Condition | Description |
| :---- | :---- | :---- | :---- | :---- |
| `0x86` | Ushort | 2 bytes | - | Unknown |
| `0x160` | Float32 | 4 bytes | - | Height |
| `0x164` | Float32 | 4 bytes | - | Width |
| `0x168` | Float32 | 4 bytes | - | Unknown |
| `0x17c` | Flag | 1 byte | - | Reads from a Char, saves it on offset but at bit 0 of the Short |
| `-` | Uint8 | 1 byte | - | Length special system name |
| `0x158` | Utf-8 | variable | Length != 0 | Special system name |
| `0x17c` | Flag | 1 byte | - | Full byte read, value stored in bit 2 |
| `0x17c` | Flag | 1 byte | - | Same, stored bit 3 |
| `0x17c` | Flag | 1 byte | - | Same, stored bit 4 |
| `0x17c` | Flag | 1 byte | - | Same, stored bit 5 |
| `0x16c` | Float32 | 4 bytes | - | Unknown |
| `0x17c` | Flag | 1 byte | - | Same, stored bit6 |
| `0x188` | Short | 2 bytes | - | Unknown |
| `0x17c` | Flag | 1 byte | - | Same, stored bit 6 |
| `0x17c` | Flag | 1 byte | - | Same, stored bit 7 |
| `-` | Ushort | 2 bytes | - | Length of action name *(if higher then 24 resets to 24)* |
| `0x18c` | Utf-8 | Variable | Length != 0 | Action name read by size above |
| `-` | Section | Variable | - | Generic ending *(see: **[generic ending](../GIZ_Format_Documentation.md#Generic-Ending)**)* |

Click **[here](../GIZ_Format_Documentation.md#Long-Header-Sections)** to go back to the section selection.