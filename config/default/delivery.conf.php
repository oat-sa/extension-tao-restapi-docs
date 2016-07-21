<?php

return new \oat\taoRestApiDocs\model\service\docs\DocsService([
    'routes' => DEBUG_MODE ? [
        'Example' => '\oat\taoRestAPI\model\example\v1\HttpRoute'
    ] : []
]);
