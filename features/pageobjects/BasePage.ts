import type { ChainablePromiseElement } from 'webdriverio';
import Helper from './utility/Helper';
import { CustomWorld } from './utility/World';

export default class BasePage {
    private readonly maxRetries = 5;
    private readonly retryInterval = 1000;

    constructor(protected world: CustomWorld) {}

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
            try {
                if (!(await el.isDisplayed())) {
                    console.log('🔍 Element not visible — attempting to swipe into view...');
                    await this.swipeUntilVisible(() => element);
                }
            } catch {
                console.warn('⚠️ Visibility check failed, continuing...');
            }

            if (!(await el.isDisplayed()) || !(await el.isEnabled())) {
                throw new Error('🚫 Element is not interactable');
            }

            await browser.pause(150);

            try {
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
            } catch {
                console.warn('⚠️ Native tap failed — falling back to click');
                await el.click();
            }

            await browser.pause(300);
        });
    }

    async getElementText(element: ChainablePromiseElement): Promise<string> {
        return this.retryElementAction(element, el => el.getText());
    }

    async getElementAttribute(element: ChainablePromiseElement, attribute: string): Promise<string> {
        return this.retryElementAction(element, el => el.getAttribute(attribute));
    }

    async swipeUntilVisible(
        elementFn: () => ChainablePromiseElement,
        maxSwipes = 5
    ): Promise<void> {
        for (let i = 0; i < maxSwipes; i++) {
            const el = await elementFn();
            if (await el.isDisplayed()) return;

            console.log(`🔄 Swiping up to bring element into view (attempt ${i + 1})`);
            await this.swipeUpFromScreen();
            await browser.pause(500);
        }
        throw new Error('🛑 Element not found after maximum swipe attempts');
    }

    async swipeUpFromScreen(startPerc = 0.8, endPerc = 0.2, duration = 300) {
        const { height, width } = await driver.getWindowRect();
        const startY = height * startPerc;
        const endY = height * endPerc;
        const x = width / 2;

        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x, y: startY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration },
                { type: 'pointerMove', duration, x, y: endY },
                { type: 'pointerUp', button: 0 }
            ]
        }]);

        await driver.releaseActions();
    }

    async swipeLeftOnScreen(yPercent = 0.85) {
        const { width, height } = await driver.getWindowRect();
        const y = height * yPercent;
        const startX = width * 0.9;
        const endX = width * 0.1;

        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: startX, y },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 200 },
                { type: 'pointerMove', duration: 300, x: endX, y },
                { type: 'pointerUp', button: 0 }
            ]
        }]);

        await driver.releaseActions();
    }

    async swipeLeftOnElement(element: ChainablePromiseElement, distanceMultiplier = 1) {
        const screen = await driver.getWindowRect();
        const location = await element.getLocation();
        const size = await element.getSize();

        const centerY = location.y + size.height / 2;
        const swipeDistance = size.width * distanceMultiplier;
        const startX = screen.width * 0.9;
        const endX = startX - swipeDistance;

        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: startX, y: centerY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: 300, x: endX, y: centerY },
                { type: 'pointerUp', button: 0 }
            ]
        }]);

        await driver.releaseActions();
    }
}
