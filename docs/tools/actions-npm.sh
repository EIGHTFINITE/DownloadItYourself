#!/bin/bash
# Execution starts in .github/workflows/npm.yml or docs/tools/actions-artifacts.sh
export npm_version=$(cat npm_version.txt)
rm npm_version.txt
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v12.10.0-win-x64/node.exe bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install ansi-regex@5.0.1 --no-offline
else
  bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install ansi-regex@5.0.1 --no-offline
fi
rm -rf .npm/
rm package-lock.json
git checkout -- 'package.json'
mkdir -p bin/all/all/ansi-regex/ansi-regex-5.0.1/ansi-regex
mv -T node_modules/ansi-regex bin/all/all/ansi-regex/ansi-regex-5.0.1/ansi-regex
rm -r node_modules/
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v12.10.0-win-x64/node.exe bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install --no-offline --no-engine-strict
else
  bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js install --no-offline --no-engine-strict
fi
rm -rf .npm/
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v12.10.0-win-x64/node.exe bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
else
  bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
fi
rm -rf .npm/
rm -r node_modules/@electron/
rm -r node_modules/@szmarczak/
rm -r node_modules/@types/
rm -r node_modules/buffer-crc32/
rm -r node_modules/buffer-from/
rm -r node_modules/cacheable-request/
rm -r node_modules/clone-response/
rm -r node_modules/concat-stream/
rm -r node_modules/debug/
rm -r node_modules/decompress-response/
rm -r node_modules/defer-to-connect/
rm -r node_modules/duplexer3/
rm -r node_modules/end-of-stream/
rm -r node_modules/env-paths/
rm -r node_modules/extract-zip/
rm -r node_modules/fd-slicer/
rm -r node_modules/get-stream/
rm -r node_modules/got/
rm -r node_modules/http-cache-semantics/
rm -r node_modules/inherits/
rm -r node_modules/isarray/
rm -r node_modules/json-buffer/
rm -r node_modules/jsonfile/
rm -r node_modules/keyv/
rm -r node_modules/lowercase-keys/
rm -r node_modules/mimic-response/
rm -r node_modules/minimist/
rm -r node_modules/mkdirp/
rm -r node_modules/ms/
rm -r node_modules/normalize-url/
rm -r node_modules/once/
rm -r node_modules/p-cancelable/
rm -r node_modules/pend/
rm -r node_modules/prepend-http/
rm -r node_modules/process-nextick-args/
rm -r node_modules/progress/
rm -r node_modules/pump/
rm -r node_modules/readable-stream/
rm -r node_modules/responselike/
rm -r node_modules/semver/
rm -r node_modules/string_decoder/
rm -r node_modules/sumchecker/
rm -r node_modules/to-readable-stream/
rm -r node_modules/typedarray/
rm -r node_modules/universalify/
rm -r node_modules/url-parse-lax/
rm -r node_modules/util-deprecate/
rm -r node_modules/wrappy/
rm -r node_modules/yauzl/
rm -r node_modules/npm-7/node_modules/npm/node_modules/ansi-regex/
rm -r node_modules/npm-7/node_modules/npm/node_modules/cli-table3/node_modules/ansi-regex/
rm -r node_modules/npm-7/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/
rm -r node_modules/npm-6/node_modules/npm/node_modules/ansi-regex/
rm -r node_modules/npm-6/node_modules/npm/node_modules/cliui/node_modules/ansi-regex/
rm -r node_modules/npm-6/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/
rm -r node_modules/npm-6/node_modules/npm/node_modules/wrap-ansi/node_modules/ansi-regex/
rm -r node_modules/npm-6/node_modules/npm/node_modules/yargs/node_modules/ansi-regex/
rm -r node_modules/npm-7/node_modules/npm/node_modules/json-schema/
rm -r node_modules/npm-6/node_modules/npm/node_modules/json-schema/
rm node_modules/tslib/modules/package.json
rm node_modules/electron/install.js
cp -a bin/all/all/ansi-regex/ansi-regex-5.0.1/ansi-regex/ node_modules/npm-7/node_modules/npm/node_modules/ansi-regex/
cp -a bin/all/all/ansi-regex/ansi-regex-5.0.1/ansi-regex/ node_modules/npm-7/node_modules/npm/node_modules/cli-table3/node_modules/ansi-regex/
cp -a bin/all/all/ansi-regex/ansi-regex-5.0.1/ansi-regex/ node_modules/npm-7/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/
cp -a bin/all/all/ansi-regex/ansi-regex-5.0.1/ansi-regex/ node_modules/npm-6/node_modules/npm/node_modules/ansi-regex/
cp -a bin/all/all/ansi-regex/ansi-regex-5.0.1/ansi-regex/ node_modules/npm-6/node_modules/npm/node_modules/cliui/node_modules/ansi-regex/
cp -a bin/all/all/ansi-regex/ansi-regex-5.0.1/ansi-regex/ node_modules/npm-6/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/
cp -a bin/all/all/ansi-regex/ansi-regex-5.0.1/ansi-regex/ node_modules/npm-6/node_modules/npm/node_modules/wrap-ansi/node_modules/ansi-regex/
cp -a bin/all/all/ansi-regex/ansi-regex-5.0.1/ansi-regex/ node_modules/npm-6/node_modules/npm/node_modules/yargs/node_modules/ansi-regex/
rm -r bin/all/all/ansi-regex/
cp -a node_modules/json-schema/ node_modules/npm-7/node_modules/npm/node_modules/json-schema/
cp -a node_modules/json-schema/ node_modules/npm-6/node_modules/npm/node_modules/json-schema/
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-7/node_modules/npm/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-7\/npm\/strip-ansi\"\n  \]/" node_modules/npm-7/node_modules/npm/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-7\/npm\/cli-table3\/ansi-regex\"/" node_modules/npm-7/node_modules/npm/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-7/node_modules/npm/node_modules/cli-table3/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-7\/npm\/cli-table3\"\n  \]/" node_modules/npm-7/node_modules/npm/node_modules/cli-table3/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-7\/npm\/cli-table3\/ansi-regex\"/" node_modules/npm-7/node_modules/npm/node_modules/cli-table3/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-7/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-7\/npm\/string-width\"\n  \]/" node_modules/npm-7/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-7\/npm\/string-width\/ansi-regex\"/" node_modules/npm-7/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-6/node_modules/npm/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-6\/npm\/strip-ansi\"\n  \]/" node_modules/npm-6/node_modules/npm/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-6\/npm\/cliui\/ansi-regex\"/" node_modules/npm-6/node_modules/npm/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-6/node_modules/npm/node_modules/cliui/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-6\/npm\/cliui\"\n  \]/" node_modules/npm-6/node_modules/npm/node_modules/cliui/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-6\/npm\/cliui\/ansi-regex\"/" node_modules/npm-6/node_modules/npm/node_modules/cliui/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-6/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-6\/npm\/string-width\"\n  \]/" node_modules/npm-6/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-6\/npm\/string-width\/ansi-regex\"/" node_modules/npm-6/node_modules/npm/node_modules/string-width/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-6/node_modules/npm/node_modules/wrap-ansi/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-6\/npm\/wrap-ansi\"\n  \]/" node_modules/npm-6/node_modules/npm/node_modules/wrap-ansi/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-6\/npm\/wrap-ansi\/ansi-regex\"/" node_modules/npm-6/node_modules/npm/node_modules/wrap-ansi/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-6/node_modules/npm/node_modules/yargs/node_modules/ansi-regex/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-6\/npm\/yargs\"\n  \]/" node_modules/npm-6/node_modules/npm/node_modules/yargs/node_modules/ansi-regex/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-6\/npm\/yargs\/ansi-regex\"/" node_modules/npm-6/node_modules/npm/node_modules/yargs/node_modules/ansi-regex/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-7/node_modules/npm/node_modules/json-schema/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-7\/npm\"\n  \]/" node_modules/npm-7/node_modules/npm/node_modules/json-schema/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-7\/npm\/json-schema\"/" node_modules/npm-7/node_modules/npm/node_modules/json-schema/package.json
sed -i "0,/\"_inBundle\": false/s//\"_inBundle\": true/" node_modules/npm-6/node_modules/npm/node_modules/json-schema/package.json
sed -i -z "0,/  \"_requiredBy\": \[\n    \".*\"\n  \]/s//  \"_requiredBy\": \[\n    \"\/npm-6\/npm\"\n  \]/" node_modules/npm-6/node_modules/npm/node_modules/json-schema/package.json
sed -i "0,/\"_location\": \".*\"/s//\"_location\": \"\/npm-6\/npm\/json-schema\"/" node_modules/npm-6/node_modules/npm/node_modules/json-schema/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/npm-7/node_modules/npm/node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-7/node_modules/npm/node_modules/cli-table3/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/npm-7/node_modules/npm/node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-7/node_modules/npm/node_modules/string-width/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/npm-7/node_modules/npm/node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-7/node_modules/npm/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/npm-7/node_modules/npm/node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-6/node_modules/npm/node_modules/cliui/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/npm-7/node_modules/npm/node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-6/node_modules/npm/node_modules/string-width/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/npm-7/node_modules/npm/node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-6/node_modules/npm/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/npm-7/node_modules/npm/node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-6/node_modules/npm/node_modules/wrap-ansi/node_modules/strip-ansi/package.json
sed -i "0,/\"ansi-regex\": \".*\"/s//\"ansi-regex\": \"$(cat node_modules/npm-7/node_modules/npm/node_modules/ansi-regex/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-6/node_modules/npm/node_modules/yargs/node_modules/strip-ansi/package.json
sed -i "0,/\"json-schema\": \".*\"/s//\"json-schema\": \"$(cat node_modules/json-schema/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-7/node_modules/npm/node_modules/jsprim/package.json
sed -i "0,/\"json-schema\": \".*\"/s//\"json-schema\": \"$(cat node_modules/json-schema/package.json | python -c "import sys, json; print(json.load(sys.stdin)['version'])")\"/" node_modules/npm-6/node_modules/npm/node_modules/jsprim/package.json
sed -i '/"dependencies": {/,/},/d' -- 'node_modules/electron/package.json'
if [[ "$OSTYPE" == "msys" ]]; then
  bin/windows/x64/node/node-v12.10.0-win-x64/node.exe bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
else
  bin/linux/x64/node/node-v12.10.0-linux-x64/bin/node bin/all/all/npm/npm-$npm_version/npm/bin/npm-cli.js dedupe
fi
rm -rf .npm/
rm -r bin/all/
git checkout -- 'package.json'
# Execution continues in .github/workflows/npm.yml or docs/tools/actions-artifacts.sh ...
