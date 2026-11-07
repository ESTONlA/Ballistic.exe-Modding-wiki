# WorkshopInspector example

Read-only Lua teaching example for the Ballistic Modding Wiki. Author: RealEstonia.

Extract the WorkshopInspector folder into the existing `ue4ss/Mods/` folder. The final script path should be `ue4ss/Mods/WorkshopInspector/Scripts/main.lua`. Install a compatible UE4SS loader separately.

Restart the game. Open the workshop editor or equip a gun in a range, focus the game window, then press F9. Search `UE4SS.log` for `[WorkshopInspector]`.

The example reports the world, equipped gun or visible workshop-editor candidates, selected raw stat fields, and a bounded list of child actors. Multiple visible candidates can be reported; this is not a universal active-menu selector.

Edit `Scripts/config.lua` with the game closed to change the key or limits. Remove `enabled.txt` with the game closed to disable the example.

This code calls no attachment setters, save/apply functions, score functions or travel actions. It is adapted from local demo integration patterns. Mock checks of the example do not prove compatibility with every game or loader build. Read the full workshop-inspector guide for its assumptions and troubleshooting steps.
