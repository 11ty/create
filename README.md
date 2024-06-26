# `@11ty/create`

A tiny command line utility to create files in a cross-platform way. Requires Node 18 or newer.

In the quick start for Eleventy, there are different commands folks need to use based on their operating system and terminal application.

```sh
# POSIX and PowerShell Core (Windows)
echo '# Header' > index.md

# Command Prompt (Windows cmd.exe, no quotes allowed)
echo # Header > index.md

# Windows PowerShell (`>` defaults to UTF16)
echo '# Header' | out-file -encoding utf8 'index.md'
```

Now we can tell folks to use this everywhere and we’ll always have a UTF8 encoded file at the end:

```sh
npx @11ty/create index.md '# Heading'
npx @11ty/create nested/index.md '# Heading'
```

Installation happens on-the-fly via `npx` and we needn’t put this in a package.json.
