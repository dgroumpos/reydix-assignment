import { After, AfterStep } from '@cucumber/cucumber';

AfterStep(async function ({ result }) {
  if (result?.status === 'FAILED') {
    const screenshot = await browser.takeScreenshot();
    await this.attach(screenshot, 'image/png');
  }
});

After(async function (scenario) {
  if (scenario.result?.status === 'FAILED') {
    await this.attach('Scenario failed', 'text/plain');
  }

  // ✅ Clear ScenarioContext between scenarios
  if (this.context?.clear) {
    this.context.clear();
  }
  
});
