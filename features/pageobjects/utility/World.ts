// src/support/world.ts
import { setWorldConstructor, World } from '@cucumber/cucumber';
import ScenarioContext from './ScenarioContext';

export class CustomWorld extends World {
    public context: ScenarioContext;

    constructor(options: any) {
        super(options);
        this.context = new ScenarioContext();
    }
}

setWorldConstructor(CustomWorld);
