# Arctic Jumper & Coldwind Engine

This document details the structure of the game. "Coldwind" refers to this game's engine, which is developed by me exclusively for this project. 
<br />
This was made with as little libraries as possible, and as such everything is written in vanilla HTML/CSS/JS, with the exception of Electron and Electron packagers.
<br />
<br />

## Project Structure

`_global:` initializes the Coldwind engine, the Game logic, and translations
<br />
`assets:` all assets for the game, including audio, fonts, spritesheets, and images
<br />
`canvas:` canvas classes, mostly to scale or for the user interface
<br />
`controllers:` classes to help with audio, graphics, controller, and flag APIs
<br />
`data:` classes to store and retrieve data, like scores, settings, and paths
<br />
`entities:` game objects that can be drawn onto canvases, like player, backgrounds, or enemies
`html-elements:` html components for the options menu
<br />
`managers:` classes to manage complex entity logic
<br />
`scripts:` web page scripts, used to initialize the game and about page
<br />
`styles:` css files to keep everything in place
<br />
`html pages:` program windows, including the game window and about window
