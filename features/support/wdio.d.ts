declare namespace WebdriverIO {
    interface Browser {
      /**
       * Appium-specific command to reset the application under test
       * (i.e., restart and clear all data).
       */
      reset(): Promise<void>;
    }
  }