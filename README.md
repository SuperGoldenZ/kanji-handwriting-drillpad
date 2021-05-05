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

[KanjiVG](https://github.com/KanjiVG/kanjivg)


## License

```
Copyright 2021 Alexander Harry Golden and released under the Creative Commons Attribution-Share Alike 3.0 license.

http://creativecommons.org/licenses/by-sa/3.0/
```
