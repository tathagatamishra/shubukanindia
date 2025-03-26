`DO NOT INCLUDE () IN FILE NAME`

## Generate Font

- Run `node generateFonts.mjs` to generate `_Fonts.scss` 

&nbsp;

```

my-project/ 
├── public/
│   └── Fonts/
│       ├── ttf/
│       │   ├── my-font-1.ttf
│       │   └── my-font-2.ttf
│       └── otf/
│           ├── my-font-3.otf
│           └── my-font-4.otf
├── src/
│   ├── utils/
│   │   └── generateFonts.js
│   └── styles/
│       └── _Fonts.scss (will be generated)
└── package.json

```

---

## Rename File

Used to rename new fonts. This will add _ttf or _otf to the fonts.

- Go to `cd src/utils/`
- Run `node renameFiles.mjs /path/to/your/folder suffixToAdd`
- `node renameFiles.mjs ./my_folder important`
- `node renameFiles.mjs "C:\Users\johni\Desktop\Shubukan Web\shubukanindia\public\Fonts\otf" otf`

---