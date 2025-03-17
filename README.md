# Mushu's emotes 🐉

This is a small website for keeping track of Mushu's Twitch channel [FFZ](https://www.frankerfacez.com/), [BTTV](https://betterttv.com/) and [7TV](https://7tv.app/) emotes using [GitHub Pages](https://pages.github.com/).

https://emotes.botshu.com/

## Description

In general terms, the code does the following:

1. Calls the different public APIs of the different emote providers to get a list of enabled emotes in the channel.
2. Parses all the emotes into a single array that follows a common data model as defined by the class `Emote`.
3. Stores the emote list as a JSON array into files showing the current and historical emotes for archival purposes.
4. Creates a file with some stats about the enabled emotes.
5. These JSON files are used to create a [GitHub Pages](https://pages.github.com/) website that shows the list of emotes.

Note that the JSON containing the emotes is committed to this repo, which provides version control of the emote array itself.

The website is made using [Jekyll](https://jekyllrb.com/), the engine used by GitHub Pages. It uses a [Bootstrap](https://getbootstrap.com/) based layout, using [DataTables](https://datatables.net/) to display the data and [Jekyll Includes](https://jekyllrb.com/docs/includes/) to keep things organized.

## Update emotes

This will update the emote website to the latest emotes. Requires push permissions to `main`.

```
npm run emotes
```

## Environment variables

The code needs two environment variables to work:

- `TWITCH_USER_ID_MUSHU`: The Twitch user ID of the channel we want to retrieve the emotes from
