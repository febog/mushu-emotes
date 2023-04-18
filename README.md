# Mushu's emotes 🐉

Welcome!

This is a small website for keeping track of Mushu's Twitch channel FFZ, BTTV and 7TV emotes.

https://febog.github.io/mushu-emotes/

## Description

1. Retrieves the enabled channel emotes from [BTTV](https://betterttv.com/), [FFZ](https://www.frankerfacez.com/) and [7TV](https://7tv.app/).
2. Builds a JSON array with all the emotes sorted by name.
3. This JSON is saved to a file that is used by GitHub pages to display all the emotes in a table.

Note that the JSON containing the emotes is committed to this repo, which provides version control of the emote array itself.

## Update emotes

```
npm start && git add . && git commit -m "Update emotes" && git push
```
