#!/bin/sh

echo "Running build script.."

TAG_VERSION="v0"
if [ -d .git ]; then
    TAG_VERSION="$(git describe --always)"
    echo "tag: v${TAG_VERSION}"
fi
echo "\n"

# create destination dir
[ ! -d "build/dest/www" ] && mkdir -p build/dest/www

# symlink for web
[ -L "web/scripts" ] && unlink web/scripts
ln -sf ../build/dest/www web/scripts

# install node modules
[ ! -d node_modules ] && npm install

# run build
./node_modules/grunt/bin/grunt --env=${BUILD_TYPE} --tagver=${TAG_VERSION}

exit $?
