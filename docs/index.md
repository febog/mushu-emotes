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

<ul>
{% for emote in site.data.emotes %}
  <li>
    <a href="https://example.com/{{ emote.id }}">
      {{ emote.name }}
    </a>
  </li>
{% endfor %}
</ul>

Image test.
