# GizmoPickup Structure
These section holds all kind of pickups that can be collected by walking into a predifined radius specific to that type of pickup.  
It is by far the **most used gizmo** in the game because it holds the coins, tokens and more that are used everywhere
*(Click [here](#gizmopickup-type-lookup-table) to skip to the type tabel)*. Spawning the vehicleToken or CharKit does reveal some interesting stuff
about the game. As you will see below a character stands for a specifcic type of Pickup but if the char isn't a valid indetifier the type will
get the **default silver coin** type.
> [!WARNING]
> The items chase can find and use for puzzles, like keys or valves, are **not** GizmoPickups. Those are called [GizItems](../GIZ_FormatDocumentation.md).

## GizmoPickup SectionHeader
*The version seen is 14.*
| Offset | Type | Size | Condition | Description |
| :----- | :----- | :----- | :----- | :----- |
| `-` | Uint32 | 4 bytes | - | Unknown |
| `-` | Float32 | 4 bytes | - | The draw distance pickups |
| `-` | Float32 | 4 bytes | - | Scale *(Size x Scale factor)* |
| `-` | Float32 | 4 bytes | - | Unknown |
| `-` | Float32 | 4 bytes | - | Unknown |
| `-` | Float32 | 4 bytes | - | Unknown |
| `-` | Float32 | 4 bytes | - | Unknown |

## GizmoPickup Entries
| Offset | Type | Size | Condition | Description |
| :----- | :----- | :----- | :----- | :----- |
| `0x191` | Char | 1 byte | - | Pickup type |
| `0x158` | Ushort | 2 bytes | - | Unkown *(high value extends pickup range, 1 makes dissapear)*
| `0x15d` | Char | 1 byte | - | Unknown |
| `0x164` | Short | 2 bytes | if(value 0) overwrite with 0xffff (-1) | Unknown |
| `0x1a0` | Float32 | 4 bytes | - | Respawn distance |
| `-` | Section | variable | - | Generic ending *(see: **[generic ending](../GIZ_Format_Documentation.md#Generic-Ending)**)* |
| `-` | Uint8 | 1 byte | if last byte ending != 0 | Name length |
| `-` | Utf-8 | variable | if last byte ending != 0 | Might be the name of a attached object |
| `-` | NuVec | 12 bytes | if last byte ending != 0 | Some position *(not tested yet)* |
> [!NOTE]
> Attached ending is not confirmed and it does not appear much.

## GizmoPickup Type Lookup Table
| ASCII | Hex | Decimal | Description |
| :--- | :--- | :--- | :-------- |
| `a` | `0x61` | `97` | **Special effect, no content, can be picked up** |
| `b` | `0x62` | `98` | **Blue coin** |
| `c` | `0x63` | `99` | **CharKit *(Spawns token)*** |
| `d` | `0x64` | `100` | **Bell pepper emerald** |
| `e` | `0x65` | `101` | **Shieldpiece TL** |
| `f` | `0x66` | `102` | **Small brick piece** |
| `g` | `0x67` | `103` | **Golden coin** |
| `h` | `0x68` | `104` | **Heart** |
| `i` | `0x69` | `105` | **Ghost coin** |
| `j` | `0x6a` | `106` | **2x4 super brick** |
| `m` | `0x6d` | `109` | **Minikit, special effet, no content, can not be picked up** |
| `n` | `0x6e` | `110` | **Vehicle token** |
| `p` | `0x70` | `112` | **Purple coin** |
| `q` | `0x71` | `113` | **Parkour token** |
| `r` | `0x72` | `114` | **Red brick** |
| `s` | `0x73` | `115` | **Silver coin** |
| `v` | `0x76` | `118` | **Time token** |
| `w` | `0x77` | `119` | **Shield piece TR** |
| `x` | `0x78` | `120` | **Shield piece BL** |
| `y` | `0x79` | `121` | **Shield piece BR** |
| `z` | `0x7a` | `122` | **Character token** |
| `G` | `0x47` | `71` | **Golden brick** |
| `P` | `0x50` | `80` | **2x2 super brick** |
| `X` | `0x58` | `88` | **Special effect, no content, can be picked up**
> [!NOTE]
> Technically all characters not mentioned here are silver coins because that is the default option.
> However it is good practise to just use `s` for silver coins. It connects with the name and makes it more clear for other modders.

Click **[here](../GIZ_Format_Documentation.md#Long-Header-Sections)** to go back to the section selection.