# Channel emotes

## Stats

{% assign stats = site.data.stats %}

<table>
  <thead>
    <tr>
      <th>Extension</th>
      <th>Count</th>
      <th>Dashboard</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>BTTV</th>
      <td>{{ stats.bttvCount }}</td>
      <td>
        <a href="https://betterttv.com/users/5ad749ca77a09f45f07746d7">
          BetterTTV - Mushu's emotes
        </a>
      </td>
    </tr>
    <tr>
      <th>FFZ</th>
      <td>{{ stats.ffZCount }}</td>
      <td>
        <a href="https://www.frankerfacez.com/channel/mushu">
          Mushu - FrankerFaceZ
        </a>
      </td>
    </tr>
    <tr>
      <th>Total</th>
      <td>{{ stats.totalCount }}</td>
      <td>-</td>
    </tr>
  </tbody>
</table>

## Emotes

<style type="text/css">
  .emote-thumbnail {
    height: 100%;
    max-height: 50px;
  }
</style>

<table>
  <thead>
    <tr>
      <th>Emote</th>
      <th>Name</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
  {% for emote in site.data.emotes %}
    <tr>
      <td>
        <img
          class="emote-thumbnail"
          src="{{ emote.img_url }}"
          alt="{{ emote.name }}"
          title="{{ emote.name }}"
        />
      </td>
      <td><a href="{{ emote.page_url }}"> {{ emote.name }} </a></td>
      <td>{{ emote.type }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
