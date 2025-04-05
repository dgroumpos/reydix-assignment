
/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class BasePage {
    private readonly maxRetries = 5;
    private readonly retryInterval = 1000;

 async retryElementAction<T>(
        element: Promise<WebdriverIO.Element>,
        action: (el: WebdriverIO.Element) => Promise<T>
    ): Promise<T> {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                console.log(`Attempt ${attempt}: Resolving element...`);

                let el: WebdriverIO.Element;
                try {
                    el = await element;
                } catch (resolveError) {
                    throw new Error(`Failed to resolve element: ${resolveError}`);
                }

                if (typeof el.scrollIntoView === 'function') {
                    try {
                        await el.scrollIntoView();
                    } catch {
                        console.warn("Scroll not supported, skipping...");
                    }
                }

                await el.waitForDisplayed({ timeout: 5000 });
                await el.waitForEnabled({ timeout: 5000 });

                const result = await action(el);
                console.log(`✅ Success on attempt ${attempt}`);
                return result;

            } catch (error) {
                console.error(`❌ Attempt ${attempt} failed:`, error);

                if (attempt < this.maxRetries) {
                    console.log(`⏳ Retrying in ${this.retryInterval / 1000}s...`);
                    await new Promise(res => setTimeout(res, this.retryInterval));
                } else {
                    throw new Error(`❌ Gave up after ${this.maxRetries} attempts: ${error}`);
                }
            }
        }

        throw new Error("Unexpected retry failure");
    }

    async clickElement(element: Promise<WebdriverIO.Element>) {
        return this.retryElementAction(element, async el => await el.click());
    }

    async getElementText(element: Promise<WebdriverIO.Element>) {
        return this.retryElementAction(element, async el => await el.getText());
    }

    async swipeElementLeft(element: WebdriverIO.Element | Promise<WebdriverIO.Element>) {
        const elementPromise = Promise.resolve(element);
        return this.retryElementAction(elementPromise, async el => {
          await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
              { type: 'pointerMove', duration: 0, x: 0, y: 0, origin: el },
              { type: 'pointerDown', button: 0 },
              { type: 'pause', duration: 100 },
              { type: 'pointerMove', duration: 600, x: -250, y: 0, origin: el },
              { type: 'pointerUp', button: 0 }
            ]
          }]);
        });
      }  
}
