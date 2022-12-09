const progressBarHeroOne = document.getElementsByClassName("hero-one-container__hp-bar")[0]
const progressBarHeroTwo = document.getElementsByClassName("hero-two-container__hp-bar")[0]
const progressBarHeroThree = document.getElementsByClassName("hero-three-container__hp-bar")[0]
const progressBarBoss = document.getElementsByClassName("boss-container__hp-bar")[0]

const heroOneChoiceOne = document.getElementsByClassName("hero-one__basic-attack")[0]
const heroOneChoiceTwo = document.getElementsByClassName("hero-one__defend")[0]
const heroOneChoiceThree = document.getElementsByClassName("hero-one__spells")[0]
const heroTwoChoiceOne = document.getElementsByClassName("hero-two__basic-attack")[0]
const heroTwoChoiceTwo = document.getElementsByClassName("hero-two__defend")[0]
const heroTwoChoiceThree = document.getElementsByClassName("hero-two__spells")[0]
const heroThreeChoiceOne = document.getElementsByClassName("hero-three__basic-attack")[0]
const heroThreeChoiceTwo = document.getElementsByClassName("hero-three__defend")[0]
const heroThreeChoiceThree = document.getElementsByClassName("hero-three__spells")[0]

const click = document.getElementById("click")
const enter = document.getElementById("enter")
const death = document.getElementById("death")
const hit = document.getElementById("hit")
const defeatSound = document.getElementById("game-over")


const choices = [heroOneChoiceOne, heroOneChoiceTwo, heroOneChoiceThree,
                heroTwoChoiceOne, heroTwoChoiceTwo, heroTwoChoiceThree,
                heroThreeChoiceOne, heroThreeChoiceTwo, heroThreeChoiceThree]

const dmgContainer = document.getElementsByClassName("dmg-container")[0]
const dmgText = document.getElementsByClassName("dmg-text")[0]


// hero one choices

/*heroOneChoiceOne.classList.add("inactive")
heroOneChoiceTwo.classList.add("inactive")
heroOneChoiceThree.classList.add("inactive")
heroOneChoiceOne.classList.add("active")*/

// PLAYER CHOICES

class Playerchoices {
    constructor(isTurnActive, choiceOne, choiceTwo, choiceThree, playerCount, isDef, isAlive) {
        this.isTurnActive = isTurnActive
        this.choiceOne = choiceOne
        this.choiceTwo = choiceTwo
        this.choiceThree = choiceThree
        this.playerCount = playerCount
        this.isDef = isDef
        this.isAlive = isAlive
    }


}

// Heroes

class CharacterStats {
    constructor(hpMax, hp, ad, ap, charNum, charName, armor) {
        this.hpMax = hpMax
        this.hp = hp
        this.ad = ad
        this.ap = ap
        this.charNum = charNum
        this.charName = charName
        this.armor = armor
    }

    castSpell(target) {
        if(this.charNum == 1) {
            target.takeDmg(this.ap * (Math.floor(Math.random * 50) + 50))
        }
    }
} 

// HEROES

const heroOne = new CharacterStats(2000, 1800, 120, 170, 1, "Kevin", 20)
const heroTwo = new CharacterStats(3000, 2600, 170, 120, 2, "Luisa", 40)
const heroThree = new CharacterStats(1800, 1600, 110, 200, 3, "Jack", 10)
const boss = new CharacterStats(5000, 4800, 540, 180, 4, "Drog", 20)

let heroes = [heroOne, heroTwo, heroThree]

// PLAYERS

const playerOne = new Playerchoices(false, false, false, false, 0, false, true)
const playerTwo = new Playerchoices(false, false, false, false, 3, false, true)
const playerThree = new Playerchoices(false, true, false, false, 6, false, true)

let players = [playerOne, playerTwo, playerThree]

let isBossTurn = false
let pause = false
let enterPressed = false

// TAKE DMG

