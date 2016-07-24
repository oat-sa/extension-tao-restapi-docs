<?php
use oat\tao\helpers\Template;
?>

<link rel="stylesheet" href="<?= Template::css('style.css', 'taoRestApiDocs') ?>"/>


<div class="main-container tao-scope">
    <h1><?= __('Rest API Documentation')?></h1>

    <div class="swagger-section">
        <div id="message-bar" class="swagger-ui-wrap" data-sw-translate>&nbsp;</div>
        <div id="swagger-ui-container" class="swagger-ui-wrap"></div>
    </div>

</div>
