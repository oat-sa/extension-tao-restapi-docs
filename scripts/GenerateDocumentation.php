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

namespace oat\taoRestApiDocs\scripts;


use oat\oatbox\action\Action;
use common_report_Report;
use oat\taoRestApiDocs\helpers\RestDocHelper;
use oat\taoRestApiDocs\model\service\docs\DocsService;

/**
 * Collect documentation from installed extensions and write to storage
 * 
 * Can be runned from console: php index.php "\oat\taoRestApiDocs\scripts\GenerateDocumentation" --dryrun
 * 
 *
 * Class GenerateDocumentation
 * @package oat\taoRestApiDocs\scripts
 */
class GenerateDocumentation implements Action
{

    /**
     * @var common_report_Report
     */
    private $report;

    public function __invoke($params)
    {
        $dryrun = in_array('dryrun', $params) || in_array('--dryrun', $params);
        $this->report = new common_report_Report(common_report_Report::TYPE_INFO, 'Search documentations from the executions...');

        $paths = RestDocHelper::getExtensionsDocsPaths();
        $this->report->add(new common_report_Report(common_report_Report::TYPE_INFO, 'Was founded ' . count($paths) . ' files ...'));

        // replace configuration
        $ext = \common_ext_ExtensionsManager::singleton()->getExtensionById('taoRestApiDocs');
        $config = $ext->getConfig('docs')->getOptions();
        
        $config[DocsService::OPTION_DOCS] = $paths;

        $service = new DocsService($config);
        if ($dryrun) {
            $this->report->add(new common_report_Report(common_report_Report::TYPE_SUCCESS, 'Docs config will be replaced with ' . print_r($config)));
        } else {
            $ext->setConfig('docs', $service);
            $this->report->add(new common_report_Report(common_report_Report::TYPE_SUCCESS, 'Docs config was replaced ...'));
        }
        
        $service->generateDocs();

        if ($dryrun) {
            $this->report->add(new common_report_Report(common_report_Report::TYPE_SUCCESS, "New documentation will be:\n\n" . json_encode($service->getDocs())));
        }else {
            $service->saveDocs();
            $this->report->add(new common_report_Report(common_report_Report::TYPE_SUCCESS, 'Documentation generated'));
        }
        
        return $this->report;
    }
}
