import { SystemManager } from "./system-manager.js";
import { CORE_MODULE, LATEST_THEWITCHERTRPG_ALPHA_VERSION, MODULE } from "./constants.js";
import { registerSettings } from "./settings.js";
import { Utils } from "./utils.js";

async function preloadHandlebarsTemplates() {
  const templatePath = [
    `modules/${MODULE.ID}/templates/skill-settings-menu.hbs`,
  ];
  return loadTemplates(templatePath);
}

Hooks.on("tokenActionHudCoreApiReady", async () => {
  const module = game.modules.get(MODULE.ID);
  const coreModule = game.modules.get(CORE_MODULE.ID);
  module.api = {
    requiredCoreModuleVersion: coreModule.version,
    SystemManager,
  };
  const version = game.system.version;
  const alphaVersion = Number(module.version.split("-alpha.")?.[1] ?? -1);

  preloadHandlebarsTemplates();
  registerSettings(alphaVersion >= 4);
  Hooks.call("tokenActionHudSystemReady", module);

  const showUnsupportedSystemMessage = Utils.getSetting(
    "showUnsupportedSystemMessage"
  );
  if (game.user.isGM && alphaVersion < 4 && showUnsupportedSystemMessage) {
    new Dialog({
      title: Utils.i18n("TAH_WITCHER.UnsupportedVersion.title"),
      content: Utils.i18n("TAH_WITCHER.UnsupportedVersion.content")
        .replace("%version", version)
        .replace("%alphaVersion", LATEST_THEWITCHERTRPG_ALPHA_VERSION),
      buttons: [
        {
          label: Utils.i18n("TAH_WITCHER.UnsupportedVersion.dontShowAgain"),
          callback: () => {
            Utils.setSetting("showUnsupportedSystemMessage", false);
          },
        },
        {
          label: Utils.i18n("TAH_WITCHER.UnsupportedVersion.ignore"),
          callback: () => {},
        },
      ],
    }).render(true);
  }
});