const takeDmg = (dmg, target) => {
    target.hp -= dmg
    let hpPercentage = (target.hp / target.hpMax) * 100
    const redBar = `linear-gradient(to right, #4d0101 0%, #da0202 100%)`
    if(target.hp > 0) {
        switch(target.charNum) {
            case 1: progressBarHeroOne.style.setProperty("--width", hpPercentage)
            break
            case 2: progressBarHeroTwo.style.setProperty("--width", hpPercentage)
            break
            case 3: progressBarHeroThree.style.setProperty("--width", hpPercentage)
            break
            case 4: progressBarBoss.style.setProperty("--width", hpPercentage)
            break
        } // switch
    } else {
        switch(target.charNum) {
            case 1: progressBarHeroOne.style.setProperty("--width", 0)
                progressBarHeroOne.style.setProperty("background-image", redBar)
                playerOne.isAlive = false
                break
            case 2: progressBarHeroTwo.style.setProperty("--width", 0)
                progressBarHeroTwo.style.setProperty("background-image", redBar)
                playerTwo.isAlive = false   
                break
            case 3: progressBarHeroThree.style.setProperty("--width", 0)
                progressBarHeroThree.style.setProperty("background-image", redBar)
                playerThree.isAlive = false

                break
            case 4: progressBarBoss.style.setProperty("--width", 0)
            break
        } // switch
    }
    
}

// ATTACCK

const attack = async (target, source) => {
    let criticalHit = Math.floor(Math.random() * 5) + 1
    let isHitCritical = false
    let randomNum = Math.floor(Math.random() * 30) + 1
    let dmg = 0
    if(criticalHit == 1) {
        let criticalRandom = Math.floor(Math.random() * 50) + 60
        dmg = (source.ad + criticalRandom)
        isHitCritical = true
    } else {
        dmg = (source.ad + randomNum)
    }


    dmg -= target.armor

    takeDmg(dmg, target)
    await showDmg(target, dmg, isHitCritical, source)
    switch(target.charNum) {
        case 1: if(playerOne.isAlive == false) {
            await showDeath(target)
        }
        break
        case 2: if(playerTwo.isAlive == false) {
            await showDeath(target)
        }
        break
        case 3: if(playerThree.isAlive == false) {
            await showDeath(target)
        }
        break
        case 4: if(boss.hp < 0) {
            progressBarBoss.style.setProperty("--width", 0)
        }
        break
    } // switch

    await pickTurn(source)
}

const spells = async (hero) => {
    switch(hero.charNum) {
        case 1: await heal()
        break
    }

    await pickTurn(hero)
}

const heal = async () => {
    let targets = players.filter((player) => player.isAlive == true)
    let randomTarget = Math.floor(Math.random() * targets.length)
    let min = 86
    const targeteLessHp = []
    let heroNum = null


    for(let i = 0; i < heroes.length; i++) {
        let hero = heroes[i]
        console.log(hero.charName + " HP PERC IS " + ((hero.hp / hero.hpMax) * 100))
        if(((hero.hp / hero.hpMax) * 100) < min && hero.hp > 0) {
            min = ((hero.hp / hero.hpMax) * 100)
            heroNum = i
        }
        if(heroNum != null && i == (heroes.length - 1)) {
            targeteLessHp.push(heroes[heroNum])
        }
        
    }

    if(Array.isArray(targeteLessHp) && targeteLessHp.length) {
        console.log((targeteLessHp[0].hp / ( targeteLessHp[0].hpMax) * 100))
        await healHero(heroes[(targeteLessHp[0].charNum - 1)])
    } else {
        let healingIsDone = false
        console.log("----------------KASUALEEEE")
        while(healingIsDone == false) {
            for(let i = 0; i < targets.length; i++) {
                if(randomTarget == i) {
                    for(const player in players) {
                        if(players[player] == targets[i]) {
                            //playSound(hit)
                            await healHero(heroes[player])
                            healingIsDone = true
                        }
                    } // for index
                } // target == random target
            } // for loop
        } // While loop
    }
    
}

