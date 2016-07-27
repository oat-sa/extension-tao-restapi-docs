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
use oat\taoRestApiDocs\model\service\docs\DocsService;

class RestDocHelper
{
    
    const DIRECTORY_NAME = 'doc';
    
    /**
     * Collects all documentation files from TAO project extensions
     * 
     * @return array
     */
    public static function getExtensionsDocsPaths()
    {
        $extensions = \common_ext_ExtensionsManager::singleton()->getEnabledExtensions();
        $paths = [];
        /** @var \common_ext_Extension $ext */
        foreach ($extensions as $ext) {
            
            if ($ext->getName() == 'taoRestApiDocs') {
                continue;
            }
            
            try {
                $paths[] = self::getDocPathByExtension($ext);
            } catch (RestApiDocsException $e) {
                continue;
            }
        }
        
        return $paths;
    }

    /**
     * @param string $extName
     * @return \stdClass JSON
     */
    public static function getDocByExtension($extName = '')
    {
        $ext = \common_ext_ExtensionsManager::singleton()->getExtensionById($extName);
        return self::getJsonFromFile(self::getDocPathByExtension($ext));
    }
    
    /**
     * @param $ext
     * @return string
     * @throws RestApiDocsException
     */
    private static function getDocPathByExtension($ext)
    {
        $path = $ext->getDir() . self::DIRECTORY_NAME . DIRECTORY_SEPARATOR . DocsService::FILE_NAME;
        self::checkFile($path);
        return $path;
    }
    
    private static function checkFile($path = '')
    {
        if (!file_exists($path)) {
            throw new RestApiDocsException(__('File with documentation not found'));
        }
    }
    
    public static function getJsonFromFile($path = '')
    {
        self::checkFile($path);
        return json_decode(file_get_contents($path));
    }
}
