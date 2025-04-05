import type { ChainablePromiseElement } from 'webdriverio';
import Helper from '../Helper';

export default class BasePage {
    private readonly maxRetries = 5;
    private readonly retryInterval = 1000;

    /**
     * Retry any action on an element with built-in waits and stability
     */

    async retryElementAction<T>(
        element: ChainablePromiseElement,
        action: (el: WebdriverIO.Element) => Promise<T>
    ): Promise<T> {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                console.log(`🔁 Attempt ${attempt}: Resolving element...`);
    
                const rawElement = await Helper.unwrap(element);
    
                await rawElement.waitForDisplayed({ timeout: 5000 });
                await rawElement.waitForEnabled({ timeout: 5000 });
    
                try {
                    await rawElement.scrollIntoView();
                } catch {
                    console.warn('⚠️ Scroll not supported — skipping.');
                }
    
                const result = await action(rawElement);
                console.log(`✅ Success on attempt ${attempt}`);
                return result;
    
            } catch (err) {
                console.error(`❌ Attempt ${attempt} failed: ${err}`);
                if (attempt < this.maxRetries) {
                    await browser.pause(this.retryInterval);
                } else {
                    throw new Error(`🔥 Gave up after ${this.maxRetries} attempts: ${err}`);
                }
            }
        }
    
        throw new Error('🔥 Unexpected retry failure');
    }
    
    async tapElement(element: ChainablePromiseElement) {
        return this.retryElementAction(element, async el => {
            await driver.performActions([{
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: 0, y: 0, origin: el },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pause', duration: 100 },
                    { type: 'pointerUp', button: 0 }
                ]
            }]);
    
            await driver.releaseActions();
        });
    }
    
    async getElementText(element: ChainablePromiseElement): Promise<string> {
        return this.retryElementAction(element, async el => await el.getText());
    }

    async elementDisplayed(element: ChainablePromiseElement): Promise<void> {
        return this.retryElementAction(element, async () => {
            console.log('👀 Element is displayed');
        });
    }

    async swipeElementLeft(element: ChainablePromiseElement) {
        return this.retryElementAction(element, async el => {
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

            await driver.releaseActions();
        });
    }
    
}