const healHero = async (hero) => {
    let randomNum = Math.floor(Math.random() * 60) + 1
    let healAmount = heroOne.ap + randomNum
    let hpPercentage = 0

    if(hero.charNum == 2) {
        console.log("HERO CURRENT HP = ", hero.hp)
        if((hero.hp + healAmount + 400) <= hero.hpMax) {
            hero.hp += healAmount
            hpPercentage = (hero.hp / hero.hpMax) * 100
        } else {
            hpPercentage = 100
        }
    } else {
        if((hero.hp + healAmount + 200) <= hero.hpMax) {
            hero.hp += healAmount
            hpPercentage = (hero.hp / hero.hpMax) * 100
        } else {
            hpPercentage = 100
        }
    }
    console.log("HP AFTER HEAL = ", hero.hp)

    
    switch(hero.charNum) {
        case 1: progressBarHeroOne.style.setProperty("--width", hpPercentage)
        break
        case 2: progressBarHeroTwo.style.setProperty("--width", hpPercentage)
        break
        case 3: progressBarHeroThree.style.setProperty("--width", hpPercentage)
        break
    } // switch
    await showHealing(hero, healAmount)
}

// DEFEND

const defend = async (source, player) => {
    source.armor += 50
    player.isDef = true
    await showDef(source)

    await pickTurn(source)
}

// PICK RANDOM TARGET FOR BOSS

const randomTarget = async (targets) => {
    let isAttacckDone = false
    let randomTarget = Math.floor(Math.random() * targets.length)
    while(isAttacckDone == false) {
        for(let i = 0; i < targets.length; i++) {
            if(randomTarget == i) {
                for(const player in players) {
                    if(players[player] == targets[i]) {
                        playSound(hit)
                        await attack(heroes[player], boss)
                        isAttacckDone = true
                    }
                } // for index
            } // target == random target
        } // for loop
    } // While loop
}

// BOSS TURN FUN

const bossTurn = async () => {
    for(const choice of choices) {
        choice.classList.remove("active")
    }
    let randomChoice = 0
    await randomTarget(players.filter((player) => player.isAlive == true))
}

// SHOW DMG

const showDmg = async (target, dmg, isHitCritical, source) => {
    if(isHitCritical) {
        dmgContainer.classList.add("dmg-on")
        await new Promise(resolve => setTimeout(resolve, 200))
        dmgText.innerHTML = "" + source.charName + 
            " critically striked!\n" + target.charName + " took " + dmg + " damage"
        pause = true
        await new Promise(resolve => setTimeout(resolve, 1300))
        dmgContainer.classList.remove("dmg-on")
        dmgText.innerHTML = ""
        await new Promise(resolve => setTimeout(resolve, 200))
        pause = false
    } else {
        dmgContainer.classList.add("dmg-on")
        await new Promise(resolve => setTimeout(resolve, 200))
        dmgText.innerHTML = "" + source.charName + 
            " went for a basic attack! " + target.charName + " took " + dmg + " damage"
        pause = true
        await new Promise(resolve => setTimeout(resolve, 1300))
        dmgContainer.classList.remove("dmg-on")
        dmgText.innerHTML = ""
        await new Promise(resolve => setTimeout(resolve, 200))
        pause = false
    }
}

// SHOW DEF

const showDef = async (source) => {
    dmgContainer.classList.add("dmg-on")
    await new Promise(resolve => setTimeout(resolve, 200))
    dmgText.innerHTML = "" + source.charName + 
        " went in a defensive state! +50 armor until next turn\n"
    pause = true
    await new Promise(resolve => setTimeout(resolve, 1300))
    dmgContainer.classList.remove("dmg-on")
    dmgText.innerHTML = ""
    await new Promise(resolve => setTimeout(resolve, 200))
    pause = false
}

const showHealing = async (hero, healAmount) => {
    dmgContainer.classList.add("dmg-on")
    await new Promise(resolve => setTimeout(resolve, 200))
    if(hero.charNum != 1) {
        dmgText.innerHTML = "Kevin healed " + hero.charName + 
        " for a total amount of " + healAmount + " HP!"
    } else {
        dmgText.innerHTML = "Kevin healed himself" +
        " for a total amount of " + healAmount + " HP!"
    }
    
    pause = true
    await new Promise(resolve => setTimeout(resolve, 1300))
    dmgContainer.classList.remove("dmg-on")
    dmgText.innerHTML = ""
    await new Promise(resolve => setTimeout(resolve, 200))
    pause = false
}



