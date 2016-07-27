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

namespace oat\taoRestApiDocs\scripts\install;


use oat\oatbox\filesystem\FileSystemService;
use oat\oatbox\service\ServiceManager;
use oat\taoRestApiDocs\model\service\docs\DocsService;
use oat\taoRestApiDocs\scripts\GenerateDocumentation;

class RegisterRestApiDocsStorage extends \common_ext_action_InstallAction
{
    public function __invoke($params)
    {
        $serviceManager = ServiceManager::getServiceManager();
        $fs = $serviceManager->get(FileSystemService::SERVICE_ID);
        $fs->createLocalFileSystem(DocsService::STORAGE_NAME);
        $serviceManager->register(FileSystemService::SERVICE_ID, $fs);
        
        $generator = new GenerateDocumentation();
        return $generator($params);
    }
}
