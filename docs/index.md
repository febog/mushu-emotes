# Hello world!

Hi :)

![pepeL](https://cdn.betterttv.net/emote/5b53f5f2e78929110b2ac92c/3x)

This is a table:

| Item         | Price    | # In stock |
| ------------ | -------- | ---------- |
| Juicy Apples | 1.99     | _7_        |
| Bananas      | **1.89** | 5234       |

Table with image?

| Item                                                                  | Price    | # In stock |
| --------------------------------------------------------------------- | -------- | ---------- |
| ![pepeL](https://cdn.betterttv.net/emote/5b53f5f2e78929110b2ac92c/3x) | 1.99     | _7_        |
| ![pepeL](https://cdn.betterttv.net/emote/5b53f5f2e78929110b2ac92c/2x) | **1.89** | 5234       |

HTML in Markdown

<table>
    <thead>
        <tr>
            <th>The table header</th>
            <th>The table header</th>
            <th>The table header</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>The table body</td>
            <td>with two columns</td>
            <td>with two columns</td>
        </tr>
    </tbody>
</table>

Data load

<style type="text/css">
  .emote-thumbnail {
    width: 100%;
    max-width: 50px;
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