const showDeath = async (source) => {
    playSound(death)
    dmgContainer.classList.add("dmg-on")
    await new Promise(resolve => setTimeout(resolve, 200))
    dmgText.innerHTML = "" + source.charName + 
        " took lethal damage and is now KO!\n"
    pause = true
    await new Promise(resolve => setTimeout(resolve, 1300))
    dmgContainer.classList.remove("dmg-on")
    dmgText.innerHTML = ""
    await new Promise(resolve => setTimeout(resolve, 200))
    pause = false
}

const showGameOver = async () => {
    playSound(defeatSound)
    dmgContainer.classList.add("dmg-on")
    await new Promise(resolve => setTimeout(resolve, 200))
    dmgText.innerHTML = "You have been defeated... press F5 to restart the game"
    pause = true
}

// START TURN



const startTurn = (player) => {
    enterPressed = false
    for(let i = 0; i<=2; i++) {
        if(players[i] === player) {
            let player = players[i]
            let hero = heroes[i]
            if(player.isDef == true) {
                player.isDef = false
                hero.armor -= 50
            }
            choices[player.playerCount].classList.add("inactive")
            choices[(player.playerCount + 1)].classList.add("inactive")
            choices[(player.playerCount + 2)].classList.add("inactive")
            choices[player.playerCount].classList.add("active")
            player.choiceOne = true
            player.choiceTwo = false
            player.choiceThree = false
            player.isTurnActive = true
        } else {
            let player = players[i]
            choices[player.playerCount].classList.add("inactive")
            choices[(player.playerCount + 1)].classList.add("inactive")
            choices[(player.playerCount + 2)].classList.add("inactive")
            choices[(player.playerCount)].classList.remove("active")
            choices[(player.playerCount + 1 )].classList.remove("active")
            choices[(player.playerCount + 2 )].classList.remove("active")
            player.choiceOne = false
            player.choiceTwo = false
            player.choiceThree = false
            player.isTurnActive = false
        } // player equality
    } // for loop

} //startTurn 

// PICK TURN

const pickTurn = async (source) => {  
    /*let currentChar = source.charNum
    let turnToStart = 0
    console.log("CURRENT CHAR = ", currentChar)
    console.log("CHAR NAME IS ", source.charName)
    for(let i = 0; i < heroes.length; i++) {
        if (currentChar == (i + 1)) {
            turnToStart = currentChar == 4 ? 1 : (currentChar + 1)
            console.log("TURN TO START ISSS ", turnToStart)
            if (turnToStart == 4) {
                await bossTurn()
            } else if (turnToStart < 3 && players[turnToStart - 1].isAlive == true) {
                startTurn(players[turnToStart - 1])
            } 
        }
    }*/
    
    if (source === heroOne) {
        if (playerTwo.isAlive == true) {
            startTurn(playerTwo)
        } else if (playerTwo.isAlive == false && playerThree.isAlive == true) {
            startTurn(playerThree)
        } else if (playerTwo.isAlive == false && playerThree.isAlive == false && playerOne.isAlive == true) {
            await bossTurn()
            //startTurn(playerOne)
        } else if (playerOne.isAlive == false && playerTwo.isAlive == false && playerThree.isAlive == false) {
            await showGameOver()
        }
    }

    if (source === heroTwo) {
        if(playerThree.isAlive == true) {
            startTurn(playerThree)
        } else if (playerThree.isAlive == false && playerOne.isAlive == true) {
            await bossTurn()
            //startTurn(playerOne)
        } else if (playerThree.isAlive == false && playerOne.isAlive == false && playerTwo.isAlive == true) {
            await bossTurn()
            //startTurn(playerTwo)
        } else if (playerOne.isAlive == false && playerTwo.isAlive == false && playerThree.isAlive == false) {
            await showGameOver()
        }
    }

    if (source === heroThree) {
        if (playerOne.isAlive == true) {
            await bossTurn()
            //startTurn(playerOne)
        } else if (playerOne.isAlive == false && playerTwo.isAlive == true) {
            await bossTurn()
            //startTurn(playerTwo)
        } else if (playerOne.isAlive == false && playerTwo.isAlive == false && playerThree.isAlive == true) {
            await bossTurn()
            //startTurn(playerThree)
        } else if (playerOne.isAlive == false && playerTwo.isAlive == false && playerThree.isAlive == false) {
            await showGameOver()
        }
    }

    if (source === boss) {
        if(playerOne.isAlive == true) {
            startTurn(playerOne)
        } else if (playerOne.isAlive == false && playerTwo.isAlive == true) {
            startTurn(playerTwo)
        } else if (playerOne.isAlive == false && playerTwo.isAlive == false && playerThree.isAlive == true) {
            startTurn(playerThree)
        } else if (playerOne.isAlive == false && playerTwo.isAlive == false && playerThree.isAlive == false) {
            await showGameOver()
        }
    }
}

