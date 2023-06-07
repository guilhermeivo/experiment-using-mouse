## Reduce Material Design Icons Font
- Download Material design icon pack in [google/material-design-icons](https://github.com/google/material-design-icons)
- Identify all icons used in the application
- Using [FontForge](https://fontforge.org/en-US/) app to remove unused selectors
    - Open font file (.tff, .woff, .woff2, ...)
    - Search for available `code point` in [source search](https://fonts.google.com/icons)
    - In FontForge press `Ctrl + Shift + >` and write `U+{code point}` checking "Merge into selection"
    - After selecting all slots, invert the selection (Edit > Select > Invert Selection)
    - Then remove the selected slots (Encoding > Detach & Remove Glyphs)
    - Generate the font (File > Generate Fonts...)
    - To keep the ligas it is necessary to activate the option: `OpenType > Dummy 'DSIG'`

|       | Starting Size KB | Final Size KB |
|-------|------------------|---------------|
| Woff2 | 2.512 KB         | 4 KB          |