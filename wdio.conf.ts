type CustomCapabilities = WebdriverIO.Capabilities & {
  'appium:appName'?: string;
  'appium:bundled'?: string;
};

export const config: WebdriverIO.Config = {
  runner: 'local',
  tsConfigPath: './tsconfig.json',

  port: 4723,

  specs: ['./features/**/*.feature'],

  exclude: [],

  maxInstances: 1,

  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554',
    'appium:platformVersion': '16.0',
    'appium:automationName': 'UiAutomator2',
    'appium:app': './apk/app-debug.apk',
    'appium:appPackage': 'dev.raschke.pokevent',
    'appium:appActivity': 'dev.raschke.pokevent.PokEventActivity',
    'appium:appName': 'PokEvent',
    'appium:bundled': 'com.debug.app',
    'appium:allowTestPackages': true,
    'appium:noReset': false,
    'appium:fullReset': false
  }] as CustomCapabilities[],

  logLevel: 'info',

  bail: 0,

  waitforTimeout: 10000,

  connectionRetryTimeout: 120000,

  connectionRetryCount: 3,

  services: ['appium'],

  framework: 'cucumber',

  reporters: [
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
      useCucumberStepReporter: true,
    }]
  ],

  cucumberOpts: {
    require: [
      './features/step-definitions/steps.ts',
      './features/pageobjects/utility/World.ts',
      './features/support/hooks.ts'
    ],
    requireModule: ['ts-node/register'],
    backtrace: false,
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: false,
    tagExpression: '',
    timeout: 60000,
    ignoreUndefinedDefinitions: false
  }
};
