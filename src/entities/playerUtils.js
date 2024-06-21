import { Player } from './player.js';

export function addPlayer(world) {
    const player = new Player();
    world.addBody(player.body);

    return player;
}
