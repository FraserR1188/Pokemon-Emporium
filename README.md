# Pokemon Emporium

## Milestone Project 2 - Interactive Front-End Site

(This is spacing for the main image once project is complete)

- The Pokemon Emporium is aimed at children from ages 5 onwards as well as anyone who has a keen interest in Pokemon. It features a memory card game which will contain authentic cards, which will allow the user to gain a score. It will also feature a Pokedex allowing the user to access Pokemon details.
- This is my Milestone Project 2 submission for Code Institutes Diploma in Web Application Development Course. My website features 3 webpages and is built using HTML, CSS and JavaScript.


## Project Link

(Link to the project)

## Repository

(Link to repo)

# Table of Contents

## Contents


1. [User Stories] (#user-stories)
		*[]
		* [Game Users] (#game-users)
		* [Parents] (#parents)
		* [Pokemon Fanatics] (#pokemon-fanatics)
		* [Business Owner] (#business-owner)

3. [Design] (#design)
	* [Typography] (#typograhy)
	* [Images] (#images)
	* [Colour Scheme] (#color-scheme)
	* [Wireframes] (#wireframes)

4.  [Features] (#features)
	* [Existing features] (#exisiting-features)
	* [Features left to implement] (#features-left-to-implement)

5. [Technologies used] (#technologies-used)

6. [Testing]

7. [Deployment] (#deployment)
	* How to run this project locally

8. [Credits] (#credits)
	* [Content]
	* [Media]
	* [Code]
	* [Acknowledgements]

## Project Goals
This website is dedicated to the love of Pokemon and targets to main fanbases, Pokemon Cards and also the game itself with the Pokedex aspect. The memory card is light hearted with a timer and a time to beat rather than a countdown timer to make less stressful and more fun to play and also to play again. The Pokedex section of the website...

## User Stories
#### Game Users:

These are users to like to spending time playing causal games whether they like Pokemon or not.

- As a game user, I would like have a timer counter.
- As a game user, I would like to have smooth transitions when selecting the cards.
- As a game user, I would to have an eye-catching website to draw me in more and make me want to play more than one game.
- As a game user, I would to play on any device.
- As a game user, I would to have the option on how to play the game if I get stuck.
- As a game user, I would like some sort of competition between the computer and myself to keep me enticed.

#### Parents:

These are the parents of younger children who may be concerned of their child playing games online.

- As a parent, I would like if the website was children friendly.
- As a parent, I would like to be able to contact the business owners of the website in case I have any queries or problems.

#### Pokemon Fanatics

These are users who are avid Pokemon hobbyists and have a keen interest in all things Pokemon.

- As a Pokemon fanatic, I would like to see a variation of Pokemon cards which I can play with.
- As a Pokemon fanatic, I would like to see a Pokedex which looks how it should and what information I receive from it.
- As a Pokemon fanatic, I would like to see that genuine Pokemon cards are used in the memory card game.

#### Business Owners

These are the owners of the website

- As a business owner, I want my website to accessible and user friendly on any device.
- As a business owner, I want my website to have links to social media outlets.
- As a business owner, I want people to learn more about Pokemon in a fun way.
 
## Design
### Typography
- The main font which I'll use throughout the website is Sixtyfour Convergence which is obtained from Google Fonts. This type of font has a retro-gaming vibe which I feel would go well with the gaming style of website. I will use Sans Serif as a fall back font.
- There won't be much text on the website but if I feel that the main font doesn't read well (potentially on the Pokedex where font will be smaller) I use Roboto Mono as this still has a retro vibe but is more readable.
### Images
- Images are a main criteria throughout the website. The main memory card game will comprise of 24 cards (12 pairs) which I will obtain from the official TCG website. https://www.pokemon.com/us/pokemon-tcg/pokemon-cards
- There will be a different main image on each page which will be taken from the original games on the GameBoy.
- Images for the Pokedex will come from Pokemon API which will be shown inside the Pokedex container.
### Colour Scheme
The colours which are present throughout are as follows:
https://www.schemecolor.com/pokemon-colors.php

## Features
### Existing Features
#### Pokemon Memory Card Game:

 - The game features 10 different cards (within the JavaScript this is x2 so there are 10 pairs) which are facing back to the user. When clicked on the card flips through a smooth transition.
 - Once the first card is flipped the timer starts and once the last pair have matched the timer stops and logs the time for the player to try and beat.
 - There is also a reset button in case the player wants to start again any time throughout playing.

### Future Features
#### Pokemon Memory Card Game

- A future feature could be that an API could hold a lot of players times and have a leaderboard.
- Have difficulty settings with more cards, medium with 15 cards and hard with 20 cards etc...
- 

## Technologies Use
### Languages Used
- HTML5
- CSS3
- JavaScript
### Frameworks Libraries and Programs
- Google Fonts
	- I used the Sixtyfour Convergence.
- CloudConvert
	- I used this online image converter to change my images from PNG to AVIF.
	- 

### Application Programming Interface (API's)


## Testing 
(This will have it's own separate section on the game file.)

## Deployment


## Credits
- W3Schools for coding advice.
- https://alphacoders.com/pokemon-4k-wallpapers
- https://icons8.com/icon/set/social-media/isometric

Problems with the memory card game:

In the memory card game I've had trouble accessing the location of the card sourcing.
I originally thought this problem was focused in the startGame function but it was actually in the selectCard function and the card1Selected.src file path was board[r][c] but it should of been what it was right now.

Once i thought the game was finished. After selecting the second card the game would stop. This was due to mentioned card1Selected twice in the selectCard function.

issues with the index.html. Created a hidden-div to stop the footer overlapping the buttons on a mobile view.

> Written with [StackEdit](https://stackedit.io/).