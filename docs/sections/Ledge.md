# Ledge Structure
The name of this section, **Ledge**, is a bit misleading. It makes it sound like these are only actual ledges ingame but there are many more types
that fall under **Ledge**. See the **[lookup table](#Ledge-Type-Lookup-Table)** for all possible objects. It has mostly parkour objects that get dynamicly generated. A small selection of parkour objects are directly spawned as a **[GizObstacle](./GizObstacle.md)**.

## Entry
*The version seen is 10.*
| Offset | Type | Size | Condition | Description |
| :----- | :----- | :----- | :----- | :----- |
| `0x86` | Short | 2 bytes | - | Rotation Y |
| `0x88` | Short | 2 bytes | if version > 9 | Rotation X |
| `0x1cc` | Char | 1 byte | - | Type identifier *(see [lookup table](#Ledge-Type-Lookup-Table))* |
| `-` | Uint8 | 1 byte | - | Connected name length with null |
| `0x1fc` | Utf-8 | variable | if above != 0 | Connected name |
| `-` | Uint8 | 1 byte | - | Connected name 2 length with null |
| `0x1dc` | Utf-8 | variable | if above != 0 | Connected name 2 |
| `0x1d0` | Short | 2 bytes | - | Unknown *(has mostly value: 6)* |
| `0x1d2` | Ushort | 2 bytes | - | Unknown |
| `-` | Uint8 | 1 byte | - | Extra name length |
| `-` | Utf-8 | variable | if length != 0 | Extra name |
| `0x1c0` | NuVec | 12 bytes | if length != 0 | Extra name coords |
| `0x1d8` | Short | 2 bytes | if length != 0 | Unknown |
| `-` | Section | variable | - | Generic ending *(see: **[generic ending](../GIZ_Format_Documentation.md#Generic-Ending)**)* |

## Ledge Type Lookup Table
| ASCII | Hex | Decimal | Description |
| :--- | :--- | :--- | :-------- |

> [!CAUTION]
> Table needs to be tested and verified.
> I will finish it soon after checking possible chars.