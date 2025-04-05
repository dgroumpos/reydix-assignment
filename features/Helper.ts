export default class Helper {
    static unwrap(el: ChainablePromiseElement): Promise<WebdriverIO.Element> {
        return el as unknown as Promise<WebdriverIO.Element>;
    }
}