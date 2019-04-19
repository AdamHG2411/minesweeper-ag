# minesweeper-ag
This is my first project for General Assembly's Software Engineering Immersive. I'm building a version of Minesweeper. Minesweeper is a classic logic game with ties to early computer logic puzzle games of the 1960s. It was popularized in its current form when it was included in Windows by default in the early 1990s.

You can access a working version of the game here: https://adamhg2411.github.io/minesweeper-ag

To play, click any square in the grid. You should see one of three things:
* an empty grey square
* a number from 1 - 8
* a mine/bomb

If you see an empty square or a number, that indicates the number of mines adjacent to that square (including diagonals). Your goal is to mark the locations of each mine without revealing them.

In the classic version, you marked mines by right-clicking, but that action isn't standardized across browsers. To switch between revealing squares and placing mine markers, click the toggle below the grid. An arrow should point to the option that is currently selected.

This game was built in Pug, SCSS, and JavaScript, with Parcel used to convert Pug to HTML and SCSS to CSS and bundle everything together. I designed the image files using another app we built for creating pixel art. I'm going to host a version of that tool on my personal GitHub soon after I make a few modifications, and I will link to it here.

The deployed version of the application is the most stable version and it is recommended. I'm working on a few additional features which may be added at a later date, including:
* Custom grid sizes
* Improved explosion animation

If you notice any bugs, please submit a [GitHub issue](https://github.com/AdamHG2411/minesweeper-ag/issues) and try to include as much detail about the issue as you can.

Thanks for playing!