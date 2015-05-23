# jsxc: A simplified JSX tool

```
jsxc 0.1.0: Convert files containing JSX syntax to regular JavaScript.
Usage:
  node ./bin/jsxc [input file] [output file] (convert a single file)
  node ./bin/jsxc [input file] (convert a single file and print to stdout)
  node ./bin/jsxc - (convert stdin and print to stdout)
  node ./bin/jsxc [--extension .js] --watch [src dir] [dest dir] (watch src dir and place converted files in dest dir)

Options:
  -w, --watch      Watch a directory for changes
  -e, --extension  Extension of files containing JSX syntax  [default: ".js"]
  -s, --silent     Don't display non-error logging           [default: false]
  -h, --help       Show this h
```
