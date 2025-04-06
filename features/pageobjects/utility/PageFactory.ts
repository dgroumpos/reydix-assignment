import { CustomWorld } from './World';
import HomePage from '../HomePage';
import EventDetailsPage from '../EventDetailsPage';

export function getPage<T>(PageClass: new (world: CustomWorld) => T, world: CustomWorld): T {
    return new PageClass(world);
}

// Optional: Named helpers if you prefer convenience
export function getHomePage(world: CustomWorld) {
    return new HomePage(world);
}

export function getEventDetailsPage(world: CustomWorld) {
    return new EventDetailsPage(world);
}

