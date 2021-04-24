import {
  ConfigCommand,
  ConfigCommandSeparator,
  ConfigRelaunchButton,
  constants,
  readConfigAsync
} from '@create-figma-plugin/common'
import { outputFile } from 'fs-extra'

import {
  Manifest,
  ManifestMenuItem,
  ManifestMenuItemSeparator,
  ManifestRelaunchButton
} from './types/manifest'

export async function buildManifestAsync(minify: boolean): Promise<void> {
  const config = await readConfigAsync()
  const {
    build,
    enablePrivatePluginApi,
    enableProposedApi,
    name,
    commandId,
    main,
    ui,
    menu,
    relaunchButtons
  } = config
  const command = { commandId, main, menu, name, ui }
  if (hasBundle(command, 'main') === false) {
    throw new Error('Need a "main"')
  }
  const result: Manifest = {
    api: config.apiVersion,
    id: config.id,
    main: constants.build.pluginCodeFilePath,
    name: config.name
  }
  if (hasBundle(command, 'ui') === true) {
    result.ui = constants.build.pluginUiFilePath
  } else {
    if (relaunchButtons !== null) {
      const relaunchButtonsWithUi = relaunchButtons.filter(function (
        relaunchButton
      ) {
        return relaunchButton.ui !== null
      })
      if (relaunchButtonsWithUi.length > 0) {
        result.ui = constants.build.pluginUiFilePath
      }
    }
  }
  if (command.menu !== null) {
    result.menu = createMenu(command.menu)
  }
  if (relaunchButtons !== null) {
    result.relaunchButtons = createRelaunchButtons(relaunchButtons)
  }
  if (enableProposedApi === true) {
    result.enableProposedApi = true
  }
  if (enablePrivatePluginApi === true) {
    result.enablePrivatePluginApi = true
  }
  if (build !== null) {
    result.build = build
  }
  const string =
    (minify === true
      ? JSON.stringify(result)
      : JSON.stringify(result, null, 2)) + '\n'
  await outputFile(constants.build.manifestFilePath, string)
}

function hasBundle(command: ConfigCommand, key: 'main' | 'ui'): boolean {
  if (command[key] !== null) {
    return true
  }
  if (command.menu !== null) {
    const result = command.menu.filter(function (command) {
      if ('separator' in command) {
        return false
      }
      return hasBundle(command, key)
    })
    return result.length > 0
  }
  return false
}

function createMenu(
  menu: Array<ConfigCommandSeparator | ConfigCommand>
): Array<ManifestMenuItem | ManifestMenuItemSeparator> {
  return menu.map(function (item) {
    if ('separator' in item) {
      return { separator: true }
    }
    const result: ManifestMenuItem = {
      name: item.name
    }
    if (item.commandId !== null) {
      result.command = item.commandId
    }
    if (item.menu !== null) {
      result.menu = createMenu(item.menu)
    }
    return result
  })
}

function createRelaunchButtons(
  relaunchButtons: Array<ConfigRelaunchButton>
): Array<ManifestRelaunchButton> {
  return relaunchButtons.map(function (relaunchButton) {
    const result: ManifestRelaunchButton = {
      command: relaunchButton.commandId,
      name: relaunchButton.name
    }
    if (relaunchButton.multipleSelection === true) {
      result.multipleSelection = true
    }
    return result
  })
}
