require("dotenv").config();
const axios = require("axios");

let emoteList = [];

async function getEmotes() {
  // Get FFZ channel emotes
  const ffzResponse = await axios.get(process.env.FFZ_CHANNEL_EMOTES_URL);
  ffzResponse.data.sets[process.env.FFZ_SET_ID].emoticons.map((e) =>
    emoteList.push(e.name)
  );

  // Get BTTV Global emotes, undocumented API.
  const bttvGlobalResponse = await axios.get(
    process.env.BTTV_GLOBAL_EMOTES_URL
  );
  bttvGlobalResponse.data.map((e) => emoteList.push(e.code));

  // Get BTTV channel and shared emotes, undocumented API.
  const bttvChannelResponse = await axios.get(
    process.env.BTTV_CHANNEL_EMOTES_URL
  );
  bttvChannelResponse.data.channelEmotes.map((e) => emoteList.push(e.code));
  bttvChannelResponse.data.sharedEmotes.map((e) => emoteList.push(e.code));
  console.log("Number of emotes loaded: ", emoteList.length);
}

getEmotes();
