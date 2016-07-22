<?php
/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2016  (original work) Open Assessment Technologies SA;
 * 
 * @author Alexander Zagovorichev <zagovorichev@1pt.com>
 */

namespace oat\taoRestApiDocs\helpers;


use oat\taoRestApiDocs\model\exception\RestApiDocsException;

class RestDocHelper
{
    public static function getDocByExtension($ext = '')
    {
        $ext = \common_ext_ExtensionsManager::singleton()->getExtensionById($ext);
        return self::getJsonFromFile($ext->getDir() . 'doc' . DIRECTORY_SEPARATOR . 'rest.json');
    }

    public static function getJsonFromFile($path = '')
    {
        if (!file_exists($path)) {
            throw new RestApiDocsException(__('File with documentation not found'));
        }

        return json_decode(file_get_contents($path));
    }
}
