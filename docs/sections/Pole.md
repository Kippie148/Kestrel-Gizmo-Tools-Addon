# Pole Structure

Most climbable objects in the game cannot really be climbed by themselves but that is where they use **Pole**. The entries are not visible but can
be placed onto a existing object to make it seems like they are being climbed. This is also used for example to make the beanstalk in the second clown
arresting mission so it can be climbed by the robber.

| Offset | Type | Size | Condition | Description |
| :----- | :----- | :----- | :----- | :----- |
| `0x86` | Ushort | 2 bytes | - | Unknown |
| `0x160` | Float32 | 4 bytes | - | Height |
| `0x164` | Float32 | 4 bytes | - | Width |
| `-` | Float32 | 4 bytes | - | Unknown |
| `-` | Char | 1 byte | - | Unknown |
| `-` | Uint8 | 1 byte | - | Length special system name |
| `0x158` | Utf-8 | variable | Length != 0 | Result special system name |
| `-` | Char | 1 byte | - | Unknown |
| `0x164` | Float32 | 4 bytes | - | Unknown |
| `0x16c` | Float32 | 4 bytes | - | Unknown |
| `0x170` | Float32 | 4 bytes | - | Unknown |
| `0x18c` | Uint32 | 4 bytes | Version > 2 | Unknown |
| `0x180` | Float32 | 4 bytes | - | Unknown |
| `0x184` | Float32 | 4 bytes | - | Unknown |
| `-` | Section | variable | - | Generic ending *(see: **[generic ending](../GIZ_Format_Documentation.md#Generic-Ending)**)* |

Click **[here](../GIZ_Format_Documentation.md#Long-Header-Sections)** to go back to the section selection.