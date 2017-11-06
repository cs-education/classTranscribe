module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "plugins": [
        "header"
    ],
    "rules": {
        "header/header": [
            "error",
            "block",
            [
                "* Copyright 2015 Board of Trustees of University of Illinois",
                " * All rights reserved.",
                " *",
                " * This source code is licensed under the MIT license found in the",
                " * LICENSE file in the root directory of this source tree.",
                " "
            ]
        ]
    }
};