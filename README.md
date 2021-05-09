Kanji Handwriting Drillpad is a Javascript widget which gives feedback on if a Kanji is written correctly or not.

## Development Notes

Here is an example to run locally with Docker

```
docker run -it --name kanji-game --rm --network=host \
   -v /home/vagrant/shared/kanji-game/src:/usr/share/nginx/html \
   -v /home/vagrant/shared/kanji-game/kanjivg/kanji:/usr/share/nginx/html/images/kanji:ro \
   -d nginx:1.20-alpine
```

## Dependencies

The following open source projects were used to make Kanji Handwriting Drillpad.

Provided Under [Creative Commons Attribution-ShareAlike 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/)
* [KanjiVG](https://github.com/KanjiVG/kanjivg)

Provided Under [Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
* [OnsenUI](https://github.com/OnsenUI)

Provided Under [The MIT License](https://opensource.org/licenses/MIT)
* [jQuery](https://jquery.com)
* [Raphaël](https://dmitrybaranovskiy.github.io/raphael)
* [vivus](https://maxwellito.github.io/vivus)

## License

```
Copyright 2021 Alexander Harry Golden and released under the Creative Commons Attribution-Share Alike 3.0 license.

http://creativecommons.org/licenses/by-sa/3.0/
```
