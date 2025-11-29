# Changelog

All notable changes to this project will be documented in this file.
### [3.3.0] (2025-11-29)

#### Features
* Realm icon will now only be shown, if more than one realm exists
* Added some new tags and updated the static tagging to (primarily) follow a "Specification of buff before specification of restrictions" approach

#### Bug Fixes
* Fixed Mining categories not having an icon associated with them
* Fixed issue that could lead to wrongfully use `<i>` element due to certain strings in blob media ids

### [3.2.1] (2025-11-03)

#### Bug Fixes
* Fixed issue where Combat effect icons broke when viewed via "Skill Boosts" mod
* Fixed issue where passives and special attacks would preserve the description without placeholders replaced

### [3.2.0] (2025-10-30)

#### Features
* Updated Mod API (officially re-instating it)

#### Bug Fixes
* Fixed issue where "Gives the Enemy:" text appeared before the icons


### [3.1.0] (2025-10-02)

#### Features
* Added translation support
  * Added German translation
* Scopes that were previously unable to show an icon should now do so
  * The behaviour is that the media of first reference of said scope will (e.g. a Fletching bonus for "Arrows" will display a Bronze Arrow)

#### Note

Technically, skills added by mods could still lead to a scope without icon (mod support for this will be implemented in the future). That being said, expansions to existing structures added via mods (e.g. a new category of items in Fletching) should already be picked up.

### [3.0.2] (2025-09-23)

#### Bug Fixes
* Fixed issue where prayer tooltips and certain cartography elements didn't interpret the image tags as html

### [3.0.1] (2025-09-21)

#### Bug Fixes
* Fixed issue of combat effect icons being broken, when original description already provided such an icon

### [3.0.0] (2025-09-08)

#### Features
* Update for Game v1.3.1 version

----------------------- Forked -----------------------

### [2.0.4] (2023-11-17)

#### Features
* update ?8112 new modifiers 


#### Bug Fixes
* html string format for fa icons 

### [2.0.3] (2023-11-08)

#### Features
- Extended api for custom modifiers and icon tags 

### [2.0.2] (2023-11-07)

#### Bug Fixes
- Ancient Relics icon image path 
- Elements with tiny-icon as textContent 

### [2.0.1] (2023-11-07)

#### Bug Fixes
- Cart refinement menu not showing icons 

## 2.0.0 (2023-11-05)

#### Features
- Icons for all passives throughout the game 
- Icons are seen in most interfaces (including mods)
- Option to disable global icons
- New icons for combat 
- Icons are now based off of defined modifier tags 
- All modifiers are assigned relevant icon tags 
- New endpoints for using tags and icons 

#### Bug Fixes
- Duplicate icons in modifiers with custom descriptions 
- Issue with context for relevant modifiers to add icons 
- Mangled icon paths in custom mod descriptions 
