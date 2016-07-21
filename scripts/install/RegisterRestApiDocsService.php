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


use oat\taoRestApiDocs\model\service\docs\DocsService;

class RegisterRestApiDocsStorage extends \common_ext_action_InstallAction
{
    public function __invoke($params)
    {
        // create new storage for docs
        $dataPath = FILES_PATH . 'taoRestAPI' . DIRECTORY_SEPARATOR. DocsService::OPTION_STORAGE . DIRECTORY_SEPARATOR;
        if (file_exists($dataPath)) {
            \helpers_File::emptyDirectory($dataPath);
        }

        /** @var \core_kernel_versioning_Repository $source */
        $source = \tao_models_classes_FileSourceService::singleton()->addLocalSource('docsDirectory', $dataPath);
        \taoItems_models_classes_ItemsService::singleton()->setDefaultFileSource($source);
    }
}
