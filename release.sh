#!/bin/sh

version=$(cat package.json| python -c 'import json, sys; print(json.loads(sys.stdin.read())["version"]);')

if ! git tag | grep -q $version; then
    echo "You need to create & push the tag for v$version first"
    exit 1
fi

prev_version=$(git tag | sort -u | tail -n2 | head -n1)
if [ "$version" = "$prev_version" ]; then
    echo "Previous and current version match, something's fishy. Fix it."
    exit 1
fi

git archive -o bouncemarker-v$version.zip v$version

echo "#################"
echo "Release notes for v$version"
git log --pretty="%h - %s" ${prev_version}..v${version}

