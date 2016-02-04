#!/bin/bash

ID="$1"

URL="https://recordings.engineering.illinois.edu:8443/ess/portal/section/$ID"

curl -c "cookies" "$URL" &>/dev/null

curl -b "cookies" -c "cookies" 'https://recordings.engineering.illinois.edu:8443/ess/client/section/'"$ID"'?apiUrl=https%3A%2F%2Fengr-ess.engr.illinois.edu%3A8443%2Fess&userID=anonymousUser&token=39f4f9968844d9cd4a0d4d46c7e4012f1b4781f1822c35fa4e62547e85fe126bfcc502033cfad36fc92e2cc0e8a26cd28c09163fe27a7369b385d90949348b969de1cdecc0f272a11b70ed28bb70e6908dbc7d700a19f144e348d382fe8540ef475646b089c76d4f407e2be069952c781dab9f5c4d2232a9a81cdddf065d8224a25910168d391ffd&contentBaseUri=http%3A%2F%2Frecordings.engineering.illinois.edu%2Fess' \
    -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' \
    -H 'Connection: keep-alive' \
    -H 'Accept-Encoding: gzip, deflate, sdch' \
    -H 'Referer: https://recordings.engineering.illinois.edu:8443/ess/portal/section/'"$ID" \
    -H 'Accept-Language: en-US,en;q=0.8,es;q=0.6' \
    -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36' --compressed &>/dev/null
