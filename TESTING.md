
# Testing

The Pokemon Emporium has been tested using the following methods:

1. [Code Validation](#code-validation)
    - [W3C HTML Validator](#w3c-html-markup-validator)
    - [W3C CSS Validator](#w3c-css-validator)
    - [JSHINT Javascript Code Quality Tool](#js-hint-code-quality-tool)
2. [Google Lighthouse](#google-lighthouse)
3. [Responsiveness](#responsivenss)
4. [A11y Color Contrast Accessibility Checker](#a11y-color-contrast-accessibility-checker)
5. [Browser Compatibility](#browser-compatibility)
6. [Testing User Stories](#testing-user-stories)
    - [Game Users](#game-users)
    - [Parents](#parents)
    - [Pokemon Fantatics](#pokemon-fanatics)
    - [Buisness Owners](#business-owners)
7. [Manual Testing](#manual-testing)
    - [Index Page](#index-page)
    - [Pokemon Memory Card Game](#pokemon-memory-card-game)
    - [Pokemon Battle Simulator](#pokemon-battle-simulator)
8. [Peer Review](#peer-review)
9. [Bugs](#bugs)

# Code Validation

## W3C HTML Markup Validator

All testing was carried out by the W3C Validator tool which can be accessed [here](https://validator.w3.org/)

### Index Page

<img src="assets/images/testing-images/html-validation-index.png">

### Memory Card Game Page

<img src="assets/images/testing-images/html-validation-memory.png">

### Battleground Page

<img src="assets/images/testing-images/html-validation-battlegrounds.png">

## W3C CSS Validator

Testing for the website's CSS was carried out through the W3C CSS Validator which can be accessed [here](https://jigsaw.w3.org/css-validator/)

<img src="assets/images/testing-images/css-validation.png">

## JS Hint Code Quality Tool 

### index.js


### memory.js


### battle.js



## Google Lighthouse

### index.html

<img src="assets/images/testing-images/index-lighthouse-desktop.png">

This is the testing result on a desktop.

<img src="assets/images/testing-images/index-lighthouse-mobile.png">

This is the testing result on a mobile.

### pokemon-memory.html

<img src="assets/images/testing-images/memory-lighthouse-desktop.png">

This is the testing result on a desktop.

<img src="assets/images/testing-images/memory-lighthouse-mobile.png">

This is testing result on a mobile.

Due to time constraints optimising to increase couldn't happen but the game still performed to the testing group.

### pokemon-battle.html

<img src="assets/images/testing-images/battle-lighthouse-desktop.png">

This is the testing result on a desktop.

<img src="assets/images/testing-images/battle-lighthouse-mobile.png">

This is the testing result on a mobile.

## A11y Color Contrast Accessibility Checker


## Browser Compatibility

The site was tested in Google Chrome, Microsoft Edge, Mozilla Firefox and Opera on desktop.

The site was tested in Google Chrome and Safari on mobile.

No issues arose during browser testing. CSS transitions worked on all browsers tested.

## Responsivenss

Responsivity tests were carried out using Google Chrome DevTools. Device screen sizes covered include:

- iPhone SE
- iPhone XR
- iPhone 12 Pro
- Pixel 5
- Samsung Galaxy S8+
- Samsung Galaxy S20 Ultra
- iPad Mini
- iPad Air
- Surface Pro 7
- Surface Duo
- Galaxy Fold
- Samsung Galaxy A51/71
- Nest Hub
- Nest Hub Max

I also personally tested the website on iPhone 13, iPhone 11 and MSI gaming PC with a dual screen.

## Testing User Stories

### Game Users

- As a game user, I would like have a timer counter.
    - There is a timer counter present in the Pokemon Memory Card Game which starts when the first card is flipped.
    - A time to beat section is there as well to make the player stay to compete with themselves.
- As a game user, I would like to have smooth transitions when selecting the cards.
    - I have implement custom CSS to have a smooth transition animation when the game user selects a card.
- As a game user, I would to have an eye-catching website to draw me in and make me want to play more than one game.
    - The main picture in the background through-out the website is of a range of Pokemon which is nice to look at.
    - Buttons which are present have a nice effect on them which is pleasing to use.
    - The font has a retro gaming vibe which would add to the effect.
- As a game user, I would to play on any device.
    - This website has been tested on several devices and browsers which allows playability anywhere.
- As a game user, I would to have a helpful reminder on how to play the game if I get stuck.
    - How to play modals are present on both sections of the website.
    - Navigation help modal is also present on the home page.
- As a game user, I would like some sort of competition between the computer and myself to keep me enticed.
    - The Memory Card game has a self competition from the time-to-beat section.
- As a game user, I would like to be able to pick from a list of Pokemon which I can fight with.
    - A dropdown list is used on the Battle Simulator which allows the user to select from 150 Pokemon.
- As a game user, I would like to have a range of attack moves which I can use against the computer.
    - There are attack moves which the user can select from the what level the Pokemon is.

### Parents

- As a parent, I would like if the website was children friendly.
    - This is a child friendly website which contains easy to understand helpful hints and straightforward user design.
- As a parent, I would like to be able to contact the business owners of the website in case I have any queries or problems.
    - There are email access modals on every page within the footer of the website.

### Pokemon Fanatics

- As a Pokemon fanatic, I would like to see a variation of Pokemon cards which I can play with.
    - There are a variation of different Pokemon present within the deck that is present in the game.
- As a Pokemon fanatic, I would like to to be able to pick my own Pokemon team and fight against an oppenent.
    - There are 3 Pokemon selection points which enable the user to select what Pokemon they want.
- As a Pokemon fanatic, I would like to see pictures of the Pokemon I select and attack moves which are genuine to the Pokemon themselves.
    - When the user selects a Pokemon an image appears of the Pokemon.
    - When the fight starts attacks moves are present and are also genuine to that type of Pokemon.
- As a Pokemon fanatic, I would like to see that genuine Pokemon cards are used in the memory card game.
    - The cards which are used have been taken from the TCG database which is offical Trading Card Game website.
- As a Pokemon fanatic, I would like to pick from the original 150 Pokemon to fight with.
    - When the user selects on the dropdown list, only the original 150 can be selected.

### Business Owners

- As a business owner, I want my website to accessible and user friendly on any device.
    - This website is accesible on all devices and scores above 94 on the accessibility section in the Lighthouse testing.
- As a business owner, I want my website to have links to social media outlets.
    - There are links in the footer for social media outlets.
- As a business owner, I want people to learn more about Pokemon in a fun way.
    - The imgary helps with this. User's can see the Pokemon that they want to fight with which gives a visual representation.
    - The attack moves also give a better understanding of the Pokemon.
- As a buisness owner, I would want scablitily and room for more features to be implemented.
    - The Battle Simulator can allow more Pokemon in a team.
    - The Battle Simulator could keep score of how many battles have taken place and who's won what.
    - The Memory Card Game could have a difficulty mode e.g. easy, medium and hard, scaling with how many cards are present on the table.

## Manual Testing

### Index Page

### Manual Testing Table for Pokémon Emporium Homepage

| **Test Case ID** | **Feature/Module**        | **Description**                          | **Steps to Test**                                                                  | **Expected Result**                                      | **Status** | **Comments**          |
|-------------------|---------------------------|------------------------------------------|-----------------------------------------------------------------------------------|---------------------------------------------------------|------------|-----------------------|
| TC001  | Navigation Buttons       | Verify navigation buttons redirect to games. | 1. Click "Pokemon Memory Card Game".<br>2. Click "Pokemon Battlegrounds".         | Buttons redirect to the correct pages.                  | ✅ |                       |
| TC002  | Help Modal               | Test "Which one to pick?" modal functionality. | 1. Click "Which one to pick?" button.<br>2. Close the modal using the "X" button. | Modal displays correctly and closes when expected.       | ✅ |                       |
| TC003  | Email Modal              | Verify email modal opens and form validation works. | 1. Click the "Email" link in the footer.<br>2. Fill and submit the form.      | Modal opens; required fields validate and submit properly. | ✅ |                       |
| TC004  | Social Media Links       | Ensure social media links function correctly. | 1. Click on each social media link in the footer.<br>2. Verify new tabs open.     | Links open new tabs and lead to the correct platforms.   | ✅ |                       |
| TC005  | Responsive Design        | Verify page layout on various devices.   | 1. Open page on desktop, tablet, and mobile.                                      | Layout adjusts correctly for all screen sizes.           | ✅ |                       |
| TC006  | Footer Accessibility     | Check footer links are functional.       | 1. Click each footer link.<br>2. Verify it performs the intended action.          | Footer links navigate to correct pages or actions.       | ✅ |                       |
| TC007  | Modal Accessibility      | Verify keyboard navigation works for modals. | 1. Use `Tab` to focus on the "Which one to pick?" button.<br>2. Open the modal.<br>3. Use `Tab` to navigate and close the modal. | All modal elements are accessible via keyboard.   | ✅ |                       |
| TC008  | Contact Us Form Validation | Ensure email form has validation.| 1. Attempt to submit the form without filling in required fields.<br>2. Fill in incorrect email format and submit. | Validation errors appear for missing or incorrect inputs. |✅ |                       |
| TC009  | Modal Overlap            | Test multiple modals.                    | 1. Open "Which one to pick?" modal.<br>2. Open email modal while the first modal is open. | Modals do not overlap or cause unexpected behavior.       | ✅ |                       |
| TC010  | Header Functionality     | Ensure header text is correctly displayed. | 1. Load the homepage.<br>2. Inspect the header text.                              | Header displays "Welcome to the Pokemon Emporium".       | ✅ |                       |
| TC011  | Background Image         | Verify the background image loads.       | 1. Load the homepage.<br>2. Verify the background image renders correctly.        | Background image appears and scales with the page.       | ✅ |                       |
| TC012  | Page Loading Speed       | Test loading performance of the page.    | 1. Load the homepage.<br>2. Check the time taken for all resources to load.       | Page loads within an acceptable time frame.              | ✅ |                       |
| TC013  | Font and Style Consistency | Ensure consistent styling.               | 1. Inspect buttons, modals, and footer.<br>2. Compare styling across pages.       | Fonts, colors, and styles are consistent throughout.      | ✅ |                       |
| TC014  | Error Handling           | Check error handling for broken links.   | 1. Inspect links in the navigation and footer.<br>2. Verify all links are valid.  | No broken links or 404 errors are encountered.           | ✅  |                       |
| TC015  | Page Reload Behavior     | Ensure reloading the page works correctly. | 1. Reload the page during modal interaction.                                      | Page reloads without errors, and all elements reset.      | ✅ |                       |


### Manual Testing Table for Pokemon Memory Card Game

| **Test Case ID** | **Feature/Module**        | **Description**                         | **Steps to Test**                                                                 | **Expected Result**                                    | **Status** | **Comments**          |
|-------------------|---------------------------|-----------------------------------------|----------------------------------------------------------------------------------|-------------------------------------------------------|------------|-----------------------|
| TC016             | Game Board Rendering      | Verify the game board is displayed.     | 1. Load the memory card game page.                                              | Cards are displayed in a grid, all face down.         | ✅ |                       |
| TC017             | Card Flip                | Ensure a card flips when clicked.       | 1. Click on a face-down card.                                                   | Card flips to reveal Pokémon image.                   | ✅ |                       |
| TC018             | Match Detection          | Check if matching cards stay flipped.   | 1. Flip two cards with matching Pokémon images.                                  | Matching cards remain face up.                        | ✅ |                       |
| TC019             | Mismatch Behavior        | Verify non-matching cards flip back.    | 1. Flip two cards with different Pokémon images.                                 | Cards flip back face down after a delay.              | ✅ |                       |
| TC020             | Game Completion          | Check game ends when all pairs match.   | 1. Match all pairs on the board.                                                | Timer stops, and game completion is indicated.        | ✅ |                       |
| TC021             | Restart Game             | Ensure restart resets board and timer.  | 1. Click "Restart Game".                                                        | All cards reset to face down; timer restarts.         | ✅ |                       |
| TC022             | Responsive Layout        | Verify layout on various devices.       | 1. Open game on desktop, tablet, and mobile.                                     | Elements align correctly and are accessible.          | ✅ |                       |
| TC023             | Help Modal               | Test "How to play" modal functionality. | 1. Click "How to play" button.<br>2. Close modal with "X".                       | Modal opens with instructions; closes correctly.      | ✅ |                       |
| TC024             | Email Modal              | Test email modal form validation.       | 1. Click "Email" link.<br>2. Fill and submit form.                               | Modal opens; required fields validated; form submits. | ✅ |                       |
| TC025             | Timer Functionality      | Verify timer starts and stops.          | 1. Start flipping cards.<br>2. Match all pairs.                                  | Timer starts on first flip; stops when game ends.     | ✅ |                       |
| TC026             | Best Time Tracking       | Ensure "Time to beat" updates.          | 1. Complete the game with a faster time.                                         | "Time to beat" updates with the new best time.        | ✅ |                       |
| TC027             | Mismatch Interaction     | Test flipping during mismatch delay.    | 1. Flip two mismatched cards.<br>2. Click a third card during animation.         | Game ignores input during mismatch animation.         | ✅ |                       |
| TC028             | Restart During Play      | Test restarting mid-game.               | 1. Flip a few cards.<br>2. Click "Restart Game".                                 | Game resets without errors.                           | ✅ |                       |
| TC029             | Navigation Buttons       | Verify navigation buttons redirect.     | 1. Click "Home Page".<br>2. Click "Pokemon Battlegrounds".                      | Buttons redirect to the correct pages.                | ✅ |                       |
| TC030             | Social Media Links       | Check social media links functionality. | 1. Click each social media link in the footer.                                   | Links open in new tabs and lead to correct pages.     | ✅ |                       |


### Manual Testing Table for Pokemon Battle Simulator

| **Test Case ID** | **Feature/Module**        | **Description**                         | **Steps to Test**                                                                 | **Expected Result**                                    | **Status** | **Comments**          |
|-------------------|---------------------------|-----------------------------------------|----------------------------------------------------------------------------------|-------------------------------------------------------|------------|-----------------------|
| TC031             | Navigation Buttons       | Verify navigation buttons redirect.     | 1. Click "Home Page".<br>2. Click "Pokemon Memory Card Game".                    | Buttons redirect to the correct pages.                | ✅ |                       |
| TC032             | Help Modal               | Test "How to play" modal functionality. | 1. Click "How to play" button.<br>2. Close modal using the "X" button.           | Modal displays instructions and closes correctly.     | ✅ |                       |
| TC033             | Pokémon Selection        | Verify Pokémon selection dropdowns.     | 1. Select a Pokémon from the dropdown.<br>2. Preview updates to match selection. | Selected Pokémon and preview image display correctly. | ✅ |                       |
| TC034             | Selection Completion     | Test behavior after selecting 3 Pokémon.| 1. Select three Pokémon.<br>2. Wait for opponent Pokémon selection.              | Opponent's Pokémon are displayed after user's.        | ✅ |                       |
| TC035             | Pokémon Display          | Check Pokémon display in battle arena.  | 1. Select Pokémon.<br>2. Start the battle.                                       | User and opponent Pokémon images and names display.   | ✅ |                       |
| TC036             | Battle Mechanics         | Test battle logic for attacks.          | 1. Choose an attack from user moves.<br>2. Verify opponent's HP decreases.       | Attack reduces opponent's HP; battle logs update.     | ✅ |                       |
| TC037             | Reset Button             | Ensure battle resets on button click.   | 1. Click "Reset Battle".                                                        | Battle resets; Pokémon selection cleared.             | ✅ |                       |
| TC038             | HP Bar Updates           | Verify HP bar reflects Pokémon health.  | 1. Use attacks to reduce HP.<br>2. Check if HP bar updates correctly.            | HP bar decreases proportionally to damage.            | ✅ |                       |
| TC039             | Battle Logs              | Ensure battle logs update correctly.    | 1. Perform attacks during the battle.                                           | Logs show move details, damage, and turn outcomes.    | ✅ |                       |
| TC040             | Responsive Layout        | Verify layout on various devices.       | 1. Open game on desktop, tablet, and mobile.                                     | Elements align correctly and are accessible.          | ✅ |                       |
| TC041             | Social Media Links       | Check social media links functionality. | 1. Click each social media link in the footer.                                   | Links open in new tabs and lead to correct pages.     | ✅ |                       |
| TC042             | Pokémon Images           | Verify Pokémon preview and battle images.| 1. Select Pokémon.<br>2. Start battle.<br>3. Check preview and battle images.    | Correct Pokémon images display throughout.            | ✅ |                       |
| TC043             | Accessibility            | Check keyboard navigation.              | 1. Navigate using `Tab` key.<br>2. Interact with buttons and dropdowns.          | All elements are keyboard accessible.                 | ✅ |                       |
| TC044             | Opponent AI              | Verify opponent Pokémon behavior.       | 1. Complete user Pokémon selection.<br>2. Monitor opponent AI moves.            | Opponent selects moves and executes attacks.          | ✅ |                       |
| TC045             | Error Handling           | Check for invalid Pokémon selection.    | 1. Attempt to proceed without selecting Pokémon.<br>2. Observe behavior.         | Game prevents progression until 3 Pokémon are chosen. | ✅ |                       |
| TC046             | Reset During Battle      | Test resetting mid-battle.              | 1. Start a battle.<br>2. Click "Reset Battle" before the battle ends.            | Game resets without errors or interruptions.          | ✅ |                       |
| TC047             | Footer Links             | Verify footer links navigate correctly. | 1. Click on "Contact Us" and "Follow Us" links.<br>2. Check destinations.        | Links lead to the appropriate pages or actions.       | ✅ |                       |


## Peer Review

- This project was sent to my team at work within the NHS. All feedback was positive and everyone enjoyed both sections of website apart from on some bigger phones users had to scroll up and down to target all the cards. From this feedback I have decreased the size of the cards on a higher max-width media query to ensure all user's have a fluid gameplay experience.
- My family and friends have also tested the project and have given positive feedback.

## Bugs
