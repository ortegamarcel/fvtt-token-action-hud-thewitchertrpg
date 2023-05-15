# Token Action HUD TheWitcherTRPG
Token Action HUD is a repositionable HUD of actions for a selected token.

# Skills do not work on TheWitcherTRPG v0.96
The [Witcher-system](https://github.com/AnthonyMonette/TheWitcherTRPG) v0.96 doesn't expose the necessary function to do skill rolls. That's why skills currently don't work.

If you don't want to wait for a fix, you can use my [alpha version](https://github.com/ortegamarcel/TheWitcherTRPG/wiki) of the system. Here is the [installation guide](https://github.com/ortegamarcel/TheWitcherTRPG/wiki/Installation-Guide). 

Alternatively, you can manually fix it in the code yourself. Down below is a [guide](https://github.com/ortegamarcel/fvtt-token-action-hud-thewitchertrpg#fix-skills-manually) on how to do that.

![Token Action HUD](.github/readme/token-action-hud.gif)

# Features
- Make rolls directly from the HUD instead of opening your character sheet.
- Use profession skills and spells from the HUD or right-click them to see an description.
- Move the HUD and choose to expand the menus up or down.
- Many customization options for Skills, Professions Skills and Magic

# Installation

## Method 1
1. On Foundry VTT's **Configuration and Setup** screen, go to **Add-on Modules**
2. Click **Install Module**
3. Search for **Token Action HUD TheWitcherTRPG** 
4. Click **Install** next to the module listing

## Method 2
1. On Foundry VTT's **Configuration and Setup** screen, go to **Add-on Modules**
2. Click **Install Module**
3. In the Manifest URL field, paste: `https://github.com/ortegamarcel/fvtt-token-action-hud-thewitchertrpg/releases/latest/download/module.json`
4. Click **Install** next to the pasted Manifest URL

## Required Modules

**IMPORTANT** - Token Action HUD TheWitcherTRPG requires the [Token Action HUD Core](https://foundryvtt.com/packages/token-action-hud-core) module to be installed.

## Recommended Modules
Token Action HUD uses either the [Color Picker](https://foundryvtt.com/packages/color-picker), [libThemer](https://foundryvtt.com/packages/lib-themer) or [VTTColorSettings](https://foundryvtt.com/packages/colorsettings) library modules for its color picker settings. Only one is required.

# Fix Skills manually
Instead of using my [latest alpha version](https://github.com/ortegamarcel/TheWitcherTRPG/wiki), you can paste the following code into **row 2635** of `<foundry_path>\Data\systems\TheWitcherTRPG\module\sheets\WitcherActorSheet.js` **before the `}`**.

```javascript
async _onSkillRoll(statNum, skillNum) {
  rollSkillCheck(this.actor, statNum, skillNum);
}
```

It should look like this:
```javascript
  calc_total_stats(data) {
    let totalStats = 0;
    for (let element in data.system.stats) {
      totalStats += data.system.stats[element].max;
    }
    return totalStats;
  }

  async _onSkillRoll(statNum, skillNum) {
    rollSkillCheck(this.actor, statNum, skillNum);
  }
}
```



# Support

For questions, feature requests or bug reports, please open an issue [here](https://github.com/ortegamarcel/fvtt-token-action-hud-thewitchertrpg/issues).

Pull requests are welcome. Please include a reason for the request or create an issue before starting one.
