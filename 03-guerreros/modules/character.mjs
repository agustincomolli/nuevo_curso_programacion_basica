export class Character {
    /* DESCRIPTION: Modela los personajes del juego, tanto del jugador
                    como los personajes enemigos.
    */

    constructor(name, image, health) {
        this.name = name
        this.image = image
        this.health = health
        this.attacks_skills = []
    }
}

export {Character}
