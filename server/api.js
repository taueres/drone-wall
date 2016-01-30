'use strict';

var capitalizeFirstChar = require('./utils').capitalizeFirstChar;

var oldApiMapper = function (gravatarCalculator) {

    return function (builds) {

        return builds.map(function (build) {

            build.updated_at = Math.max(
                build.created_at,
                build.enqueued_at,
                build.started_at,
                build.finished_at
            );

            build.duration = build.started_at && build.finished_at
                ? build.started_at - build.finished_at
                : 0;

            build.status = build.status.toLowerCase();
            if (build.status == 'running') {
                build.status = 'started';
            }
            build.status = capitalizeFirstChar(build.status);

            build.sha = build.created_at + build.commit;

            build.gravatar = gravatarCalculator.getByEmail(build.author_email);

            return build;
        });
    };
};

module.exports = oldApiMapper;