startTurn(playerOne)

// ARROWS EVENT LISTENER

document.addEventListener("keydown", (e) => { 
    if(!enterPressed) {
        if(!pause) {
            if(e.key == "ArrowUp") {
                for(let i = 0; i <= 2; i++) {
                    let player = players[i]
                    if(player.isAlive) {
                        if(player.isTurnActive) {
                            playSound(click)
                            if(player.choiceOne == true) {
                                player.choiceOne = false
                                player.choiceThree = true
                                choices[(2 + player.playerCount)].classList.add("active")
                                choices[(player.playerCount)].classList.remove("active")
                                choices[(player.playerCount)].classList.add("inactive")
                            } else if (players[i].choiceTwo == true) {
                                player.choiceTwo = false
                                player.choiceOne = true
                                choices[(player.playerCount)].classList.add("active")
                                choices[(1 + player.playerCount)].classList.remove("active")
                                choices[(1 + player.playerCount)].classList.add("inactive")
                            } else if (player.choiceThree == true) {
                                player.choiceThree = false
                                player.choiceTwo = true
                                choices[(1 + player.playerCount)].classList.add("active")
                                choices[(2 + player.playerCount)].classList.remove("active")
                                choices[(2 + player.playerCount)].classList.add("inactive")
                            }   
                        } // player turn is active
                    }
                    
                } // for loop
            } else if (e.key == "ArrowDown") {
                for(let i = 0; i <= 2; i++) {
                    let player = players[i]
                    if(player.isAlive) {
                        if(player.isTurnActive) {
                             playSound(click)
                            if(player.choiceOne == true) {
                                player.choiceOne = false
                                player.choiceTwo = true
                                choices[(1 + player.playerCount)].classList.add("active")
                                choices[(player.playerCount)].classList.remove("active")
                                choices[(player.playerCount)].classList.add("inactive")
                                } else if (players[i].choiceTwo == true) {
                                    player.choiceTwo = false
                                    player.choiceThree = true
                                    choices[(2 + player.playerCount)].classList.add("active")
                                    choices[(1 + player.playerCount)].classList.remove("active")
                                    choices[(1 + player.playerCount)].classList.add("inactive")
                                } else if (player.choiceThree == true) {
                                    player.choiceThree = false
                                    player.choiceOne = true
                                    choices[(player.playerCount)].classList.add("active")
                                    choices[(2 + player.playerCount)].classList.remove("active")
                                    choices[(2 + player.playerCount)].classList.add("inactive")
                            }   
                        } // player turn is active
                    }  
                } // for loop
            } // arrow down
        }   // if pause
    }
    
}) //arrows event listeners

// ENTER EVENT LISTENER

document.addEventListener("keydown", (e) => {
    if(!enterPressed) {
        if(!pause) {
            if(e.key === "Enter") {
                enterPressed = true
                for(let i = 0; i <= 2; i++) {
                    let player = players[i]
                    let hero = heroes[i]
                    if(player.isAlive) {
                        if(player.isTurnActive == true) {
                             playSound(enter)
                            if(player.choiceOne == true) {
                                attack(boss, hero)
                            } else if(player.choiceTwo == true) {
                                defend(hero, player)
                            } else if(player.choiceThree == true) {
                                console.log("MAGGGIIAAAAA")
                                spells(hero)
                            }
                        }
                    }
                    
                }
            } // if enter keydown
        } // if pause
    }
    
    
})

const playSound = (sound) => {
    sound.currentTime = 0
    sound.play()
}