# Ladder Structure

The section `Ladder` is very easy and straight forward. It represends all ladders ingame *(see: **[Ladder type table](#Ladder-Type-Table)**)* with
a few type specifiers. **Pipes and special objects** that are climbable are **not** ladders but fall under `Ledge` and `Pole`.
It is by far one of the simplest sections of the whole format.

## Entry
*The version seen is 6.*
| Offset | Type | Size | Condition | Description |
| :----- | :----- | :----- | :----- | :----- |
| `0x158` | Fixed block | 16 bytes | - | Ladder type string *(see: **[table](#Ladder-Type-Table)**)*|
| `0x86` | Ushort | 2 bytes | - | Rotation Y |
| `0x170` | UInt8 | 1 byte | - | Height of ladder |
| `0x171` | Char | 1 byte | - | Unknown |
| `0x172` | Char | 1 bytes | - | Unknown |
| `-` | Section | variable | - | Generic ending *(see: **[generic ending](../GIZ_Format_Documentation.md#Generic-Ending)**)* |
> [!NOTE]
> It is not part of the reading directly but it might be usefull to note and might give some extra context.  
> The last thing the function does is getting a single Uint8 from `0x170` changing it to a Uint32 and then casting it to a float32.
> Then it writes the variable * 0.0762 back to `0x174`.

## Ladder Type Table
| Name | Description |
| :---- | :---- |
| `default` | Generic grey ladder |
| `ladder 2` | Unknown |
| `ladder grapple` | Ladder that drops when using grapple gun |
| `city ladder` | Unknown difference |
| `Pirate_Ship_7` | Museum pirate ship drop down ladder |
> [!WARNING]
> Not verified!  
> To be tested.

Click **[here](../GIZ_Format_Documentation.md#Long-Header-Sections)** to go back to the section selection.