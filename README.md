# Food Finder

Many people often take where they live for granted, even in urban locales surrounded by stores and restaurants and can end up missing out on some nearby neighbourhood gems.  Or perhaps they just don't want to get in a car or Uber to dine out at one of the better known restaurants. The purpose of this project is to provide the user with options for great restaurants within a convenient walking distance from home; just around the corner.

## Requirements

The project must:

- Use a CSS framework other than Bootstrap.
- Be deployed to GitHub Pages.
- Be interactive (i.e., accept and respond to user input).
- Use at least two server-side APIs.
- Not use alerts, confirms, or prompts (use modals).
- Use client-side storage to store persistent data.
- Be responsive.
- Have a polished UI.
- Have a clean repository that meets quality coding standards (file structure,  naming conventions, follows best practices for class/id naming conventions, indentation, quality comments, etc.).
- Have a quality README (with unique name, description, technologies used, screenshot, and link to deployed application).
- Finally, you must add your project to the portfolio that you created in Module 2.

## Built With

HTML
Tailwind CSS
Javascript
Yelp Fusion API
Openrouteservice API

## Deployment

This site has been published via [Github Pages](https://github.com/bootcampProjectOneTeamFour/food-finder).
The repository has been stored on [Github](https://bootcampProjectOneTeamFour/github.io/food-finder/)

## Design and Functionality

The main design uses a combination of HTML, CSS and Javascript.

1. The user inputs their postal code into the search field and then clicks on the "Find Food" button.

2. The button click calls the function that pulls information from the Yelp Fusion API display the top 10 rated restaurants in the user's area.

3. When the user clicks on the restaurant button, that click calls the function that pulls information from the Open Streets API to display walking directions to that restaurant.

4. At the same time, the button click saves the user's search history into local storage so that when the user returns to the restaurant directorythe user's search history will be saved.

## License

An MIT [License] has been included with this project.

## Credits and external Resources

- Yelp Fusion - <https://fusion.yelp.com/>
- Openrouteservice - <https://openrouteservice.org/services/>

## Task list

Enhancements
[ ] When the user searches by postal code, they are shown a map of the top 10 best rated restaurants in that area
[ ] when a user clicks on the pin for that restaurant, they are shown a badge. If the user clicks on that badge, they are directed towards the restaurant’s website.

## Contribution

Ian Ackerman (github.com/ianaack)
Laurel David (github.com/lnd4812)
Tommy Otis (github.com/xdatalinq)
Matthew Smith (github.com/mdubb23)
Feven Tsegai (github.com/feventsegai)
